"use client";
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';

function ProfileContent() {
  const searchParams = useSearchParams();
  const dataRaw = searchParams.get('d');

  if (!dataRaw) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="p-8 bg-white rounded-3xl shadow-xl text-center">
        <p className="text-slate-400 font-bold">Data Not Found</p>
        <a href="/" className="text-purple-500 underline mt-4 block">Back to Home</a>
      </div>
    </div>
  );

  try {
    const decodedData = JSON.parse(decodeURIComponent(escape(atob(dataRaw))));

    return (
      <div className="min-h-screen bg-[#1a1a1a] p-6 flex items-center justify-center">
        {/* カード背景の光漏れ演出 */}
        <div className="absolute w-[300px] h-[300px] bg-purple-600/20 blur-[100px] rounded-full"></div>

        <div className="relative w-full max-w-[380px] bg-[#252525] rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden">
          {/* 上部のグラデーション */}
          <div className="h-32 bg-gradient-to-br from-purple-500 to-pink-500"></div>

          <div className="px-8 pb-10">
            {/* プロフィール画像部分 */}
            <div className="relative -mt-16 mb-6 flex justify-center">
              <div className="w-32 h-32 bg-[#252525] p-2 rounded-full shadow-2xl">
                <div className="w-full h-full bg-gradient-to-tr from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-5xl border border-white/10">
                  ✨
                </div>
              </div>
            </div>

            <div className="text-center mb-10">
              <h1 className="text-3xl font-black text-white tracking-tight mb-2">{decodedData.name}</h1>
              <p className="text-purple-400 text-xs font-black uppercase tracking-[0.3em]">Special Profile Card</p>
            </div>

            <div className="space-y-6">
              {[
                { label: "Hobby", val: decodedData.hobby, color: "text-blue-400" },
                { label: "Favorite Food", val: decodedData.food, color: "text-orange-400" },
                { label: "My Dream", val: decodedData.dream, color: "text-emerald-400", isBox: true },
              ].map((item, i) => (
                <div key={i} className="group">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className={`font-bold leading-tight ${item.isBox ? 'bg-white/5 p-4 rounded-2xl text-slate-300 italic text-lg' : `text-xl ${item.color}`}`}>
                    {item.val}
                  </p>
                </div>
              ))}
            </div>

            <button 
              onClick={() => window.location.href = '/'}
              className="w-full mt-10 py-4 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl text-sm font-bold transition-all border border-white/5"
            >
              ← Create New One
            </button>
          </div>
        </div>
      </div>
    );
  } catch (e) {
    return <div className="text-white text-center p-20">Error.</div>;
  }
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1a1a1a]"></div>}>
      <ProfileContent />
    </Suspense>
  );
}