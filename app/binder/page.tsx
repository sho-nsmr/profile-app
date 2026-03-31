"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BinderPage() {
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {
    const savedData = localStorage.getItem("my-binder");
    if (savedData) {
      try {
        setFriends(JSON.parse(savedData));
      } catch (e) {
        console.error("Binder data error:", e);
        setFriends([]);
      }
    }
  }, []);

  // --- 削除処理 (Устгах функц) ---
  const handleDelete = (e: React.MouseEvent, index: number, name: number) => {
    // リンクへの遷移を止める (Холбоос руу орохыг зогсоох)
    e.preventDefault();
    e.stopPropagation();

    if (confirm(`${name}-ийг цуглуулгаас хасах уу? (削除しますか？)`)) {
      const newFriends = [...friends];
      newFriends.splice(index, 1); // 指定した一人を削除
      setFriends(newFriends);
      localStorage.setItem("my-binder", JSON.stringify(newFriends));
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6 font-sans">
      <div className="max-w-md mx-auto">
        
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-orange-600 flex items-center gap-2">
            <span>📖</span> Миний цуглуулга
          </h1>
          <Link href="/" className="text-sm font-bold text-orange-400 bg-white px-4 py-2 rounded-full shadow-sm border border-orange-100">
            Буцах
          </Link>
        </header>

        {friends.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border-4 border-dashed border-orange-200">
            <p className="text-orange-400 font-bold leading-relaxed">
              Найзууд чинь хараахан алга...
            </p>
            <div className="text-6xl mt-6 opacity-20">🔍</div>
          </div>
        ) : (
          <div className="grid gap-4">
            {friends.map((friend, index) => (
              <Link 
                key={index} 
                href={`/view?data=${btoa(encodeURIComponent(JSON.stringify(friend)))}&from=binder`}
                className="group relative bg-white p-5 rounded-2xl shadow-md border-l-8 border-orange-400 hover:translate-x-2 transition-all flex items-center justify-between active:scale-95"
              >
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{friend.name}</h2>
                  <p className="text-xs text-orange-400 font-medium">
                    {friend.hobby || "Хобби нууц"}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-2xl group-hover:rotate-12 transition-transform">🎈</div>
                  
                  {/* --- 削除ボタン (Устгах товч) --- */}
                  <button
                    onClick={(e) => handleDelete(e, index, friend.name)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-red-100 hover:text-red-500 transition-colors z-20"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
                
                {/* 装飾 */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                  <div className="w-2 h-2 bg-orange-100 rounded-full" />
                  <div className="w-2 h-2 bg-orange-100 rounded-full" />
                </div>
              </Link>
            ))}

            <p className="text-center text-orange-300 text-xs font-bold mt-6 py-4">
              ✨ Нийт {friends.length} найз цугларлаа ✨
            </p>
          </div>
        )}
      </div>
      
      <footer className="mt-12 text-center">
        <p className="text-orange-200 text-[10px] uppercase tracking-widest">© 2026 Mazaalai Profile</p>
      </footer>
    </div>
  );
}