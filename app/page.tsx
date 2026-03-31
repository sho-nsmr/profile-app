"use client";

import React, { useState } from 'react';
import QRCode from "react-qr-code";
import Link from 'next/link'; 

export default function Home() {
  // --- 状態管理 (Төлөв хадгалах) ---
  const [name, setName] = useState("");
  const [hobby, setHobby] = useState("");
  const [food, setFood] = useState("");
  const [dream, setDream] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- 保存とURL生成処理 (Хадгалах болон URL үүсгэх) ---
  const handleSave = () => {
    if (!name.trim()) {
      alert("Нэрээ оруулна уу! (名前を入力してください！)");
      return;
    }
    setIsLoading(true);
    setQrUrl("");

    setTimeout(() => {
      const profileData = { name, hobby, food, dream };
      // データをBase64形式でエンコード (Өгөгдлийг Base64-өөр кодлох)
      const encodedData = btoa(encodeURIComponent(JSON.stringify(profileData)));
      const demoUrl = `${window.location.origin}/view?data=${encodedData}`;
      
      setQrUrl(demoUrl);
      setIsLoading(false);
    }, 2000); // 2秒の演出待ち (2 секундын хүлээлт)
  };

  return (
    <div className="relative min-h-screen bg-sky-100 p-4 font-sans text-slate-900 overflow-hidden">
      
      {/* --- バインダーへのリンク (Цуглуулга руу орох товч) --- */}
      <div className="absolute top-4 right-4 z-30">
        <Link href="/binder" className="flex flex-col items-center group">
          <div className="bg-white p-3 rounded-2xl shadow-lg group-hover:bg-orange-50 transition-colors border-2 border-orange-200">
            <span className="text-2xl">📖</span>
          </div>
          <span className="text-[10px] font-black text-orange-500 mt-1 text-center leading-tight">
            Миний цуглуулга<br/>(バインダー)
          </span>
        </Link>
      </div>

      {/* --- 背景の雲アニメーション (Арын үүлний хөдөлгөөн) --- */}
      {/* QR生成時に背景全体を下