"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function BinderPage() {
  const [friends, setFriends] = useState<any[]>([]);
  const [page, setPage] = useState(0);

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

  const handleDelete = (name: string) => {
    if (confirm(`${name}-ийг устгах уу?`)) {
      const updated = friends.filter((_, i) => i !== page);
      setFriends(updated);
      localStorage.setItem("my-binder", JSON.stringify(updated));
      setPage(Math.max(0, page - 1));
    }
  };

  const nextPage = () => {
    if (page < friends.length - 1) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const friend = friends[page];

  return (
    <div className="min-h-screen bg-orange-50 p-6 font-sans flex flex-col items-center">
      
      {/* ヘッダー */}
      <header className="w-full max-w-md flex justify-between items-center mb-6">
        <h1 className="text-xl font-black text-orange-600 flex items-center gap-2">
          📖 Миний дэвтэр
        </h1>
        <Link href="/" className="text-sm font-bold text-orange-400">
          Буцах
        </Link>
      </header>

      {/* 中身 */}
      {friends.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-4 border-dashed border-orange-200">
          <p className="text-orange-400 font-bold">
            Найзууд хараахан алга...
          </p>
          <div className="text-6xl mt-6 opacity-20">📭</div>
        </div>
      ) : (
        <div className="w-full max-w-md flex flex-col items-center">

          {/* ページカード */}
          <div className="relative w-full bg-gradient-to-br from-pink-50 to-yellow-50 rounded-3xl p-6 shadow-2xl border-4 border-pink-200 animate-in fade-in duration-500">
            
            {/* 穴（帳面っぽさ） */}
            <div className="absolute left-2 top-6 flex flex-col gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-orange-200 rounded-full" />
              ))}
            </div>

            {/* プロフィール */}
            <div className="ml-6">
              <h2 className="text-2xl font-black text-pink-500 mb-2">
                {friend.name}
              </h2>

              <p className="text-sm mb-1">🎨 Хобби: {friend.hobby || "..."}</p>
              <p className="text-sm mb-1">🍴 Хоол: {friend.food || "..."}</p>
              <p className="text-sm italic text-slate-500 mt-3">
                ✨ {friend.dream || "..."}
              </p>
            </div>

            {/* 削除 */}
            <button
              onClick={() => handleDelete(friend.name)}
              className="absolute top-3 right-3 text-xs bg-red-100 text-red-500 px-2 py-1 rounded-full"
            >
              ✕
            </button>
          </div>

          {/* ページ操作 */}
          <div className="flex items-center gap-6 mt-6">
            <button
              onClick={prevPage}
              disabled={page === 0}
              className="px-4 py-2 bg-white rounded-full shadow disabled:opacity-30"
            >
              ←
            </button>

            <p className="text-sm font-bold text-orange-400">
              {page + 1} / {friends.length}
            </p>

            <button
              onClick={nextPage}
              disabled={page === friends.length - 1}
              className="px-4 py-2 bg-white rounded-full shadow disabled:opacity-30"
            >
              →
            </button>
          </div>

          {/* 詳細リンク */}
          <Link
            href={`/view?data=${btoa(
              encodeURIComponent(JSON.stringify(friend))
            )}&from=binder`}
            className="mt-6 text-sm text-pink-400 underline"
          >
            くわしく見る →
          </Link>
        </div>
      )}

      <footer className="mt-10 text-orange-200 text-[10px]">
        © 2026 Mazaalai Profile
      </footer>
    </div>
  );
}