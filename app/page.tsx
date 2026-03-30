"use client";
import React, { useState } from 'react';

export default function InputPage() {
  const [name, setName] = useState("");
  const [hobby, setHobby] = useState("");
  const [food, setFood] = useState("");
  const [dream, setDream] = useState("");

  const handleSave = () => {
    if (!name || !hobby || !food || !dream) {
      alert("すべての項目を入力してください！✨");
      return;
    }
    const profileData = { name, hobby, food, dream }; 
    const jsonStr = JSON.stringify(profileData);
    const base64Data = btoa(unescape(encodeURIComponent(jsonStr))); 
    window.location.href = `/profile?d=${base64Data}`;
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#f0f2f5] overflow-hidden p-4">
      {/* 背景の装飾（ふわふわした丸） */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-pink-200 to-purple-200 blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tr from-blue-200 to-teal-200 blur-3xl opacity-60"></div>

      {/* フォーム本体 */}
      <div className="relative z-10 w-full max-w-[450px] bg-white/70 backdrop-blur-xl p-8 sm:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50">
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-white rounded-2xl shadow-sm mb-4">
            <span className="text-3xl">📝</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Create Profile</h1>
          <p className="text-slate-500 mt-2 font-medium">情報を入力してカードを作ろう</p>
        </div>
        
        <div className="space-y-6">
          {[
            { label: "Name", val: name, set: setName, ph: "お名前", icon: "👤" },
            { label: "Hobby", val: hobby, set: setHobby, ph: "趣味", icon: "🎨" },
            { label: "Favorite Food", val: food, set: setFood, ph: "好きな食べ物", icon: "🍕" },
          ].map((item, i) => (
            <div key={i} className="group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">
                {item.label}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-40">{item.icon}</span>
                <input 
                  className="w-full bg-white border-2 border-slate-100/50 pl-11 pr-4 py-3.5 rounded-2xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 text-slate-700 font-medium shadow-sm"
                  placeholder={item.ph} value={item.val} onChange={(e) => item.set(e.target.value)}
                />
              </div>
            </div>
          ))}

          <div className="group">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">
              Future Dream
            </label>
            <div className="relative">
              <span className="absolute left-4 top-5 text-lg opacity-40">🚀</span>
              <textarea 
                className="w-full bg-white border-2 border-slate-100/50 pl-11 pr-4 py-4 rounded-2xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 text-slate-700 font-medium shadow-sm h-32 resize-none"
              onChange={(e) => setDream(e.target.value)}              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full mt-10 bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-purple-600 hover:shadow-purple-200 hover:-translate-y-1 active:scale-95 transition-all duration-300 group flex items-center justify-center gap-2"
        >
          <span>カードを生成する</span>
          <span className="group-hover:translate-x-1 transition-transform">✨</span>
        </button>
      </div>
    </div>
  );
}