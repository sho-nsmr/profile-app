"use client";
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';

function ProfileContent() {
  const searchParams = useSearchParams();
  const dataRaw = searchParams.get('d');

  if (!dataRaw) return <div className="min-h-screen flex items-center justify-center bg-slate-100 text-slate-400">Data Missing...</div>;

  try {
    const decodedData = JSON.parse(decodeURIComponent(escape(atob(dataRaw))));

    return (
      <div className="min-h-screen bg-[#f8fafc] p-4 flex items-center justify-center font-sans">
        {/* メインカード */}
        <div className="relative max-w-[360px] w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-white">
          
          {/* 装飾用のアブストラクトな背景 */}
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-tr from-rose-400 to-orange-300 -skew-y-6 origin-top-left scale-110"></div>

          <div className="relative pt-12 pb-8 px-8 flex flex-col items-center">
            {/* アイコン */}
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-5xl shadow-xl mb-4 border-4 border-white">
              🎨
            </div>
            
            <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-1">{decodedData.name}</h1>
            <span className="px-4 py-1 bg-rose-100 text-rose-500 rounded-full text-xs font-bold uppercase tracking-tighter">
              Official Profile
            </span>
          </div>

          <div className="px-8 pb-10 space-y-8">
            {/* 各セクション */}
            {[
              { label: "My Hobby", val: decodedData.hobby, icon: "⭐" },
              { label: "Favorite Food", val: decodedData.food, icon: "😋" },
              { label: "Future Dream", val: decodedData.dream, icon: "🚀", full: true }
            ].map((item, idx) => (
              <div key={idx} className={item.full ? "pt-2" : ""}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">{item.icon}</span>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.label}</p>
                </div>
                <p className={`text-slate-700 ${item.full ? 'text-lg italic font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100' : 'text-xl font-bold ml-6'}`}>
                  {item.val}
                </p>
              </div>
            ))}
          </div>

          {/* 下部のボタン */}
          <div className="bg-slate-50 p-6 flex justify-center">
            <button 
              onClick={() => window.location.href = '/'}
              className="px-8 py-3 bg-white border border-slate-200 text-slate-500 text-sm font-bold rounded-2xl hover:bg-slate-100 hover:text-slate-700 transition-all shadow-sm"
            >
              ← Back to Editor
            </button>
          </div>
        </div>
      </div>
    );
  } catch (e) {
    return <div className="text-center p-20">Error decoding profile.</div>;
  }
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}