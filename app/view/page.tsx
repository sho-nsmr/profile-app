"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import LZString from "lz-string";

const FOOD_MAP: Record<string, string> = {
  buuz: "Бууз (ブーズ)",
  khuushuur: "Хуушуур (ホーショール)",
  tsuivan: "Цуйван (ツイワン)",
  horhog: "Хорхог (ホルホグ)"
};

const BINDER_KEY = "mazaalai-binder-v2";
const OLD_BINDER_KEY = "my-binder";

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

function loadAndMigrateBinder(): BinderData {
  const newRaw = localStorage.getItem(BINDER_KEY);
  if (newRaw) {
    try { return JSON.parse(newRaw); } catch {
      console.error("v2 binder corrupted, falling back to migration");
    }
  }
  const oldRaw = localStorage.getItem(OLD_BINDER_KEY);
  if (oldRaw) {
    try {
      const oldData = JSON.parse(oldRaw);
      if (Array.isArray(oldData)) {
        const strata: Record<string, Profile[]> = {};
        for (const profile of oldData) {
          if (!strata[profile.name]) strata[profile.name] = [];
          strata[profile.name].push({
            ...profile,
            savedAt: profile.savedAt || "（以前）",
          });
        }
        return { version: 2, strata };
      }
    } catch {}
  }
  return { version: 2, strata: {} };
}

// 日単位の経過時間（感情的なテンポで）
function formatElapsed(isoString: string): { primary: string; sub: string } {
  const last = new Date(isoString).getTime();
  const ms = Date.now() - last;
  const days  = Math.floor(ms / 86400000);
  const months = Math.floor(days / 30);

  if (months >= 3) return { primary: `${months}ヶ月ぶり`,    sub: "ずいぶん経ったね / Удаж байна" };
  if (months >= 1) return { primary: `${months}ヶ月ぶり`,    sub: "会いたかったよ / Уулзахыг хүссэн" };
  if (days >= 7)   return { primary: `${days}日ぶりの再会`,  sub: "変わってないかな / Өөрчлөгдсөн үү" };
  if (days >= 2)   return { primary: `${days}日ぶり`,        sub: "また来てくれたんだね / Дахин ирлээ" };
  if (days === 1)  return { primary: "昨日ぶり",             sub: "毎日来てくれてる / Өдөр бүр ирдэг" };
  return             { primary: "今日また会えたね",           sub: "/ Өнөөдөр дахин уулзлаа" };
}

type DiffField = {
  key: keyof Profile;
  emoji: string;
  label: string;
  oldVal: string;
  newVal: string;
};

function getDiff(older: Profile, newer: Profile): DiffField[] {
  const fields: Array<{ key: keyof Profile; emoji: string; label: string }> = [
    { key: "hobby", emoji: "🎨", label: "Хобби" },
    { key: "food",  emoji: "🍴", label: "Хоол" },
    { key: "dream", emoji: "✨", label: "Хүсэл" },
  ];
  return fields
    .filter(f => older[f.key] !== newer[f.key])
    .map(f => ({
      key: f.key,
      emoji: f.emoji,
      label: f.label,
      oldVal: String(FOOD_MAP[older[f.key] as string] || older[f.key] || "..."),
      newVal: String(FOOD_MAP[newer[f.key] as string] || newer[f.key] || "..."),
    }));
}

function getDetailUrl(profile: Profile): string {
  const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(profile));
  return `/view?p=${compressed}&from=binder`;
}


