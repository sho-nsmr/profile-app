"use client";

import React, { useState } from 'react';

export default function Home() {
  // --- 1. 入力内容を記憶するための変数 (State) ---
  const [name, setName] = useState("");
  const [hobby, setHobby] = useState("");
  const [food, setFood] = useState("");
  const [dream, setDream] = useState("");

  // --- 2. 保存ボタンを押した時の動き ---
  const handleSave = () => {
    const profileData = { name, hobby, food, dream };
    
    // ブラウザのメモリに一時保存（リロードしても消えなくなります）
    localStorage.setItem("my-profile", JSON.stringify(profileData));
    
    alert("Хадгалагдлаа! (保存されました！)\n次はこれをQRコードにする準備をしましょう。");
    console.log("保存されたデータ:", profileData);
  };

  return (
    <div className="min-h-screen bg-pink-50 p-4 font-sans text-slate-900 leading-relaxed">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-pink-200 mt-4">
        <div className="bg-pink-400 p-6 text-white text-center">
          <h1 className="text-2xl font-bold tracking-wider">Миний プロファイル</h1>
          <p className="text-sm mt-1">Найзууддаа өөрийгөө танилцуулаарай!</p>
        </div>

        <form className="p-6 space-y-6">
          {/* 名前 */}
          <div>
            <label className="block text-pink-600 font-bold mb-1 text-sm">Нэр (名前)</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-b-2 border-pink-200 focus:border-pink-500 outline-none p-2 bg-pink-50/50 rounded"
              placeholder="Нэрээ бичээрэй..."
            />
          </div>

          {/* 趣味 */}
          <div>
            <label className="block text-pink-600 font-bold mb-1 text-sm">Хобби (趣味)</label>
            <input 
              type="text" 
              value={hobby}
              onChange={(e) => setHobby(e.target.value)}
              className="w-full border-b-2 border-pink-200 focus:border-pink-500 outline-none p-2 bg-pink-50/50 rounded"
              placeholder="Дуртай зүйл..."
            />
          </div>

          {/* 好きな食べ物 */}
          <div>
            <label className="block text-pink-600 font-bold mb-1 text-sm">Дуртай хоол (好きな食べ物)</label>
            <select 
              value={food}
              onChange={(e) => setFood(e.target.value)}
              className="w-full border-b-2 border-pink-200 focus:border-pink-500 outline-none p-2 bg-pink-50/50 rounded"
            >
              <option value="">Сонгох...</option>
              <option value="buuz">Бууз (ブーズ)</option>
              <option value="khuushuur">Хуушуур (ホーショール)</option>
              <option value="tsuivan">Цуйван (ツイワン)</option>
              <option value="horhog">Хорхог (ホルホグ)</option>
            </select>
          </div>

          {/* 将来の夢 */}
          <div>
            <label className="block text-pink-600 font-bold mb-1 text-sm">Ирээдүйн хүсэл (将来の夢)</label>
            <textarea 
              value={dream}
              onChange={(e) => setDream(e.target.value)}
              className="w-full border-2 border-pink-100 focus:border-pink-400 outline-none p-3 bg-pink-50/50 rounded-xl h-28 resize-none"
              placeholder="Би ирээдүйд..."
            />
          </div>

          {/* 保存ボタン */}
          <div className="pt-2">
            <button 
              type="button" 
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold py-4 rounded-full shadow-lg transition-all transform active:scale-95"
            >
              Хадгалах (保存する)
            </button>
          </div>
        </form>
      </div>
      <p className="text-center text-pink-300 text-xs mt-8">© 2026 Mazaalai Profile</p>
    </div>
  );
}
