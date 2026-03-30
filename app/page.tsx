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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-white/50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
            Profile Maker
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">あなただけの紹介カードを作ろう</p>
        </div>
        
        <div className="space-y-5">
          {[
            { label: "お名前", val: name, set: setName, ph: "例: ヤマダ タロウ", type: "input" },
            { label: "趣味", val: hobby, set: setHobby, ph: "例: 写真、旅行", type: "input" },
            { label: "好きな食べ物", val: food, set: setFood, ph: "例: お寿司", type: "input" },
            { label: "将来の夢", val: dream, set: setDream, ph: "例: 世界一周したい！", type: "textarea" },
          ].map((field, i) => (
            <div key={i} className="space-y-1">
              <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">{field.label}</label>
              {field.type === "input" ? (
                <input 
                  className="w-full bg-white/50 border-2 border-slate-100 p-3 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none