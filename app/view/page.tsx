"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import LZString from 'lz-string';

const FOOD_MAP: Record<string, string> = {
  buuz: "Бууз (ブーズ)",
  khuushuur: "Хуушуур (ホーショール)",
  tsuivan: "Цуйван (ツイワン)",
  horhog: "Хорхог (ホルホグ)"
};

// ★ バインダーのデータ構造（v2：地層形式）
const BINDER_KEY = "mazaalai-binder-v2";

type Profile = {
  name: string;
  hobby?: string;
  food?: string;
  dream?: string;
  savedAt?: string;
};

type BinderData = {
  version: 2;
  strata: Record<string, Profile[]>; // name → [newest, ..., oldest]
  lastOpened?: string;
};


function ProfileContent() {
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState(false);

  const isFromBinder = searchParams.get('from') === 'binder';
  const [isOpen, setIsOpen] = useState(isFromBinder);
  const [isLanded, setIsLanded] = useState(isFromBinder);

  useEffect(() => {
    const compressedData = searchParams.get('p');
    if (compressedData) {
      try {
        const jsonStr = LZString.decompressFromEncodedURIComponent(compressedData);
        if (jsonStr) {
          const decodedData = JSON.parse(jsonStr);
          setProfile(decodedData);
          if (!isFromBinder) {
            setTimeout(() => setIsLanded(true), 800);
          }
        } else {
          setError(true);
        }
      } catch (e) {
        console.error("Data decode error:", e);
        setError(true);
      }
    } else {
      setError(true);
    }
  }, [searchParams, isFromBinder]);


  // ★ 地層構造対応の saveToBinder
  const saveToBinder = () => {
   if (!profile) return;

    const BINDER_KEY = "mazaalai-binder-v2";
    const OLD_BINDER_KEY = "my-binder";

  // ★ view側でも同じマイグレーションロジックを使う
    const newRaw = localStorage.getItem(BINDER_KEY);
    let binder: BinderData;

    if (newRaw) {
      binder = JSON.parse(newRaw);
    } else {
    // 旧データをマイグレーション
      const oldRaw = localStorage.getItem(OLD_BINDER_KEY);
      if (oldRaw) {
        try {
          const oldData = JSON.parse(oldRaw);
          const strata: Record<string, Profile[]> = {};
          if (Array.isArray(oldData)) {
            for (const p of oldData) {
              if (!strata[p.name]) strata[p.name] = [];
              strata[p.name].push({ ...p, savedAt: p.savedAt || "（以前）" });
            }
         }
         binder = { version: 2, strata };
        } catch {
          binder = { version: 2, strata: {} };
        }
      } else {
      binder = { version: 2, strata: {} };
      }
    }

    const personName = profile.name;
    if (!binder.strata[personName]) binder.strata[personName] = [];

    const newest = binder.strata[personName][0];
    const isSame =
      newest &&
      newest.hobby === profile.hobby &&
      newest.food === profile.food &&
      newest.dream === profile.dream;

    if (!isSame) {
      // 参照渡しのバグを防ぐためシャローコピーして先頭に追加
      binder.strata[personName] = [{ ...profile }, ...binder.strata[personName]];
      
      localStorage.setItem(BINDER_KEY, JSON.stringify(binder));
      
      // ★ マイグレーションが成功し、新データが確定したこの瞬間に古いキーをクリーンアップ！
      if (localStorage.getItem(OLD_BINDER_KEY)) {
        localStorage.removeItem(OLD_BINDER_KEY);
      }


      alert(`${profile.name}-ийн хуудсыг хадгаллаа! 📖✨`);
    } else {
      alert("Аль хэдийн хадгалсан байна。(既に保存されています)");
    }
  };


  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <p className="text-red-400 font-bold">Өгөгдөл буруу байна 😢</p>
      <p className="text-xs text-slate-400 mt-2">データが読み込めませんでした</p>
      <Link href="/" className="mt-4 text-sm text-sky-500 underline">トップに戻る</Link>
    </div>
  );

  if (!profile) return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="animate-spin text-4xl">🎈</div>
      <p className="mt-4 text-pink-400 font-medium italic">Finding profile...</p>
    </div>
  );

  const displayFood = FOOD_MAP[profile.food || ''] || profile.food || "Бүгд (全部)";

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] relative w-full max-w-sm mx-auto">

      <div className={`absolute bottom-10 w-32 h-4 bg-slate-900/10 rounded-[100%] blur-xl transition-all duration-[2000ms] ease-out ${isLanded ? "scale-125 opacity-30" : "scale-50 opacity-0 translate-y-10"}`} />

      <div className={`relative z-10 transition-all duration-[1500ms] cubic-bezier(0.17, 0.67, 0.83, 0.67) ${isLanded ? "translate-y-0" : "-translate-y-[120vh]"}`}>

        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex flex-col items-center cursor-pointer hover:scale-105 transition-transform active:scale-90"
          >
            <div className="relative">
              <div className="text-9xl mb-4 animate-bounce duration-[2000ms]">🎈</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-8 py-3 rounded-2xl shadow-xl border-2 border-pink-300 text-pink-600 font-bold flex flex-col items-center">
              <span>Нээж үзэх (開けてみる)</span>
            </div>
          </button>
        ) : (
          <div className="w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border-4 border-white ring-1 ring-pink-100 animate-in zoom-in-95 duration-500 ease-out">

            <div className="bg-gradient-to-br from-pink-400 to-rose-400 p-8 text-white text-center relative">
              <div className="absolute top-2 right-4 text-2xl opacity-40">✨</div>
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md border border-white/30 text-4xl">👤</div>
              <h1 className="text-2xl font-black tracking-tight leading-tight">
                {profile.name}<span className="text-sm font-normal block opacity-90 mt-1">-ийн профайл -</span>
              </h1>
              {/* ★ 作成日を表示 */}
              {profile.savedAt && (
                <p className="text-xs opacity-60 mt-1">{profile.savedAt}</p>
              )}
            </div>

            <div className="p-8 space-y-5 bg-gradient-to-b from-white to-pink-50/30">
              <div className="group">
                <label className="flex items-center gap-2 text-[10px] text-pink-400 font-black uppercase tracking-widest mb-1 ml-1"><span>🎨</span> Хобби</label>
                <div className="bg-white p-4 rounded-2xl border-2 border-pink-50 shadow-sm text-slate-700 font-bold tracking-tight">
                  {profile.hobby || "Нууц (秘密)"}
                </div>
              </div>

              <div className="group">
                <label className="flex items-center gap-2 text-[10px] text-pink-400 font-black uppercase tracking-widest mb-1 ml-1"><span>😋</span> Дуртай хоол</label>
                <div className="bg-white p-4 rounded-2xl border-2 border-pink-50 shadow-sm text-pink-600 font-bold tracking-tight">
                  {displayFood}
                </div>
              </div>

              <div className="group">
                <label className="flex items-center gap-2 text-[10px] text-pink-400 font-black uppercase tracking-widest mb-1 ml-1"><span>🚀</span> Ирээдүйн хүсэл</label>
                <div className="bg-pink-50/50 p-4 rounded-2xl border-2 border-dashed border-pink-200 text-slate-600 italic leading-relaxed">
                  "{profile.dream || "Одоогоор байхгүй..."}"
                </div>
              </div>

              <div className="mt-4 text-center text-[10px] text-pink-300 italic">
                Энэ профайлыг {profile.name} бичсэн!
              </div>

              <div className="space-y-3 pt-4 border-t border-pink-100">
                {!isFromBinder && (
                  <button
                    onClick={saveToBinder}
                    className="w-full py-4 bg-orange-400 text-white font-bold rounded-2xl shadow-lg hover:bg-orange-500 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>📖</span> Хадгалах (バインダーに保存)
                  </button>
                )}

                <Link
                  href={isFromBinder ? "/binder" : "/"}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-slate-800 text-white font-bold rounded-2xl shadow-lg hover:bg-slate-900 transition-all active:scale-95 text-decoration-none"
                >
                  <span>🏠</span> {isFromBinder ? "Буцах (バインダーに戻る)" : "Буцах (トップに戻る)"}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ViewPage() {
  return (
    <div className="min-h-screen bg-sky-50 p-6 overflow-hidden relative flex flex-col items-center">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] text-7xl opacity-10 animate-pulse">☁️</div>
        <div className="absolute top-[30%] right-[10%] text-6xl opacity-20 animate-bounce duration-[4000ms]">☁️</div>
        <div className="absolute bottom-[40%] left-[15%] text-5xl opacity-10 animate-pulse">☁️</div>
        <div className="absolute bottom-[15%] right-[20%] text-8xl opacity-10">☁️</div>
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-green-200/50 to-transparent" />
        <div className="absolute bottom-4 left-0 w-full flex justify-around opacity-30 text-3xl">
          <span>🌿</span><span>🌷</span><span>🍀</span><span>🌼</span><span>🌿</span>
        </div>
      </div>

      <Suspense fallback={<div className="mt-20 animate-pulse text-sky-400 italic">Тэнгэрийг бэлдэж байна...</div>}>
        <ProfileContent />
      </Suspense>

      <footer className="mt-auto pb-4 relative z-10">
        <p className="text-slate-400 text-[10px] tracking-widest uppercase">
          — 2026 Mazaalai Profile Project —
        </p>
      </footer>
    </div>
  );
}