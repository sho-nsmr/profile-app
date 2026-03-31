"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ProfileContent() {
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<any>(null);
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

  if (error) return <div className="p-10 text-center">Error</div>;
  if (!profile) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-pink-200 mt-10 animate-in slide-in-from-top-full duration-[2000ms]">
      <div className="bg-pink-400 p-8 text-white text-center">
        <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">🎈</div>
        <h1 className="text-xl font-bold">{profile.name}-ийн профайл</h1>
      </div>
      <div className="p-6 space-y-4 bg-white">
        <div className="bg-pink-50 p-3 rounded-xl">
          <p className="text-xs text-pink-400 font-bold">趣味</p>
          <p>{profile.hobby || "---"}</p>
        </div>
        <div className="bg-pink-50 p-3 rounded-xl">
          <p className="text-xs text-pink-400 font-bold">好きな食べ物</p>
          <p>{profile.food || "---"}</p>
        </div>
        <div className="bg-pink-50 p-3 rounded-xl">
          <p className="text-xs text-pink-400 font-bold">将来の夢</p>
          <p className="italic">"{profile.dream || "---"}"</p>
        </div>
        <a href="/" className="block w-full text-center py-3 bg-pink-400 text-white font-bold rounded-full">戻る</a>
      </div>
    </div>
  );
}

export default function ViewPage() {
  return (
    <div className="min-h-screen bg-sky-50 p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileContent />
      </Suspense>
    </div>
  );
}