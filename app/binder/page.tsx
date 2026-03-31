"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BinderPage() {
  // --- 友達リストの状態管理 (Найзуудын жагсаалт хадгалах төлөв) ---
  const [friends, setFriends] = useState<any[]>([]);

  // --- ローカルストレージからデータを読み込む (LocalStorage-оос өгөгдөл унших) ---
  useEffect(() => {
    const savedData = localStorage.getItem("my-binder");
    if (savedData) {
      try {
        // 保存されたJSONを配列に変換 (Хадгалсан JSON-ыг массив болгох)
        setFriends(JSON.parse(savedData));
      } catch (e) {
        console.error("Binder data error:", e);
        setFriends([]); // エラー時は空にする
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-orange-50 p-6 font-sans">
      <div className="max-w-md mx-auto">
        
        {/* ヘッダーセクション (Толгой хэсэг) */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-orange-600 flex items-center gap-2">
            <span>📖</span> Миний цуглуулга (My Binder)
          </h1>
          <Link href="/" className="text-sm font-bold text-orange-400 bg-white px-4 py-2 rounded-full shadow-sm border border-orange-100 transition-colors hover:bg-orange-50">
            Буцах (戻る)
          </Link>
        </header>

        {/* リストが空の場合の表示 (Жагсаалт хоосон үед харагдах хэсэг) */}
        {friends.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border-4 border-dashed border-orange-200">
            <p className="text-orange-400 font-bold leading-relaxed">
              Найзууд чинь хараахан алга...<br/>
              (まだ友達がいません...)
            </p>
            <p className="text-sm text-orange-300 mt-2">
              QR кодыг уншуулж цуглуулаарай!<br/>
              (QRをスキャンして集めよう！)
            </p>
            <div className="text-6xl mt-6 opacity-20">🔍</div>
          </div>
        ) : (
          /* 友達リストの表示 (Найзуудын жагсаалт харуулах) */
          <div className="grid gap-4">
            {friends.map((friend, index) => (
              <Link 
                key={index} 
                // 各友達の詳細ページへのリンク (Найз бүрийн дэлгэрэнгүй хуудас руу орох холбоос)
                href={`/view?data=${btoa(encodeURIComponent(JSON.stringify(friend)))}`}
                className="group relative bg-white p-5 rounded-2xl shadow-md border-l-8 border-orange-400 hover:translate-x-2 transition-all flex items-center justify-between active:scale-95"
              >
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{friend.name}</h2>
                  <p className="text-xs text-orange-400 font-medium">
                    {friend.hobby || "Хобби нууц (趣味は秘密)"}
                  </p>
                </div>
                
                {/* 右側の装飾アイコン */}
                <div className="text-2xl group-hover:rotate-12 transition-transform">🎈</div>
                
                {/* バインダーの穴の装飾 (Binder-ын нүхний чимэглэл) */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                  <div className="w-2 h-2 bg-orange-100 rounded-full shadow-inner ring-1 ring-orange-200/50" />
                  <div className="w-2 h-2 bg-orange-100 rounded-full shadow-inner ring-1 ring-orange-200/50" />
                </div>
              </Link>
            ))}

            {/* フッターカウンター (Нийт тоолуур) */}
            <p className="text-center text-orange-300 text-xs font-bold mt-6 py-4 bg-white/50 rounded-full border border-orange-100">
              ✨ Нийт {friends.length} найз цугларлаа ✨<br/>
              (合計 {friends.length} 人の友達が集まったよ)
            </p>
          </div>
        )}
      </div>
      
      {/* ページ下部のコピーライト */}
      <footer className="mt-12 text-center">
        <p className="text-orange-200 text-[10px] uppercase tracking-widest">© 2026 Mazaalai Profile</p>
      </footer>
    </div>
  );
}