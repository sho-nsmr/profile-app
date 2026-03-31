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
        // 少し遅れて着地させる演出
        setTimeout(() => setIsLanded(true), 800);
      } catch (e) {
        console.error("Data decode error:", e);
      }
    }
  }, [searchParams]);

  if (!profile) return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="animate-spin text-4xl">🎈</div>
      <p className="mt-4 text-pink-400 font-medium italic">Finding profile...</p>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] relative w-full max-w-sm mx-auto">
      
      {/* 接地面の影エフェクト */}
      <div className={`absolute bottom-10 w-32 h-4 bg-slate-900/10 rounded-[100%] blur-xl transition-all duration-[2000ms] ease-out ${isLanded ? "scale-125 opacity-30" : "scale-50 opacity-0 translate-y-10"}`} />

      {/* メインアニメーションエリア */}
      <div className={`relative z-10 transition-all duration-[1500ms] cubic-bezier(0.17, 0.67, 0.83, 0.67) ${isLanded ? "translate-y-0" : "-translate-y-[120vh]"}`}>
        
        {!isOpen ? (
          /* 到着した気球（未開封状態） */
          <button 
            onClick={() => setIsOpen(true)} 
            className="group flex flex-col items-center cursor-pointer hover:scale-105 transition-transform active:scale-90"
          >
            <div className="relative">
               <div className="text-9xl mb-4 animate-bounce duration-[2000ms]">🎈</div>
               {/* タップを促すヒント */}
               <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse shadow-lg">1</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-8 py-3 rounded-2xl shadow-xl border-2 border-pink-300 text-pink-600 font-bold flex flex-col items-center">
              <span className="text-xs opacity-70 mb-1 italic">Баяр хүргье! (おめでとう！)</span>
              <span>Нээж үзэх (開けてみる)</span>
            </div>
          </button>
        ) : (
          /* プロフィールカード本体 */
          <div className="w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border-4 border-white ring-1 ring-pink-100 animate-in zoom-in-95 spin-in-1 duration-500 ease-out">
            
            {/* ヘッダー */}
            <div className="bg-gradient-to-br from-pink-400 to-rose-400 p-8 text-white text-center relative">
              <div className="absolute top-2 right-4 text-2xl opacity-40">✨</div>
              <div className="absolute bottom-2 left-4 text-2xl opacity-40">✨</div>
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md border border-white/30">
                <span className="text-4xl">👤</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight leading-tight">
                {profile.name}<span className="text-sm font-normal block opacity-90 mt-1">-ийн профайл -</span>
              </h1>
            </div>

            {/* コンテンツ */}
            <div className="p-8 space-y-5 bg-gradient-to-b from-white to-pink-50/30">
              
              <div className="group transition-transform hover:-translate-y-1">
                <label className="flex items-center gap-2 text-[10px] text-pink-400 font-black uppercase tracking-widest mb-1 ml-1">
                  <span>🎨</span> Хобби (趣味)
                </label>
                <div className="bg-white p-4 rounded-2xl border-2 border-pink-50 shadow-sm text-slate-700 font-bold group-hover:border-pink-200 transition-colors">
                  {profile.hobby || "Нууц (秘密)"}
                </div>
              </div>

              <div className="group transition-transform hover:-translate-y-1">
                <label className="flex items-center gap-2 text-[10px] text-pink-400 font-black uppercase tracking-widest mb-1 ml-1">
                  <span>😋</span> Дуртай хоол (好きな食べ物)
                </label>
                <div className="bg-white p-4 rounded-2xl border-2 border-pink-50 shadow-sm text-pink-600 font-bold group-hover:border-pink-200 transition-colors">
                  {profile.food || "Бүгд (全部)"}
                </div>
              </div>

              <div className="group transition-transform hover:-translate-y-1">
                <label className="flex items-center gap-2 text-[10px] text-pink-400 font-black uppercase tracking-widest mb-1 ml-1">
                  <span>🚀</span> Ирээдүйн хүсэл (将来の夢)
                </label>
                <div className="bg-pink-50/50 p-4 rounded-2xl border-2 border-dashed border-pink-200 text-slate-600 italic leading-relaxed group-hover:bg-pink-50 transition-colors">
                  "{profile.dream || "Одоогоор байхгүй..."}"
                </div>
              </div>

              <a 
                href="/" 
                className="mt-4 flex items-center justify-center gap-2 w-full py-4 bg-slate-800 text-white font-bold rounded-2xl shadow-lg hover:bg-slate-900 transition-all active:scale-95"
              >
                <span>🏠</span> Буцах (戻る)
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ViewPage() {
  return (
    <div className="min-h-screen bg-sky-50 p-6 overflow-hidden relative flex flex-col items-center">
      
      {/* 背景の装飾: 作成画面と対照的に、ゆっくり上昇する雲 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] text-7xl opacity-10 animate-pulse">☁️</div>
        <div className="absolute top-[30%] right-[10%] text-6xl opacity-20 animate-bounce duration-[4000ms]">☁️</div>
        <div className="absolute bottom-[40%] left-[15%] text-5xl opacity-10 animate-pulse">☁️</div>
        <div className="absolute bottom-[15%] right-[20%] text-8xl opacity-10">☁️</div>
        
        {/* 地面の草むら風装飾 */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-green-200/50 to-transparent" />
        <div className="absolute bottom-4 left-0 w-full flex justify-around opacity-30 text-3xl">
          <span>🌿</span><span>🌷</span><span>🍀</span><span>🌼</span><span>🌿</span>
        </div>
      </div>

      <Suspense fallback={<div className="mt-20 animate-pulse text-sky-400">Loading Sky...</div>}>
        <ProfileContent />
      </Suspense>

      <footer className="mt-auto pb-4 relative z-10">
        <p className="text-slate-400 text-[10px] tracking-widest uppercase">
          — 2026 Mazaalai Profile Project —
        </p>
      </footer>
    </div>
  );
}