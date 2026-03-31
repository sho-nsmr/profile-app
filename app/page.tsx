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
    <div className="relative min-h-screen bg-sky-50 p-4 font-sans text-slate-900 overflow-x-hidden">
      
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-orange-500/80 backdrop-blur-sm">
          <div className="text-6xl animate-bounce">🔥</div>
          <p className="mt-4 text-xl font-bold text-white animate-pulse text-center">
            Гал асааж байна...<br/>(着火中...)
          </p>
        </div>
      )}

      <div className={`max-w-md mx-auto transition-all duration-1000 ${qrUrl ? "animate-bounce mt-10" : "mt-4"}`}>
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-pink-200">
          <div className="bg-pink-400 p-6 text-white text-center">
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

            <button 
              type="button" 
              onClick={handleSave}
              disabled={isLoading}
              className={`w-full font-bold py-4 rounded-full shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                isLoading ? "bg-gray-300 cursor-not-allowed" : "bg-gradient-to-r from-orange-400 to-red-500 text-white"
              }`}
            >
              {isLoading ? "Уншиж байна..." : "Гал асаах (着火)"}
            </button>
          </form>

          {qrUrl && !isLoading && (
            <div className="p-6 bg-pink-50 border-t-4 border-dashed border-pink-200 text-center flex flex-col items-center">
              <p className="text-pink-600 font-bold mb-4">🎈 Дээшээ хөөрлөө! (舞い上がれ！)</p>
              <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-pink-1