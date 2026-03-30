"use client";
import React, { useState } from 'react';

export default function InputPage() {
  // コンポーネントの中で状態を定義する
  const [name, setName] = useState("");
  const [hobby, setHobby] = useState("");
  const [food, setFood] = useState("");
  const [dream, setDream] = useState("");

  const handleSave = () => {
    // データのバリデーション（空入力チェック）
    if (!name || !hobby || !food || !dream) {
      alert("すべての項目を入力してください！");
      return;
    }

    const profileData = { name, hobby, food, dream }; 
    const jsonStr = JSON.stringify(profileData);
    
    // 日本語対応のBase64変換（btoaだけだと日本語でエラーになるため）
    const base64Data = btoa(unescape(encodeURIComponent(jsonStr))); 
    
    // 生成されたURLへ移動
    window.location.href = `/profile?d=${base64Data}`;
  };

  return (
    <div className="p-10 space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">プロフィール作成</h1>
      <input className="w-full border p-2 rounded" placeholder="名前" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="w-full border p-2 rounded" placeholder="趣味" value={hobby} onChange={(e) => setHobby(e.target.value)} />
      <input className="w-full border p-2 rounded" placeholder="好きな食べ物" value={food} onChange={(e) => setFood(e.target.value)} />
      <input className="w-full border p-2 rounded" placeholder="将来の夢" value={dream} onChange={(e) => setDream(e.target.value)} />
      
      <button 
        onClick={handleSave}
        className="w-full bg-pink-500 text-white p-3 rounded-xl font-bold hover:bg-pink-600 transition"
      >
        プロフィールカードを作成する
      </button>
    </div>
  );
}