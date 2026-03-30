"use client";
import React, { useState } from 'react';

export default function InputPage() {
  // 1. 状態（State）は必ずコンポーネントの「中」で定義する
  const [name, setName] = useState("");
  const [hobby, setHobby] = useState("");
  const [food, setFood] = useState("");
  const [dream, setDream] = useState("");

  // 2. 保存ボタンの処理もコンポーネントの「中」に書く
  const handleSave = () => {
    // 全ての入力があるかチェック
    if (!name || !hobby || !food || !dream) {
      alert("すべての項目を入力してください");
      return;
    }

    const profileData = { name, hobby, food, dream }; 
    const jsonStr = JSON.stringify(profileData);
    
    // 日本語を安全にBase64に変換する処理
    const base64Data = btoa(unescape(encodeURIComponent(jsonStr))); 
    
    // 生成されたデータを持ってプロフィールページへ移動
    window.location.href = `/profile?d=${base64Data}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center text-slate-800">プロフィール入力</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">お名前</label>
            <input className="w-full border p-2 rounded-md" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">趣味</label>
            <input className="w-full border p-2 rounded-md" value={hobby} onChange={(e) => setHobby(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">好きな食べ物</label>
            <input className="w-full border p-2 rounded-md" value={food} onChange={(e) => setFood(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">将来の夢</label>
            <textarea className="w-full border p-2 rounded-md" value={dream} onChange={(e) => setDream(e.target.value)} />
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="w-full bg-pink-500 text-white py-3 rounded-xl font-bold hover:bg-pink-600 transition-colors"
        >
          プロフィールを作成する
        </button>
      </div>
    </div>
  );
}