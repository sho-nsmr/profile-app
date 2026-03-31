"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BinderPage() {
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {
    const savedData = localStorage.getItem("my-binder");
    if (savedData) {
      setFriends(JSON.parse(savedData));
    }
  }, []);

  return (
    <div className="min-h-screen bg-orange-50 p-6 font-sans">
      <div className="max-w-md mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-orange-600 flex items-center gap-2">
            <span>📖</span> Миний цуглуулга (My Binder)
          </h1>
          <Link href="/" className="text-sm font-bold text-orange-400 bg-white px-4 py-2 rounded-full shadow-sm border border-orange-100">
            Буцах (戻る)
          </Link>
        </header>

        {friends.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border-4 border-dashed border-orange-200">
            <p className="text-orange-400 font-bold leading-relaxed">
              Найзууд чинь хараахан алга...<br/>
              (まだ友達がいません...)
            </p>
            <p className="text-sm text-orange-300 mt-2">QR кодыг уншуулж цуглуулаарай!<br/>(QRをスキャンして集めよう！)</p>
            <div className="text-6xl mt-6 opacity-20">🔍</div>
          </div>
        ) : (
          <div className="grid gap-4">
            {friends.map((friend, index) => (
              <Link 
                key={index} 
                href={`/view?data=${btoa(encodeURIComponent(JSON.stringify(friend)))}`}
                className="group relative bg-white p-5 rounded-2xl shadow-md border-l-8 border-orange-400 hover:translate-x-2 transition-all flex items-center justify-between"
              >
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{friend.name}</h2>
                  <p className="text-xs text-orange-400 font-medium">
                    {friend.hobby || "Хобби нууц (趣味は秘密)"}
                  </p>
                </div>
                <div className="text-2xl group-hover:scale-125 transition-transform">🎈</div>
                
                {/* バインダーの穴の装飾 */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                  <div className="w-2 h-2 bg-orange-100 rounded-full shadow-inner" />
                  <div className="w-2 h-2 bg-orange-100 rounded-full shadow-inner" />
                </div>
              </Link>
            ))}
            <p className="text-center text-orange-300 text-xs font-bold mt-6 py-4">
              ✨ Нийт {friends.length} найз цугларлаа ✨<br/>
              (合計 {friends.length} 人の友達が集まったよ)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}