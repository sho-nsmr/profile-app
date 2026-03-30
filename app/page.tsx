"use client";

import React, { useState } from 'react';
import QRCode from "react-qr-code";

export default function Home() {
  const [name, setName] = useState("");
  const [hobby, setHobby] = useState("");
  const [food, setFood] = useState("");
  const [dream, setDream] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  
  // --- ローディング状態を管理する変数 ---
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    if (!name.trim()) {
      alert("Нэрээ оруулна уу! (名前を入力してください！)");
      return;
    }

    // 1. ローディング開始！
    setIsLoading(true);
    setQrUrl(""); // 新しく作り直すために一旦消す

    // 2. わざと2秒待たせる（バックエンド通信をしているフリ）
    setTimeout(() => {
      const profileData = { name, hobby, food, dream };
      localStorage.setItem("my-profile", JSON.stringify(profileData));
      
      const encodedData = btoa(encodeURIComponent(JSON.stringify(profileData)));
      const demoUrl = `${window.location.origin}/view?data=${encodedData}`;
      
      setQrUrl(demoUrl);
      
      // 3. ローディング終了！
      setIsLoading(false);
      alert("Амжилттай хадгалагдлаа! (成功しました！)");
    }, 2000); 
  };

  return (
    <div className="relative min-h-screen bg-pink-50 p-4 font-sans text-slate-900 leading-relaxed">
      
      {/* --- ローディングオーバーレイ (isLoadingがtrueの時だけ表示) --- */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-pink-400/80 backdrop-blur-sm transition-all">
          {/* くるくる回るアニメーション */}
          <div className="h-16 w-16 animate-spin rounded-full border-8 border-white border-t-transparent"></div>
          <p className="mt-4 text-xl font-bold text-white animate-pulse">
            Түр хүлээнэ үү... (保存中...)
          </p>
        </div>
      )}

      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-pink-200 mt-4">
        <div className="bg-pink-400 p-6 text-white text-center">
          <h1 className="text-2xl font-bold tracking-wider">Миний profile</h1>
          <p className="text-sm mt-1">Найзууддаа өөрийгөө танилцуулаарай!</p>
        </div>

             <form className="p-6 space-y-6">
          {/* 名前 (必須) */}
          <div>
            <label className="block text-pink-600 font-bold mb-1 text-sm">
              Нэр (名前) <span className="text-red-500">*Шаардлагатай!</span>
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

          <div>
            <label className="block text-pink-600 font-bold mb-1 text-sm">Ирээдүйн хүсэл (将来の夢)</label>
            <textarea 
              value={dream}
              onChange={(e) => setDream(e.target.value)}
              className="w-full border-2 border-pink-100 focus:border-pink-400 outline-none p-3 bg-pink-50/50 rounded-xl h-28 resize-none"
              placeholder="Би ирээдүйд..."
            />
          </div>

          <div className="pt-2">
            <button 
              type="button" 
              onClick={handleSave}
              disabled={isLoading} // ローディング中はボタンを押せなくする
              className={`w-full font-bold py-4 rounded-full shadow-lg transition-all transform active:scale-95 ${
                isLoading 
                  ? "bg-gray-300 cursor-not-allowed" 
                  : "bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white"
              }`}
            >
              {isLoading ? "Уншиж байна..." : "Хадгалах (保存してQR作成)"}
            </button>
          </div>
        </form>

        {qrUrl && !isLoading && (
          <div className="p-6 bg-pink-50 border-t-4 border-pink-100 text-center flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <p className="text-pink-600 font-bold mb-4">Найздаа үзүүлээрэй! (友達に見せてね！)</p>
            <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-pink-100">
              <QRCode value={qrUrl} size={180} />
            </div>
          </div>
        )}
      </div>
      <p className="text-center text-pink-300 text-xs mt-8">© 2026 Mazaalai Profile</p>
    </div>
  );
}