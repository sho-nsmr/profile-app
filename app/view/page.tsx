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

  if (error) return <div className="p-10 text-center text-pink-600 font-bold">Проファイル олдсонгүй</div>;
  if (!profile) return <div className="p-10 text-center text-pink-400">Loading...</div>;

  const getFoodName = (code: string) => {
    const foods: {[key: string]: string} = {
      buuz: "Бууз (ブーズ) 🥟",
      khuushuur: "Хуушуур (ホーショール) 🥟",
      tsuivan: "Цуйван (ツイワン) 🍝",
      horhog: "Хорхог (ホルホグ) 🍖"
    };
    return foods[code] || "Сонгоогүй";
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-pink-200 mt-10 animate-in slide-in-from-top-full duration-[2000ms] ease-out shadow-pink-200/50">
      <div className="bg-pink-400 p-8 text-white text-center relative">
        <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-inner">
          🎈
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{profile.name}-ийн проファイル</h1>
        <p className="text-xs opacity-80 mt-1">Газардаж байна... (着陸！)</p>
      </div>
      
      <div className="p-8 space-y-6 bg-gradient-to-b from-white to-pink-50">
        <section>
          <h2 className="text-xs font-bold text-pink-400 mb-2 uppercase">✨ Хобби (趣味)</h2>
          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm text-lg">
            {profile.hobby || "---"}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold text-pink-400 mb-2 uppercase">😋 Дуртай хоол (好きな食べ物)</h2>
          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm text-lg">
            {getFoodName(profile.food)}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold text-pink-400 mb-2 uppercase">🌈 Ирээдүйн хүсэл (将来の夢)</h2>
          <div className="bg-white p-5 rounded-2xl border-2 border-dashed border-pink-200 italic text-slate-600 leading-relaxed">
            "{profile.dream || "---"}"
          </div>
        </section>

        <div className="pt-6">
          <a href="/" className="block w-full text-center py-4 text-white bg-pink-400 font-bold rounded-full shadow-lg hover:bg-pink-500 transition-all transform active:scale-95 shadow-pink-200">
            Миний профайлыг үүсгэх
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ViewPage() {
  return (
    <div className="min-h-screen bg-sky-50 p-4 overflow-x-hidden relative">
      <div className="fixed top-20 left-10 text-6xl opacity-20 animate-pulse pointer-events-none">☁️</div>
      <div className="fixed top-40 right-10 text-5xl opacity-10 animate-bounce pointer-events-none">☁️</div>
      <div className="fixed bottom-20 left-1/4 text-7xl opacity-10 pointer-events-none">☁️</div>
      
      <Suspense fallback={<div className="text-center p-10 text-pink-400">Loading...</div>}>
        <ProfileContent />