export default function BinderPage() {
  const [binderData, setBinderData] = useState<BinderData>({ version: 2, strata: {} });
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [versionIndex, setVersionIndex] = useState(0); // 0 = newest
  const [elapsedInfo, setElapsedInfo] = useState<{ primary: string; sub: string } | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const data = loadAndMigrateBinder();

    if (data.lastOpened) {
      setElapsedInfo(formatElapsed(data.lastOpened));
    }

    data.lastOpened = new Date().toISOString();
    localStorage.setItem(BINDER_KEY, JSON.stringify(data));

    // 旧データのクリーンアップ
    if (localStorage.getItem(OLD_BINDER_KEY)) {
      localStorage.removeItem(OLD_BINDER_KEY);
    }

    setBinderData(data);
    const people = Object.keys(data.strata);
    if (people.length > 0) setSelectedPerson(people[0]);
    setHasMounted(true);
  }, []);

  // 人物タブ切り替え時にページをリセット
  const handleSelectPerson = (name: string) => {
    setSelectedPerson(name);
    setVersionIndex(0);
  };

  const handleDelete = (personName: string, idx: number) => {
    if (!confirm("このページを削除しますか？")) return;
    const updated = { ...binderData, strata: { ...binderData.strata } };
    updated.strata[personName] = updated.strata[personName].filter((_, i) => i !== idx);
    if (updated.strata[personName].length === 0) {
      delete updated.strata[personName];
      const remaining = Object.keys(updated.strata);
      setSelectedPerson(remaining.length > 0 ? remaining[0] : null);
    }
    setVersionIndex(0);
    setBinderData(updated);
    localStorage.setItem(BINDER_KEY, JSON.stringify(updated));
  };

  // Hydration guard
  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-orange-50 p-6 flex flex-col items-center">
        <header className="w-full max-w-md flex justify-between items-center mb-6">
          <h1 className="text-xl font-black text-orange-600">📖 Миний дэвтэр</h1>
        </header>
        <div className="mt-20 animate-pulse text-orange-300 italic text-sm">
          Дэвтрийг нээж байна...
        </div>
      </div>
    );
  }

  const people = Object.keys(binderData.strata);
  const layers: Profile[] = selectedPerson ? (binderData.strata[selectedPerson] || []) : [];

  // 現在表示しているページ
  const currentLayer = layers[versionIndex] ?? null;
  // 差分：一つ古いバージョンとの比較
  const olderLayer   = layers[versionIndex + 1] ?? null;
  const diff: DiffField[] = currentLayer && olderLayer ? getDiff(olderLayer, currentLayer) : [];

  const canGoOlder = versionIndex < layers.length - 1;
  const canGoNewer = versionIndex > 0;

  const displayFood = currentLayer
    ? (FOOD_MAP[currentLayer.food ?? ""] || currentLayer.food || "...")
    : "...";

  return (
    <div className="min-h-screen bg-orange-50 p-6 flex flex-col items-center">

      {/* ヘッダー */}
      <header className="w-full max-w-md flex justify-between items-center mb-6">
        <h1 className="text-xl font-black text-orange-600 flex items-center gap-2">
          📖 Миний дэвтэр
        </h1>
        <Link href="/" className="text-sm font-bold text-orange-400">
          Буцах
        </Link>
      </header>

      {/* 再会バナー */}
      {elapsedInfo && (
        <div className="w-full max-w-md mb-5 animate-in fade-in duration-700">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl px-5 py-4 text-center shadow-sm">
            <p className="text-amber-800 font-black text-base tracking-wide">
              🌿 {elapsedInfo.primary}
            </p>
            <p className="text-amber-500 text-[11px] mt-0.5 italic">
              {elapsedInfo.sub}
            </p>
          </div>
        </div>
      )}

      {/* 空状態 */}
      {people.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-4 border-dashed border-orange-200">
          <p className="text-orange-400 font-bold">Найзууд хараахан алга...</p>
          <div className="text-6xl mt-6 opacity-20">📭</div>
        </div>
      ) : (
        <div className="w-full max-w-md flex flex-col items-center">

          {/* 人物タブ */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5 w-full">
            {people.map((name) => {
              const count = binderData.strata[name].length;
              return (
                <button
                  key={name}
                  onClick={() => handleSelectPerson(name)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all border-2 ${
                    selectedPerson === name
                      ? "bg-orange-400 text-white border-orange-400 shadow-lg"
                      : "bg-white text-orange-400 border-orange-200 hover:border-orange-300"
                  }`}
                >
                  {name}
                  {/* 複数バージョンがあることを示す点（説明しない） */}
                  {count > 1 && (
                    <span className={`ml-1.5 inline-flex gap-0.5 items-center ${
                      selectedPerson === name ? "opacity-60" : "opacity-40"
                    }`}>
                      {Array.from({ length: Math.min(count, 4) }).map((_, i) => (
                        <span key={i} className="w-1 h-1 rounded-full bg-current inline-block" />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ノートカード */}
          {currentLayer && (
            <div className="relative w-full bg-gradient-to-br from-pink-50 to-yellow-50 rounded-3xl p-6 shadow-2xl border-4 border-pink-200 animate-in fade-in duration-300">

              {/* 穴（ノートらしさ） */}
              <div className="absolute left-2 top-6 flex flex-col gap-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-orange-200 rounded-full" />
                ))}
              </div>

              {/* 削除ボタン */}
              <button
                onClick={() => handleDelete(selectedPerson!, versionIndex)}
                className="absolute top-3 right-3 text-xs bg-red-100 text-red-400 px-2 py-1 rounded-full hover:bg-red-200 transition-colors"
              >
                ✕
              </button>

              {/* プロフィール本文 */}
              <div className="ml-6">
                <h2 className="text-2xl font-black text-pink-500 mb-3">
                  {currentLayer.name}
                </h2>
                <p className="text-sm mb-1">🎨 Хобби: <span className="font-bold">{currentLayer.hobby || "..."}</span></p>
                <p className="text-sm mb-1">🍴 Хоол: <span className="font-bold text-pink-600">{displayFood}</span></p>
                <p className="text-sm italic text-slate-500 mt-3">
                  ✨ {currentLayer.dream || "..."}
                </p>

                {/* 差分：前のバージョンとの変化をそっと表示 */}
                {diff.length > 0 && (
                  <p className="mt-4 text-[11px] text-slate-400 italic leading-relaxed">
                    {diff.map((d, i) => (
                      <span key={String(d.key)}>
                        {i > 0 && "・"}
                        {d.emoji} {d.label}が変わった
                      </span>
                    ))}
                  </p>
                )}
              </div>

              {/* 日付 + ページナビゲーション */}
              <div className="mt-5 ml-6 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  {currentLayer.savedAt || ""}
                </span>
                {layers.length > 1 && (
                  <span className="text-[10px] text-orange-300 font-bold">
                    {versionIndex + 1} / {layers.length}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ページ操作 */}
          <div className="flex items-center gap-6 mt-6">
            <button
              onClick={() => setVersionIndex(v => v + 1)}
              disabled={!canGoOlder}
              className="px-4 py-2 bg-white rounded-full shadow disabled:opacity-30 transition-opacity"
            >
              ←
            </button>

            <Link
              href={currentLayer ? getDetailUrl(currentLayer) : "#"}
              className="text-sm text-pink-400 underline"
            >
              Хөхүүлэн үзэх →
            </Link>

            <button
              onClick={() => setVersionIndex(v => v - 1)}
              disabled={!canGoNewer}
              className="px-4 py-2 bg-white rounded-full shadow disabled:opacity-30 transition-opacity"
            >
              →
            </button>
          </div>

          {/* 複数バージョンある場合のみドット表示 */}
          {layers.length > 1 && (
            <div className="flex gap-1.5 mt-3">
              {layers.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setVersionIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === versionIndex ? "bg-pink-400 scale-125" : "bg-orange-200"
                  }`}
                />
              ))}
            </div>
          )}

        </div>
      )}

      <footer className="mt-10 text-orange-200 text-[10px]">
        © 2026 Mazaalai Profile
      </footer>
    </div>
  );
}