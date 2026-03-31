"use client";

import React, { useEffect, useState, Suspense } from 'react'; // Suspenseを追加
import { useSearchParams } from 'next/navigation';

// 1. プロフィールを表示する中身を別コンポーネントに分ける
function ProfileContent() {
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<{
    name: string;
    hobby: string;
    food: string;
    dream: string;
  } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(atob(data)));
        setProfile(decodedData);
      } catch (e) {
        setError(true);
      }
    }
  }, [searchParams]);

  if (error) return <div className="p-10 text-center">Профайл олдсонгүй.</div>;
  if (!profile) return <div className="p-10 text-center text-pink-400">Loading...</div>;

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-pink-200 mt-10">
      <div className="bg-pink-400 p-8 text-white text-center">
        <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-inner">
          <span className="text-4xl">🐱</span>
        </div>
        <h1 className="text-2xl font-bold">{profile.name}-ийн профайл</h1>
      </div>
      <div className="p-8 space-y-6">
        <section>
          <h2 className="text-xs font-bold text-pink-400 mb-1">Хобби</h2>
          <div className="bg-pink-50/50 p-3 rounded-xl border border-pink-100">{profile.hobby || "---"}</div>
        </section>
        {/* ...他の項目も同様に表示... */}
        <section>
          <h2 className="text-xs font-bold text-pink-400 mb-1">Ирээдүйн хүсэл</h2>
          <div className="bg-pink-50/50 p-3 rounded-xl border border-pink-100 italic">"{profile.dream || "---"}"</div>
        </section>
        <div className="pt-4">
          <a href="/" className="block w-full text-center py-3 text-pink-400 font-bold border-2 border-pink-400 rounded-full">
            Буцах (戻る)
          </a>
        </div>
      </div>
    </div>
  );
}

// 2. メインのPageコンポーネントでSuspenseを使って呼び出す
export default function ViewPage() {
  return (
    <div className="min-h-screen bg-pink-50 p-4">
      <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
        <ProfileContent />
      </Suspense>
      <p className="text-center text-pink-300 text-xs mt-8">© 2026 Mazaalai Profile</p>
    </div>
  );
}