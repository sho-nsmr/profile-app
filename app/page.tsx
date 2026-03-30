"use client";

import React, { useState } from 'react';
import QRCode from "react-qr-code";

export default function Home() {
  // --- 1. 入力内容を記憶するための変数 (State) ---
  const [name, setName] = useState("");
  const [hobby, setHobby] = useState("");
  const [food, setFood] = useState("");
  const [dream, setDream] = useState("");
  
  // 生成されたQRコード用のURLを保存する変数
  const [qrUrl, setQrUrl] = useState("");

  // --- 2. 保存ボタンを押した時の動き ---
  const handleSave = () => {
    // 【追加】名前が入力されているかチェック
    if (!name.trim()) {
      alert("Нэрээ оруулна уу! (名前を入力してください！)");
      return; // ここで処理を中断
    }

    const profileData = { name, hobby, food, dream };
    
    // ブラウザのメモリに一時保存
    localStorage.setItem("my-profile", JSON.stringify(profileData));
    
    // 入力内容をURLパラメータに変換してQR用のURLを作成
    const encodedData = btoa(encodeURIComponent(JSON.stringify(profileData)));
    const demoUrl = `${window.location.origin}/view?data=${encodedData}`;
    
    setQrUrl(demoUrl);
    
    alert("Хадгалагдлаа! (保存されました！)\nQRコードを友達に見せてね。");
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
          {/* 名前 (必須) */}
          <div>
            <label className="block text-pink-600 font-bold mb-1 text-sm">
              Нэр (名前) <span className="text-red-500">*必須</span>
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-b-2 border-pink-200 focus:border-pink-500 outline-none p-2 bg-pink-50/50 rounded"
              placeholder="Нэрээ бичээрэй..."
              required
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
              Хадгалах (保存してQR作成)
            </button>
          </div>
        </form>

        {/* --- QRコード表示エリア --- */}
        {qrUrl && (
          <div className="p-6 bg-pink-50 border-t-4 border-pink-100 text-center flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <p className="text-pink-600 font-bold mb-4">Найздаа үзүүлээрэй! (友達に見せてね！)</p>
            <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-pink-100">
              <QRCode 
                value={qrUrl} 
                size={180} 
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </div>
            <p className="text-[10px] text-pink-300 mt-4 break-all opacity-70">
              {qrUrl}
            </p>
          </div>
        )}
      </div>
      <p className="text-center text-pink-300 text-xs mt-8">© 2026 Mazaalai Profile</p>
    </div>
  );
}