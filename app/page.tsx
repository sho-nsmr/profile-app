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
      // アラートは演出を邪魔するので消すか、後出しにするのがおすすめです
    }, 2000); 
  };

  return (
    <div className="relative min-h-screen bg-sky-50 p-4 font-sans text-slate-900 overflow-x-hidden">
      
      {/* ローディング: 火が点くイメージ */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-orange-500/80 backdrop-blur-sm">
          <div className="text-6xl animate-bounce">🔥</div>
          <p className="mt-4 text-xl font-bold text-white animate-pulse">
            Гал асааж байна... (着火中...)
          </p>
        </div>
      )}

      {/* メインカード: QR生成後に気球のように浮くアニメーションを付与 */}
      <div className={`max-w-md mx-auto transition-all duration-1000 ${qrUrl ? "animate-[bounce_3s_infinite] mt-10" : "mt-4"}`}>
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-pink-200">
          <div className="bg-pink-400 p-6 text-white text-center relative">
            {/* 気球のバルーンっぽく見せるための装飾 */}
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-pink-300 rounded-full opacity-50"></div>
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-pink-200 rounded-full opacity-50"></div>
            
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
              <input type="text" value={hobby} onChange={(e) => setHobby(e.target.value)} className="w-full border-b-2 border-pink-100 focus:border-pink-500 outline-none p-2 bg-pink-50/30 rounded" placeholder="Дуртай зүйл..."