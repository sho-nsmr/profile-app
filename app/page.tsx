"use client";

import React, { useState, useEffect } from 'react';
import QRCode from "react-qr-code";

export default function Home() {
  // --- 1. Stateの定義 ---
  const [name, setName] = useState("");
  const [hobby, setHobby] = useState("");
  const [food, setFood] = useState("");
  const [dream, setDream] = useState("");
  const [qrValue, setQrValue] = useState("");

  // --- 2. 保存ボタンを押した時の動き ---
  const handleSave = () => {
    const profileData = { name, hobby, food, dream };
    const jsonStr = JSON.stringify(profileData);
    
    // ブラウザに保存
    localStorage.setItem("my-profile", jsonStr);
    
    // QRコードを表示用に更新
    setQrValue(jsonStr);
    
    alert("Хадгалагдлаа! (保存されました！)\nQRコードが生成されました。");
  };

  return (
    <div className="min-h-screen bg-pink-50 p-4 font-sans text-slate-900 leading-relaxed">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-pink-200 mt-4">
        
        {/* ヘッダー */}
        <div className="bg-pink-400 p-6 text-white text-center">
          <h1 className="text-2xl font-bold tracking-wider">Миний プロファイル</h1>
          <p className="text-sm mt-1">Найзууддаа өөрийгөө танилцуулаарай!</p>
        </div>

        <form className="p-6 space-y-6">
          {/* 名前入力 */}
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

          {/* 趣味入力 */}
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

          {/* 好きな食べ物選択 */}
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

          {/* 将来の夢入力 */}
          <div>
            <label className="block text-pink-600 font-bold mb-1 text-sm">Ирээдүйн хүスэл (将来の夢)</label>
            <textarea 
              value={dream}
              onChange={(e) => setDream(e.target.value)}
              className="w-full border-2 border-pink-100 focus:border-pink-400 outline-none p-3 bg-pink-50/50 rounded-xl h-28 resize-none"
              placeholder="Би ирээдүйд..."
            />
          </div>

          {/* 保存 & QR作成ボタン */}
          <div className="pt-2">
            <button 
              type="button" 
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold py-4 rounded-full shadow-lg transition-all transform active:scale-95"
            >
              Хадгалах & QR үүсгэх
            </button>
          </div>

          {/* --- QRコード表示エリア --- */}
          {qrValue && (
            <div className="mt-8 p-6 border-t-2 border-dashed border-pink-200 flex flex-col items-center animate-in fade-in duration-500">
              <p className="text-pink-600 font-bold mb-4">Таны QR код:</p>
              <div className="bg-white p-4 rounded-2xl shadow-inner border-2 border-pink-50">
                <QRCode value={qrValue} size={180} />
              </div>
              <p className="text-xs text-slate-400 mt-4 text-center">
                Найз чинь энэ кодыг уншуулаад <br/> таны мэдээллийг харах боломжтой!
              </p>
            </div>
          )}
        </form>
      </div>
      <p className="text-center text-pink-300 text-xs mt-8">© 2026 Mazaalai Profile</p>
    </div>
  );
}


// handleSave関数の中身を書き換え
const handleSave = () => {
  const profileData = { name, hobby, food, dream };
  const jsonStr = JSON.stringify(profileData);
  
  // データをBase64（安全な文字列形式）に変換
  const encodedData = btoa(encodeURIComponent(jsonStr));
  
  // 自分のサイトのURL + データのパラメータ
  const shareUrl = `${window.location.origin}/profile?d=${encodedData}`;
  
  setQrValue(shareUrl); // QRコードをURLにする
  alert("QRコードが新しくなりました！");
};
