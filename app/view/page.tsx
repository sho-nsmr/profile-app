"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

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

  if (error) return <div className="p-10 text-center">Профайл олдсоングүй。</div>;
  if (!profile) return <div className="p-10 text-center">Loading...</div>;

  // 食べ物の名前を変換する関数
  const getFoodName = (code: string) => {
    const foods: {[key: string]: string} = {
      buuz: "Бууз (ブーズ) 🥟",
      khuushuur: "Хуушуур (ホーショール) 🥟",
      tsuivan: "Цуйван (ツイワン) 🍝",
      horhog: "Хорхог (ホルホグ) 🍖"
    };
    return foods[code] || "Сонгоогүй (未設定)";
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-pink-200 mt-10 animate-[bounce_4s_infinite]">
      <div className="bg-pink-400 p-8 text-white text-center">
        <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-inner">
          🎈
        </div>
        <h1 className="text-2xl font-bold">{profile.name}-ийн профайл</h1>
      </div>
      
      <div className="p-8 space-y-6">
        <section>
          <h2 className="text-xs font-bold text-pink-400 mb-1">Хобби (趣味)</h2>
          <div className="bg-pink-50 p-3 rounded-xl border border-pink-100">{profile.hobby || "---"}</div>
        </section>

        {/* 追加：好きな食べ物 */}
        <section>
          <h2 className="text-xs font-bold text-pink-400 mb-1">Дуртай хоол (好きな食べ物)</h2>
          <div className="bg-pink-50 p-3 rounded-xl border border-pink-100">{getFoodName(profile.food)}</div>
        </section>

        <section>
          <h2 className="text-xs font-bold text-pink-400 mb-1">Ирээдүйн хүсэл (将来の夢)</h2>
          <div className="bg-pink-50 p-3 rounded-xl border border-pink-100 italic text-slate-600">
            "{profile.dream || "---"}"
          </div>
        </section>

        <div className="pt-4">
          <a href="/" className="block w-full text-center py-3 text-pink-400 font-bold border-2 border-pink-400 rounded-full hover:bg-pink-400 hover:text-white transition-all">
            Миний профайлыг үүスгэх
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ViewPage() {
  return (
    <div className="min-h-screen bg-sky-50 p-4 overflow-hidden">
      <Suspense fallback={<div className="text-center p-10 text-pink-400">Loading...</div>}>
        <ProfileContent />
      </Suspense>
      {/* 背景の装飾 */}
      <div className="fixed bottom-10 left-5 text-6xl opacity-10">☁️</div>
      <div className="fixed bottom-20 right-5 text-6xl opacity-10">☁️</div>
    </div>
  );
}