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
      localStorage.setItem("my-profile", JSON.stringify(profileData));
      const encodedData = btoa(encodeURIComponent(JSON.stringify(profileData)));
      const demoUrl = `${window.location.origin}/view?data=${encodedData}`;
      setQrUrl(demoUrl);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-sky-100 p-4 font-sans text-slate-900 overflow-hidden">
      
      {/* 雲のデコレーション（増量） */}
      <div className="fixed top-10 left-[10%] text-6xl opacity-30 animate-pulse pointer-events-none">☁️</div>
      <div className="fixed top-32 right-[15%] text-5xl opacity-20 animate-bounce pointer-events-none">☁️</div>
      <div className="fixed bottom-40 left-[5%] text-7xl opacity-25 pointer-events-none">☁️</div>
      <div className="fixed top-1/2 right-[10%] text-4xl opacity-20 animate-pulse pointer-events-none">☁️</div>
      <div className="fixed bottom-20 right-[5%] text-6xl opacity-30 pointer-events-none animate-bounce duration-[5000ms]">☁️</div>
      <div className="fixed top-1/4 left-[80%] text-5xl opacity-10 pointer-events-none">☁️</div>

      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-orange-500/80 backdrop-blur-sm">
          <div className="text-6xl animate-bounce">🔥</div>
          <p className="mt-4 text-xl font-bold text-white animate-pulse text-center">
            Гал асааж байна...<br/>(着火中...)
          </p>
        </div>
      )}

      {/* メインコンテンツ: 上下移動のフロート演出 */}
      <div className={`max-w-md mx-auto transition-all duration-[3000ms] ease-in-out ${qrUrl ? "-translate-y-10 scale-105" : "translate-y-0"}`}>
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-pink-200">
          
          {/* ヘッダー部分: ここだけ pulse させて気球の揺らぎを表現 */}
          <div className={`bg-pink-400 p-6 text-white text-center ${qrUrl ? "animate-pulse" : ""}`}>
            <h1 className="text-2xl font-bold tracking-wider">Миний profile 🎈</h1>
            <p className="text-sm mt-1">Найзууддаа өөрийгөө танилцуулаарай!</p>
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
              {isLoading ? "Уншиж バйна..." : "Гал асаах (着火)"}
            </button>
          </form>

          {/* QRコード表示部分: ここはアニメーションをさせず、くっきり表示 */}
          {qrUrl && !isLoading && (
            <div className="p-6 bg-sky-50 border-t-4 border-dashed border-sky-200 text-center flex flex-col items-center animate-in fade-in zoom-in duration-700">
              <p className="text-sky-600 font-bold mb-4 flex items-center gap-2">
                <span className="animate-bounce">🎈</span> Дээшээ хөөрлөө!
              </p>
              <div className="bg-white p-4 rounded-2xl shadow-md border-2 border-sky-100 ring-4 ring-white">
                <QRCode value={qrUrl} size={150} />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <p className="text-center text-sky-400/60 text-xs mt-8 relative z-10">© 2026 Mazaalai Profile</p>
    </div>
  );
}