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

// ★ バインダーのキー（v2形式）
const BINDER_KEY = "mazaalai-binder-v2";
const OLD_BINDER_KEY = "my-binder"; // マイグレーション元

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
  lastOpened?: string; // YYYY-MM-DD 形式で保存
};

// ★ 旧形式（配列）からv2形式へ移行
function loadAndMigrateBinder(): BinderData {
  // 新形式を優先
  const newRaw = localStorage.getItem(BINDER_KEY);
  if (newRaw) {
    try { return JSON.parse(newRaw); } catch {}
  }

  // 旧形式（配列）をマイグレーション
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

// ★ 日付単位での経過時間を人間的な言葉で表現（日めくりカレンダー思想）
function formatElapsed(lastOpenedDateStr: string): { primary: string; sub: string } | null {
  // 現在の日付（YYYY-MM-DD形式）を取得
  const todayStr = new Date().toISOString().split('T')[0];
  
  if (lastOpenedDateStr === todayStr) {
    // 今日、すでに一度開いている場合
    return { 
      primary: "Өнөөдөр дахин уулзлаа (今日また会えたね！)", 
      sub: "📖 ノートをひらいてくれてありがとう" 
    };
  }

  // 日付の差分（日分）を計算
  const lastTime = new Date(lastOpenedDateStr).getTime();
  const todayTime = new Date(todayStr).getTime();
  const diffDays = Math.floor((todayTime - lastTime) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return { primary: "Өчигдөр уулзсан (昨日ぶり！)", sub: "🌱 毎日見に来てくれて嬉しいな" };
  }
  if (diffDays >= 2 && diffDays <= 7) {
    return { primary: `${diffDays} хоногийн дараа (${diffDays}日ぶりの再会)`, sub: "変わってないかな / Өөрчлөгдсөн үү" };
  }
  if (diffDays > 7) {
    return { primary: "Удаан уулзсангүй! (ずいぶん久しぶりだね！)", sub: "また会いに来てくれて嬉しいよ / Дахин уулзлаа" };
  }

  return null;
}

// ★ 2つのプロフィールバージョン間の差分を取得
type DiffField = {
  key: keyof Profile;
  label: string;
  emoji: string;
  oldVal: string;
  newVal: string;
};

function getDiff(older: Profile, newer: Profile): DiffField[] {
  const fields: Array<{ key: keyof Profile; label: string; emoji: string }> = [
    { key: "hobby", label: "Хобби", emoji: "🎨" },
    { key: "food", label: "Хоол", emoji: "🍴" },
    { key: "dream", label: "Хүсэл", emoji: "✨" },
  ];

  return fields
    .filter((f) => older[f.key] !== newer[f.key])
    .map((f) => ({
      key: f.key,
      label: f.label,
      emoji: f.emoji,
      oldVal: String(FOOD_MAP[older[f.key] as string] || older[f.key] || "..."),
      newVal: String(FOOD_MAP[newer[f.key] as string] || newer[f.key] || "..."),
    }));
}

// 詳細ページURL生成
function getDetailUrl(profile: Profile): string {
  const jsonStr = JSON.stringify(profile);
  const compressed = LZString.compressToEncodedURIComponent(jsonStr);
  return `/view?p=${compressed}&from=binder`;
}


export default function BinderPage() {
  const [binderData, setBinderData] = useState<BinderData>({ version: 2, strata: {} });
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [elapsedInfo, setElapsedInfo] = useState<{ primary: string; sub: string } | null>(null);
  const [expandedLayer, setExpandedLayer] = useState<number>(0);

  // ★ 追加: クライアントサイドでのマウント完了フラグ
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const data = loadAndMigrateBinder();

    // 【修正】日付ベースで再会メッセージを計算
    if (data.lastOpened) {
      setElapsedInfo(formatElapsed(data.lastOpened));
    }

    // 【修正】現在の「日付（YYYY-MM-DD）」だけを抽出して記録
    const todayStr = new Date().toISOString().split('T')[0];
    data.lastOpened = todayStr;
    localStorage.setItem(BINDER_KEY, JSON.stringify(data));

    // ★ マイグレーションが成功していたら、旧データをクリーンアップしてゾンビ化を防止
    if (localStorage.getItem(OLD_BINDER_KEY)) {
      localStorage.removeItem(OLD_BINDER_KEY);
    }

    setBinderData(data);

    // 最初の人物を自動選択
    const people = Object.keys(data.strata);
    if (people.length > 0) setSelectedPerson(people[0]);

    setHasMounted(true);
  }, []);

  // ★ サーバー/クライアントのハイドレーションによる表示のパタつきを完璧に防ぐ
  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-orange-50 p-6 flex flex-col items-center">
        <header className="w-full max-w-md flex justify-between items-center mb-4">
          <h1 className="text-xl font-black text-orange-600 flex items-center gap-2">
            📖 Миний дэвтэр
          </h1>
        </header>
        <div className="mt-20 animate-pulse text-orange-400 font-bold italic">
          Дэвтрийг нээж байна... (ノートを開いています...)
        </div>
      </div>
    );
  }

  const people = Object.keys(binderData.strata);
  // 選択中の人物の地層（[0]が最新、末尾が最古）
  const layers: Profile[] = selectedPerson
    ? (binderData.strata[selectedPerson] || [])
    : [];


  // ★ 特定の地層を削除
  const handleDeleteLayer = (personName: string, layerIndex: number) => {
    if (!confirm(`このバージョンを削除しますか？`)) return;

    const updated = { ...binderData };
    updated.strata = { ...updated.strata };
    updated.strata[personName] = updated.strata[personName].filter((_, i) => i !== layerIndex);

    // その人のデータが全部消えたら人物ごと削除
    if (updated.strata[personName].length === 0) {
      delete updated.strata[personName];
      const remaining = Object.keys(updated.strata);
      setSelectedPerson(remaining.length > 0 ? remaining[0] : null);
    }

    setBinderData(updated);
    localStorage.setItem(BINDER_KEY, JSON.stringify(updated));
    setExpandedLayer(0);
  };


  return (
    <div className="min-h-screen bg-orange-50 p-6 flex flex-col items-center">

      {/* ヘッダー */}
      <header className="w-full max-w-md flex justify-between items-center mb-4">
        <h1 className="text-xl font-black text-orange-600 flex items-center gap-2">
          📖 Миний дэвтэр
        </h1>
        <Link href="/" className="text-sm font-bold text-orange-400">
          Буцах
        </Link>
      </header>

      {/* ★ 再会バナー（1日単位の情緒的なバナーへ） */}
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


      {people.length === 0 ? (
        /* 空状態 */
        <div className="bg-white rounded-3xl p-10 text-center border-4 border-dashed border-orange-200">
          <p className="text-orange-400 font-bold">Найзууд хараахан алга...</p>
          <div className="text-6xl mt-6 opacity-20">📭</div>
        </div>
      ) : (
        <div className="w-full max-w-md flex flex-col">

          {/* ★ 人物タブ（複数人いる場合） */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
            {people.map((name) => {
              const count = binderData.strata[name].length;
              return (
                <button
                  key={name}
                  onClick={() => { setSelectedPerson(name); setExpandedLayer(0); }}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all border-2 ${
                    selectedPerson === name
                      ? "bg-orange-400 text-white border-orange-400 shadow-lg"
                      : "bg-white text-orange-400 border-orange-200 hover:border-orange-300"
                  }`}
                >
                  {name}
                  {count > 1 && (
                    <span className={`ml-1.5 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                      selectedPerson === name ? "bg-white/30 text-white" : "bg-orange-100 text-orange-500"
                    }`}>
                      {count}層
                    </span>
                  )}
                </button>
              );
            })}
          </div>


          {/* ★ 地層ビュー */}
          {layers.length > 0 && (
            <div className="flex flex-col gap-2">

              {/* 地層ヘッダー */}
              {layers.length > 1 && (
                <div className="flex items-center gap-2 mb-1 px-1">
                  <div className="h-px flex-1 bg-orange-200" />
                  <p className="text-[10px] font-black text-orange-300 uppercase tracking-widest whitespace-nowrap">
                    🪨 {layers.length}つの地層 / {layers.length} versions
                  </p>
                  <div className="h-px flex-1 bg-orange-200" />
                </div>
              )}

              {layers.map((layer, index) => {
                const isNewest = index === 0;
                const isExpanded = expandedLayer === index;

                // 一つ前（古い）バージョンとの差分
                const olderLayer = layers[index + 1];
                const diff = olderLayer ? getDiff(olderLayer, layer) : [];

                // 深さに応じて少し暗くする（地層感）
                const opacityStyle = { opacity: Math.max(1 - index * 0.1, 0.6) };

                return (
                  <div
                    key={index}
                    className={`relative rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
                      isNewest
                        ? "bg-gradient-to-br from-pink-50 to-yellow-50 border-pink-200 shadow-xl"
                        : index === layers.length - 1
                        ? "bg-amber-50 border-amber-100 shadow-sm" // 最古層
                        : "bg-white border-orange-100 shadow-md"
                    }`}
                    style={opacityStyle}
                  >
                    {/* 地層の境目ライン */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${
                      isNewest
                        ? "bg-gradient-to-r from-pink-300 via-rose-200 to-pink-300"
                        : "bg-gradient-to-r from-amber-200 via-orange-100 to-amber-200"
                    }`} />

                    {/* ★ 折りたたみヘッダー（タップで展開） */}
                    <button
                      onClick={() => setExpandedLayer(isExpanded ? -1 : index)}
                      className="w-full p-4 text-left flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {/* 地層ラベル */}
                        <span className={`text-xs font-black uppercase tracking-widest whitespace-nowrap ${
                          isNewest ? "text-pink-400" : "text-amber-400"
                        }`}>
                          {isNewest ? "🌱 最新" : index === layers.length - 1 ? `🪨 最古` : `🪨 ${index}層前`}
                        </span>

                        {/* 日付 */}
                        {layer.savedAt && (
                          <span className="text-[11px] text-slate-400 truncate">{layer.savedAt}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* ★ 差分インジケーター */}
                        {diff.length > 0 && (
                          <span className="text-[10px] bg-sky-100 text-sky-500 px-2 py-0.5 rounded-full font-black">
                            {diff.map(d => d.emoji).join("")} 変化
                          </span>
                        )}
                        <span className={`text-sm ${isNewest ? "text-pink-300" : "text-orange-200"}`}>
                          {isExpanded ? "▲" : "▼"}
                        </span>
                      </div>
                    </button>


                    {/* ★ 展開されたコンテンツ */}
                    {isExpanded && (
                      <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-1 duration-200">

                        {/* プロフィール内容 */}
                        <div className="bg-white/60 rounded-2xl p-4 space-y-2 mb-4">
                          <h2 className="text-lg font-black text-pink-500 mb-3">{layer.name}</h2>
                          <p className="text-sm">🎨 Хобби: <span className="font-bold text-slate-700">{layer.hobby || "..."}</span></p>
                          <p className="text-sm">🍴 Хоол: <span className="font-bold text-pink-600">{FOOD_MAP[layer.food || ""] || layer.food || "..."}</span></p>
                          <p className="text-sm italic text-slate-500 mt-2">✨ {layer.dream || "..."}</p>
                        </div>

                        {/* ★ 差分表示（前バージョンとの変化） */}
                        {diff.length > 0 && (
                          <div className="mb-4 p-4 bg-sky-50 rounded-2xl border border-sky-100">
                            <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-3">
                              🔄 前のバージョンから変わったこと
                            </p>
                            {diff.map((d) => (
                              <div key={String(d.key)} className="flex flex-col gap-0.5 mb-2 last:mb-0">
                                <span className="text-[10px] font-black text-sky-400 uppercase">
                                  {d.emoji} {d.label}
                                </span>
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="text-slate-400 line-through">{d.oldVal}</span>
                                  <span className="text-sky-300">→</span>
                                  <span className="text-slate-700 font-bold">{d.newVal}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* アクションボタン */}
                        <div className="flex gap-2">
                          <Link
                            href={getDetailUrl(layer)}
                            className="flex-1 text-center text-xs font-bold text-pink-400 bg-pink-50 py-2.5 rounded-xl hover:bg-pink-100 transition-colors"
                          >
                            くわしく →
                          </Link>
                          <button
                            onClick={() => handleDeleteLayer(selectedPerson!, index)}
                            className="text-xs bg-red-50 text-red-400 px-4 py-2.5 rounded-xl hover:bg-red-100 transition-colors font-bold"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* 地層の底（記録の始まり） */}
              <div className="text-center py-3">
                <p className="text-[10px] text-orange-200 italic tracking-widest">
                  ── 記録の始まり ── Эхлэл ──
                </p>
              </div>
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