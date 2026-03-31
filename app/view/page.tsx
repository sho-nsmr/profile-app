"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ViewProfile() {
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<{
    name: string;
    hobby: string;
    food: string;
    dream: string;
  } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        // 1. Base64デコード -> 2. URIデコード -> 3. JSONパース
        const decodedData = JSON.parse(decodeURIComponent(atob(data)));
        setProfile(decodedData);
      } catch (e) {
        console.error("データの読み込みに失敗しました", e);
        setError(true);
      }
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4 text-pink-600 font-bold">
        Профайл олдсонгүй. (プロファイルが見つかりませんでした)
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
        <div className="animate-spin h-10 w-10 border-4 border-pink-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 p-4 font-sans text-slate-900 leading-relaxed">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-pink-200 mt-10">
        
        {/* ヘッダー */}
        <div className="bg-pink-400 p-8 text-white text-center">
          <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-inner">
            <span className="text-4xl">🐱</span>
          </div>
          <h1 className="text-2xl font-bold">{profile.name}-ийн профайл</h1>
          <p className="text-sm opacity-90">Танилцсандаа баяртай байна!</p>
        </div>

        {/* コンテンツ内容 */}
        <div className="p-8 space-y-8">
          
          {/* 趣味 */}
          <section>
            <h2 className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-2 flex items-center">
              <span className="mr-2">✨</span> Хобби (趣味)
            </h2>
            <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 text-lg font-medium">
              {profile.hobby || "Нууц (秘密)"}
            </div>
          </section>

          {/* 好きな食べ物 */}
          <section>
            <h2 className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-2 flex items-center">
              <span className="mr-2">😋</span> Дуртай хоол (好きな食べ物)
            </h2>
            <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 text-lg font-medium">
              {profile.food === "buuz" && "Бууз (ブーズ) 🥟"}
              {profile.food === "khuushuur" && "Хуушуур (ホーショール) 🥟"}
              {profile.food === "tsuivan" && "Цуйван (ツイワン) 🍝"}
              {profile.food === "horhog" && "Хорхог (ホルホグ) 🍖"}
              {!profile.food && "Сонгоогүй (未設定)"}
            </div>
          </section>

          {/* 将来の夢 */}
          <section>
            <h2 className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-2 flex items-center">
              <span className="mr-2">🌈</span> Ирээдүйн хүсэл (将来の夢)
            </h2>
            <div className="bg-pink-50/80 p-5 rounded-2xl border-2 border-dashed border-pink-200 italic text-slate-700 whitespace-pre-wrap">
              "{profile.dream || "Одоогоор байхгүй (今のところなし)"}"
            </div>
          </section>

          {/* 戻るボタン（自分も作りたくなった時用） */}
          <div className="pt-4">
            <a 
              href="/"
              className="block w-full text-center py-3 text-pink-400 font-bold border-2 border-pink-400 rounded-full hover:bg-pink-400 hover:text-white transition-all"
            >
              Миний профайлыг үүсгэх
            </a>
          </div>
        </div>
      </div>
      
      <p className="text-center text-pink-300 text-xs mt-8">© 2026 Mazaalai Profile</p>
    </div>
  );
}