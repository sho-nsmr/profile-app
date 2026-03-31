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

  if (error) return <div className="p-10 text-center text-pink-600 font-bold">Профайл олдсонгүй (見つかりませんでした)</div>;
  if (!profile) return <div className="p-10 text-center text-pink-400 animate-pulse">Loading...</div>;

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
    /* アニメーション解説:
       - animate-in: 入場アニメーション
       - slide-in-from-top-full: 画面の一番上（外側）から
       - duration-1000: 1秒かけて
       - bounce-out: 着陸した時に少しだけ弾む演出
    */
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-pink-200 mt-10 animate-in slide-in-from-top-full duration-[2000ms] ease-out shadow-pink-200/50">
      
      <div className="bg-pink-400 p-8 text-white text-center relative">
        {/* 気球のバルーン部分をイメージした丸 */}
        <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-inner animate-bounce duration-[3000ms]">
          🎈
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{profile.name}-ийн профайл</h1>
        <p className="text-xs opacity-80 mt-1">Газардаж байна... (着陸しました！)</p>
      </div>
      
      <div className="p-8 space-y-6 bg-gradient-to-b from-white to-pink-50">
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700 fill-mode-both">
          <h2 className="text-xs font-bold text-pink-400 mb-2 uppercase tracking-tighter">✨ Хобби (趣味)</h2>
          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm text-lg">
            {profile.hobby || "---"}
          </div>
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-[900ms] fill-mode-both">
          <h2 className="text-xs font-bold text-pink-400 mb-2 uppercase tracking-tighter">😋 Дуртай хоол (好きな食べ物)</h2>
          <div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm text-lg">
            {getFoodName(profile.food)}
          </div>
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-[1100ms] fill-mode-both">
          <h2 className="text-xs font-bold text-pink-400 mb-2 uppercase tracking-tighter">🌈 Ирээдүйн хүсэл (将来の夢)</h2>
          <div className="bg-white p-5 rounded-2xl border-2 border-dashed border-pink-200 italic text-slate-600 leading-relaxed shadow-inner">
            "{profile.dream || "---"}"
          </div>
        </section>

        <div className="pt-6 animate-in fade-in duration-1000 delay-[1300ms] fill-mode-both">
          <a href="/" className="block w-full text-center py-4 text-white bg-pink-400 font-bold rounded-full shadow-lg hover:bg-pink-500 transition-all transform active:scale-95 shadow-pink-200">