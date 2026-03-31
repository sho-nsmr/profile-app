"use client";

import React, { useState } from 'react';
import QRCode from "react-qr-code";
import Link from 'next/link'; 

export default function Home() {
  // --- 状態管理 ---
  const [name, setName] = useState("");
  const [hobby, setHobby] = useState("");
  const [food, setFood] = useState("");
  const [dream, setDream] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- 保存処理 ---
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

  // --- 画面表示 ---
  return (
    <div className="relative min-h-screen bg-sky-100 p-4 font-sans text-slate-900 overflow-hidden">
      
      {/* バインダーボタン */}
      <div className="absolute top-4 right-4 z-30">
        <Link href="/binder" className="flex flex-col items-center group text-decoration-none">
          <div className="bg-white p-3 rounded-2xl shadow-lg group-hover:bg-orange-50 transition-colors border-2 border-orange-200">
            <span className="text-2xl">📖</span>
          </div>
          <span className="text-[10px] font-black text-orange-500 mt-1 text-center leading-tight">
            Миний цуглуулга<br/>(バインダー)
          </span>
        </Link>
      </div>

      {/* 雲の背景レイヤー */}
      <div className={`fixed inset-0 pointer-events-none transition-transform duration-[3000ms] ease-out ${qrUrl ? "translate-y-20" : "translate-y-0"}`}>
        <div className="absolute top-[15%] left-[10%] text-4xl opacity-10 animate-pulse">☁️</div>
        <div className="absolute top-[45%] right-[15%] text-3xl opacity-10 animate-bounce duration-[5000ms]">☁️</div>
        <div className="absolute bottom-[20%] left-[25%] text-5xl opacity-10">☁️</div>
        <div className="absolute top-[5%] right-[25%] text-6xl opacity-20">☁️</div>
        <div className="absolute top-[60%] left-[5%] text-7xl opacity-20">☁️</div>
        <div className="absolute top-[30%] left-[75%] text-6xl opacity-15">☁️</div>
        <div className="absolute top-[75%] right-[5%] text-8xl opacity-30 animate-bounce duration-[6000ms]">☁️</div>
        <div className="absolute -bottom-10 left-[15%] text-9xl opacity-25">☁️</div>
        <div className={`absolute top-[10%] left-[45%] text-6xl transition-opacity duration-1000 ${qrUrl ? "opacity-40" : "opacity-0"}`}>🌈</div>
      </div>

      {/* ローディング */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-orange-500/80 backdrop-blur-sm text-white">
          <div className="text-6xl animate-bounce">🔥</div>
          <p className="mt-4 text-xl font-bold animate-pulse text-center leading-relaxed">
            Гал асааж байна...<br/>(着火中...)
          </p>
        </div>
      )}

      {/* メインカード */}
      <div className={`max-w-md mx-auto pt-16 transition-all duration-[3000ms] ease-in-out ${qrUrl ? "-translate-y-16 scale-105" : "translate-y-0"}`}>
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-pink-200 relative z-10">
          
          <div className={`bg-pink-400 p-6 text-white text-center transition-colors duration-1000 ${qrUrl ? "bg-gradient-to-b from-pink-400 to-orange-400" : ""}`}>
            <h1 className="text-2xl font-bold tracking-wider">Миний profile 🎈</h1>
            <p className="text-sm mt-1 font-medium italic">Найзууддаа өөрийгөө танилцуулаарай!</p>
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
            <button type="button" onClick={handleSave} disabled={isLoading} className={`w-full font-bold py-4 rounded-full shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${isLoading ? "bg-gray-300 cursor-not-allowed" : "bg-gradient-to-r from-orange-400 to-red-500 text-white"}`}>
              {isLoading ? "Уншиж байна..." : "Гал асаах (着火)"}
            </button>
          </form>

          {qrUrl && !isLoading && (
            <div className="p-6 bg-white border-t-4 border-dashed border-sky-100 text-center flex flex-col items-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <p className="text-sky-500 font-bold mb-4 flex items-center gap-2 text-sm">
                <span className="animate-bounce text-2xl">🎈</span> Дээшээ хөөрлөө! (上がったよ！)
              </p>
              <div className="p-4 rounded-2xl bg-white shadow-inner border border-slate-100 ring-8 ring-sky-50">
                <QRCode value={qrUrl} size={160} />
              </div>
              <p className="mt-4 text-[10px] text-slate-400 italic">QR кодыг найздаа уншуулаарай (QRコードを友達に見せてね)</p>
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-sky-400/60 text-[10px] mt-12 relative z-10 tracking-[0.2em]">© 2026 MAZAALAI PROFILE</p>
    </div>
  );
}