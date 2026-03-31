"use client";

import React, { useState } from 'react';
import QRCode from "react-qr-code";

export default function Home() {
  const [name, setName] = useState("");
  const [hobby, setHobby] = useState("");
  const [food, setFood] = useState("");
  const [dream, setDream] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    if (!name.trim()) {
      alert("Нэрээ оруулна уу! (名前を入力してください！)");
      return;
    }
    setIsLoading(true);
    setQrUrl("");
    setTimeout(() => {
      const profileData = { name, hobby, food, dream };
      const encodedData = btoa(encodeURIComponent(JSON.stringify(profileData)));
      const demoUrl = `${window.location.origin}/view?data=${encodedData}`;
      setQrUrl(demoUrl);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-sky-100 p-4 font-sans text-slate-900 overflow-hidden">
      
      {/* --- 雲のデコレーションレイヤー --- */}
      {/* qrUrlがある時、雲全体が transition で下に下がる（＝気球が上がったように見える） */}
      <div className={`fixed inset-0 pointer-events-none transition-transform duration-[3000ms] ease-out ${qrUrl ? "translate-y-20" : "translate-y-0"}`}>
        
        {/* 【遠景】小さく、薄く、動きが遅い */}
        <div className="absolute top-[15%] left-[10%] text-4xl opacity-10 animate-pulse">☁️</div>
        <div className="absolute top-[45%] right-[15%] text-3xl opacity-10 animate-bounce duration-[5000ms]">☁️</div>
        <div className="absolute bottom-[20%] left-[25%] text-5xl opacity-10">☁️</div>

        {/* 【中景】標準サイズ、左右のバランス配置 */}
        <div className="absolute top-[5%] right-[25%] text-6xl opacity-20 animate-drift-slow">☁️</div>
        <div className="absolute top-[60%] left-[5%] text-7xl opacity-20 animate-pulse duration-[4000ms]">☁️</div>
        <div className="absolute top-[30%] left-[75%] text-6xl opacity-15">☁️</div>

        {/* 【近景】大きく、少し濃い、視覚的なアクセント */}
        <div className="absolute top-[75%] right-[5%] text-8xl opacity-30 animate-bounce duration-[6000ms]">☁️</div>
        <div className="absolute -bottom-10 left-[15%] text-9xl opacity-25">☁️</div>
        
        {/* 隠れ要素: 虹（QRが出た時だけ少し見えるように配置） */}
        <div className={`absolute top-[10%] left-[45%] text-6xl transition-opacity duration-1000 ${qrUrl ? "opacity-40" : "opacity-0"}`}>🌈</div>
      </div>

      {/* ローディング画面 */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-orange-500/80 backdrop-blur-sm">
          <div className="text-6xl animate-bounce">🔥</div>
          <p className="mt-4 text-xl font-bold text-white animate-pulse text-center">
            Гал асааж байна...<br/>(着火中...)
          </p>
        </div>
      )}

      {/* メインコンテンツ: 気球本体の上昇演出 */}
      <div className={`max-w-md mx-auto transition-all duration-[3000ms] ease-in-out ${qrUrl ? "-translate-y-16 scale-105" : "translate-y-0"}`}>
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-pink-200 relative z-10">
          
          <div className={`bg-pink-400 p-6 text-white text-center transition-colors duration-1000 ${qrUrl ? "bg-gradient-to-b from-pink-400 to-orange-400" : ""}`}>
            <h1 className="text-2xl font-bold tracking-wider">Миний profile 🎈</h1>
            <p className="text-sm mt-1 font-medium">Найзууддаа өөрийгөө танилцуулаарай!</p>
          </div>

          <form className="p-6 space-y-4">
            <div>
              <label className="block text-pink-600 font-bold mb-1 text-sm">Нэр (名前) *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border-b-2 border-pink-100 focus:border-pink-500 outline-none p-2 bg-pink-50/30 rounded" placeholder="Нэр..." required />
            </div>
            <div>
              <label className="block text-pink-600 font-bold mb-1 text-sm">Хобби (趣味)</label>
              <input type="text" value={hobby} onChange={(e) => setHobby(e.target.value)} className="w-full border-b-2 border-pink-100 focus:border-pink-500 outline-none p-2 bg-pink-50/30 rounded" placeholder="Дуртай зүйл..." />
            </div>
            <div>
              <label className="block text-pink-600 font-bold mb-1 text-sm">Дуртай хоол (好きな食べ物)</label>
              <select value={food} onChange={(e) => setFood(e.target.value)} className="w-full border-b-2 border-pink-100 focus:border-pink-500 outline-none p-2 bg-pink-50/30 rounded">
                <option value="">Сонгох...</option>
                <option value="buuz">Бууз (ブーズ)</option>
                <option value="khuushuur">Хуушуур (ホーショール)</option>
                <option value="tsuivan">Цуйван (ツイワン)</option>
                <option value="horhog">Хорхог (ホルホグ)</option>
              </select>
            </div>
            <div>
              <label className="block text-pink-600 font-bold mb-1 text-sm">Ирээдүйн хүсэл (将来の夢)</label>
              <textarea value={dream} onChange={(e) => setDream(e.target.value)} className="w-full border-2 border-pink-100 focus:border-pink-400 outline-none p-3 bg-pink-50/30 rounded-xl h-24 resize-none" />
            </div>
            
            <button 
              type="button" 
              onClick={handleSave} 
              disabled={isLoading} 
              className={`w-full font-bold py-4 rounded-full shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${isLoading ? "bg-gray-300 cursor-not-allowed" : "bg-gradient-to-r from-orange-400 to-red-500 text-white"}`}
            >
              {isLoading ? "Уншиж байна..." : "Гал асаах (着火)"}
            </button>
          </form>

          {/* QRコード表示部分 */}
          {qrUrl && !isLoading && (
            <div className="p-6 bg-white border-t-4 border-dashed border-sky-100 text-center flex flex-col items-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <p className="text-sky-500 font-bold mb-4 flex items-center gap-2">
                <span className="animate-bounce text-2xl">🎈</span> Дээшээ хөөрлөө!
              </p>
              <div className="p-4 rounded-2xl bg-white shadow-inner border border-slate-100 ring-8 ring-sky-50">
                <QRCode value={qrUrl} size={160} />
              </div>
              <p className="mt-4 text-[10px] text-slate-400">Scan to view profile</p>
            </div>
          )}
        </div>
      </div>
      
      <p className="text-center text-sky-400/60 text-xs mt-12 relative z-10">© 2026 Mazaalai Profile</p>
    </div>
  );
}