"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import LZString from "lz-string";

const FOOD_MAP: Record<string, string> = {
  buuz: "Бууз (ブーズ)",
  khuushuur: "Хуушуур (ホーショール)",
  tsuivan: "Цуйван (ツォイワン)",
  horhog: "Хорхог (ホルホグ)"
};

const BINDER_KEY = "mazaalai-binder-v2";
const OLD_BINDER_KEY = "my-binder";

// 人物タブを表示する人数の閾値
const PERSON_TAB_THRESHOLD = 3;
// 後ろに覗かせるカードの端の最大数
const MAX_PEEK = 3;

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

// ★ 名前から決定的に「覗き方の癖」を割り当てる
// 同じ名前なら常に同じ結果（人物固有の質感になる）
function getPeekStyle(name: string): "corner" | "stack" {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return sum % 2 === 0 ? "corner" : "stack";
}


export default function BinderPage() {
  const [binderData, setBinderData] = useState<BinderData>({ version: 2, strata: {} });
  const [personIndex, setPersonIndex] = useState(0);
  const [versionIndex, setVersionIndex] = useState(0); // 0 = newest
  const [elapsedInfo, setElapsedInfo] = useState<{ primary: string; sub: string } | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  // スワイプ用
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [swipeDir, setSwipeDir] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    const data = loadAndMigrateBinder();

    if (data.lastOpened) {
      setElapsedInfo(formatElapsed(data.lastOpened));
    }

    data.lastOpened = new Date().toISOString();
    localStorage.setItem(BINDER_KEY, JSON.stringify(data));

    if (localStorage.getItem(OLD_BINDER_KEY)) {
      localStorage.removeItem(OLD_BINDER_KEY);
    }

    setBinderData(data);
    setHasMounted(true);
  }, []);

  const people = Object.keys(binderData.strata);

  // ★ ← → : 人物間ナビゲーション。切り替えたら必ず最新(0)に戻す
  const goToPerson = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= people.length) return;
    setPersonIndex(newIndex);
    setVersionIndex(0);
  };

  const handleSelectPersonTab = (idx: number) => {
    setPersonIndex(idx);
    setVersionIndex(0);
  };

  const handleDelete = () => {
    const personName = people[personIndex];
    if (!confirm("このページを削除しますか？")) return;
    const updated = { ...binderData, strata: { ...binderData.strata } };
    updated.strata[personName] = updated.strata[personName].filter((_, i) => i !== versionIndex);

    if (updated.strata[personName].length === 0) {
      delete updated.strata[personName];
      const remainingCount = Object.keys(updated.strata).length;
      setPersonIndex(p => Math.min(p, Math.max(0, remainingCount - 1)));
    }
    setVersionIndex(0);
    setBinderData(updated);
    localStorage.setItem(BINDER_KEY, JSON.stringify(updated));
  };

  // ★ 縦スワイプ：上＝過去へ、下＝今へ
  const SWIPE_THRESHOLD = 40;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  // ★ 縦スワイプ中、画面自体のスクロールを止める
  const handleTouchMoveCard = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    if (e.cancelable) e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent, layers: Profile[]) => {
    if (touchStartY === null) return;
    const diff = touchStartY - e.changedTouches[0].clientY;
    setTouchStartY(null);

    if (diff > SWIPE_THRESHOLD && versionIndex < layers.length - 1) {
      // 上スワイプ → 過去へ
      setSwipeDir("up");
      setTimeout(() => {
        setVersionIndex(v => v + 1);
        setSwipeDir(null);
      }, 200);
    } else if (diff < -SWIPE_THRESHOLD && versionIndex > 0) {
      // 下スワイプ → 今へ
      setSwipeDir("down");
      setTimeout(() => {
        setVersionIndex(v => v - 1);
        setSwipeDir(null);
      }, 200);
    }
  };

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

  const currentPerson = people[personIndex];
  const layers: Profile[] = currentPerson ? (binderData.strata[currentPerson] || []) : [];
  const currentLayer = layers[versionIndex] ?? null;
  const olderLayer   = layers[versionIndex + 1] ?? null;
  const diff: DiffField[] = currentLayer && olderLayer ? getDiff(olderLayer, currentLayer) : [];

  const canGoOlder = versionIndex < layers.length - 1;
  const canGoNewer = versionIndex > 0;
  const canGoPrevPerson = personIndex > 0;
  const canGoNextPerson = personIndex < people.length - 1;

  const displayFood = currentLayer
    ? (FOOD_MAP[currentLayer.food ?? ""] || currentLayer.food || "Нууц (秘密)")
    : "...";

  const peekStyle = currentPerson ? getPeekStyle(currentPerson) : "corner";
  const peekCount = Math.min(Math.max(layers.length - 1, 0), MAX_PEEK);

  // スワイプ中のカード変位
  const cardTransform =
    swipeDir === "up"   ? "translateY(-14px) scale(0.97)" :
    swipeDir === "down" ? "translateY(14px) scale(0.97)"  :
    "translateY(0) scale(1)";
  const cardOpacity = swipeDir ? 0.4 : 1;

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

          {/* ★ 人物タブ：7人以上のときのみ。画面幅を超えたら改行して積み上げ */}
          {people.length >= PERSON_TAB_THRESHOLD && (
            <div className="flex flex-wrap gap-2 justify-center mb-5 w-full">
              {people.map((name, idx) => (
                <button
                  key={name}
                  onClick={() => handleSelectPersonTab(idx)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border-2 flex items-center gap-1.5 ${
                    personIndex === idx
                      ? "bg-orange-400 text-white border-orange-400 shadow-md"
                      : "bg-white text-orange-400 border-orange-200 hover:border-orange-300"
                  }`}
                >
                  {name}
                  {binderData.strata[name].length > 1 && (
                    <span className="flex gap-0.5 items-center">
                      {binderData.strata[name].map((_, i) => (
                        <span
                          key={i}
                          className={`w-1 h-1 rounded-full ${
                            personIndex === idx ? "bg-white/80" : "bg-orange-300"
                          }`}
                        />
                      ))}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* ★ カードスタック（後ろに最大3枚の端が覗く） */}
          <div
            className="relative w-full"
            style={{ paddingBottom: peekCount > 0 ? `${peekCount * 10 + 8}px` : "0px" }}
          >
            {/* 後ろに覗くカードの端 */}
            {Array.from({ length: peekCount }).map((_, i) => {
              const depth = peekCount - i; // 一番奥が大きい数字
              if (peekStyle === "corner") {
                // 右下に寄せて覗かせる
                return (
                  <div
                    key={i}
                    className="absolute rounded-3xl border-4 bg-gradient-to-br from-pink-50 to-yellow-50 border-pink-100"
                    style={{
                      top: depth * 6,
                      left: depth * 6,
                      right: -depth * 6,
                      bottom: -(peekCount - depth) * 0 - depth * 4,
                      height: 200,
                      opacity: Math.max(1 - depth * 0.18, 0.35),
                      zIndex: depth,
                    }}
                  />
                );
              } else {
                // 束ねたような見え方（左下にずらして紙の山を表現）
                return (
                  <div
                    key={i}
                    className="absolute rounded-3xl border-4 bg-gradient-to-br from-pink-50 to-yellow-50 border-pink-100"
                    style={{
                      top: depth * 7,
                      left: -depth * 6,
                      right: depth * 6,
                      height: 200,
                      opacity: Math.max(1 - depth * 0.18, 0.35),
                      zIndex: depth,
                    }}
                  />
                );
              }
            })}

            {/* メインカード */}
            {currentLayer && (
              <div
                className="relative w-full bg-gradient-to-br from-pink-50 to-yellow-50 rounded-3xl p-6 shadow-2xl border-4 border-pink-200"
                style={{
                  transform: cardTransform,
                  opacity: cardOpacity,
                  transition: "transform 0.2s ease-out, opacity 0.2s ease-out",
                  zIndex: MAX_PEEK + 1,
                  touchAction: "none",
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMoveCard}
                onTouchEnd={(e) => handleTouchEnd(e, layers)}
              >
                {/* 穴（ノートらしさ） */}
                <div className="absolute left-2 top-6 flex flex-col gap-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-orange-200 rounded-full" />
                  ))}
                </div>

                {/* 削除ボタン */}
                <button
                  onClick={handleDelete}
                  className="absolute top-3 right-3 text-xs bg-red-100 text-red-400 px-2 py-1 rounded-full hover:bg-red-200 transition-colors"
                >
                  ✕
                </button>

                {/* プロフィール本文 */}
                <div className="ml-6">
                  <h2 className="text-2xl font-black text-pink-500 mb-3">
                    {currentLayer.name}
                  </h2>
                  <p className="text-sm mb-1">🎨 Хобби: <span className="font-bold">{currentLayer.hobby || "Нууц (秘密)"}</span></p>
                  <p className="text-sm mb-1">🍴 Хоол: <span className="font-bold text-pink-600">{displayFood}</span></p>
                  <p className="text-sm italic text-slate-500 mt-3">
                    ✨ {currentLayer.dream || "Нууц (秘密)"}
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

                {/* 日付 + バージョンドット */}
                <div className="mt-5 ml-6 flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">
                    {currentLayer.savedAt || ""}
                  </span>
                  {layers.length > 1 && (
                    <div className="flex gap-1 items-center">
                      {layers.map((_, i) => (
                        <span
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            i === versionIndex ? "bg-pink-400" : "bg-orange-200"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ← → : 人物間ナビゲーション */}
          <div className="flex items-center gap-6 mt-6">
            <button
              onClick={() => goToPerson(personIndex - 1)}
              disabled={!canGoPrevPerson}
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
              onClick={() => goToPerson(personIndex + 1)}
              disabled={!canGoNextPerson}
              className="px-4 py-2 bg-white rounded-full shadow disabled:opacity-30 transition-opacity"
            >
              →
            </button>
          </div>

          {/* 全体ページ位置（人数が多いとき用） */}
          <p className="text-[10px] text-orange-300 font-bold mt-2">
            {personIndex + 1} / {people.length}
          </p>

        </div>
      )}

      <footer className="mt-10 text-orange-200 text-[10px]">
        © 2026 Mazaalai Profile
      </footer>
    </div>
  );
}