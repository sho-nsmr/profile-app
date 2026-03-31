"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ProfileContent() {
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLanded, setIsLanded] = useState(false);

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(atob(data)));
        setProfile(decodedData);
        // 2秒後に着陸完了フラグを立てる
        setTimeout(() => setIsLanded(true), 2000);
      } catch (e) {
        console.error(e);
      }
    }
  }, [searchParams]);

  if (!profile) return <div className="p-10 text-center text-pink-400">Уншиж байна...</div>;

  const getFoodName = (code: string) => {
    const foods: any = {
      buuz: "Бууз 🥟", khuushuur: "Хуушуур 🥟", tsuivan: "Цуйван 🍝", horhog: "Хорхог 🍖"
    };
    return foods[code] || "---";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] relative">
      
      {/* 2. 着陸する影 (地面に映る影) */}
      <div className={`w-32 h-6 bg-black/10 rounded-[100%] blur-xl transition-all duration-[2000ms] ease-out 
        ${isLanded ? "scale-100 opacity-40" : "scale-50 opacity-10 translate-y-20"}`} 
      />

      {/* 気球本体のコンテナ */}
      <div className={`relative z-10 transition-all duration-[2000ms] ease-out 
        ${isLanded ? "translate-y-0" : "-translate-y-[100vh]"}`}>
        
        {!isOpen ? (
          /* 3. 開封前の「タップして」の表示 */
          <button 
            onClick={() => setIsOpen(true)}
            className="group flex flex-col items-center animate-bounce cursor-pointer"
          >
            <div className="text-8xl mb-4 transform group-hover:scale-110 transition-transform">🎈</div>
            <div className="bg-white px-6 py-2 rounded-full shadow-lg border-2 border-pink-400 text-pink-500 font-bold animate-pulse">
              Товшиж нээгээрэй! (タップして開く)
            </div>
          </button>
        ) : (
          /* 3. 開封後のプロフィールカード */
          <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-pink-200 animate-in zoom-in duration-500">
            <div className="bg-pink-400 p-6 text-white text-center