"use client";

import React, { useState, useEffect, useRef } from 'react';
import QRCode from "react-qr-code";
import Link from 'next/link';
import LZString from 'lz-string';

const FOOD_MAP: Record<string, string> = {
  buuz: "Бууз (ブーズ)",
  khuushuur: "Хуушуур (ホーショール)",
  tsuivan: "Цуйван (ツイワン)",
  horhog: "Хорхог (ホルホグ)"
};

const MY_PROFILE_KEY = "profile-mine";

type StoredProfile = {
  name: string;
  hobby?: string;
  food?: string;
  dream?: string;
  memo?: string;
  savedAt?: string;
};

// "Д. Болд (Болдоо)" / "Д. Болд" を分解してフォームへ戻す
function parseStoredName(full: string): { initial: string; name: string; nickname: string } {
  const m = full.match(/^(.+?)\.\s*(.+?)(?:\s*\((.+)\))?$/);
  if (!m) return { initial: "", name: full, nickname: "" };
  return { initial: m[1] ?? "", name: m[2]?.trim() ?? "", nickname: m[3]?.trim() ?? "" };
}

export default function Home() {
  const [fatherInitial, setFatherInitial] = useState(""); 
  const [name, setName] = useState(""); 
  const [nickname, setNickname] = useState("");   
  const [hobby, setHobby] = useState("");
  const [food, setFood] = useState("");
  const [dream, setDream] = useState("");
  const [memo, setMemo] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [compressedParam, setCompressedParam] = useState(""); 
  const [origin, setOrigin] = useState("");
  const [step, setStep] = useState<"form" | "home" | "ignite" | "loading" | "done">("form");
  const [storedProfile, setStoredProfile] = useState<StoredProfile | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [sharingStored, setSharingStored] = useState(false); // 「そのまま共有」経由のdoneかどうか

  // ★ 1. 消火エフェクト用のステート
  const [isExtinguishing, setIsExtinguishing] = useState(false);
  // ★ 2. 今回飛ぶアイテムの絵文字を保持するステート
  const [flyingItem, setFlyingItem] = useState("🎈");

  const isFormValid = fatherInitial.trim() !== "" && name.trim() !== "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);

      const raw = localStorage.getItem(MY_PROFILE_KEY);
      if (raw) {
        try {
          const parsed: StoredProfile = JSON.parse(raw);
          setStoredProfile(parsed);
          setStep("home");
        } catch {}
      }
      setHasMounted(true);
    }
  }, []);

  // ★ 着火モーダルを開くときに、確率でアイテムを決定する
  const handleOpenIgnite = () => {
    const rand = Math.random(); // 0.0 以上 1.0 未満
    if (rand < 0.80) {
      setFlyingItem("🎈"); // 80%
    } else if (rand < 0.87) {
      setFlyingItem("🚀"); // 7%
    } else if (rand < 0.94) {
      setFlyingItem("🛸"); // 7%
    } else {
      setFlyingItem("🧸"); // 6%
    }
    setStep("ignite");
  };

  // ★ 💧ボタンが押されたときの消火処理
  const handleExtinguish = () => {
    setIsExtinguishing(true); // 水色の膜を表示
    setTimeout(() => {
      setStep("form");        // フォームに戻す
      setIsExtinguishing(false);
    }, 400); // 0.4秒のシュッとした演出のあと切り替え
  };

  const handleSave = () => {
    setStep("loading");

    setTimeout(() => {
      const formattedName = nickname.trim()
        ? `${fatherInitial.trim().toUpperCase()}. ${name.trim()} (${nickname.trim()})`
        : `${fatherInitial.trim().toUpperCase()}. ${name.trim()}`;

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const localDateStr = `${year}-${month}-${day}`;

      const profileData = {
        name: formattedName,
        hobby,
        food,
        dream,
        memo,
        savedAt: localDateStr,
      };

      // ★ 自分の痕跡として保存
      localStorage.setItem(MY_PROFILE_KEY, JSON.stringify(profileData));
      setStoredProfile(profileData);
      setSharingStored(false);

      const jsonStr = JSON.stringify(profileData);
      const compressedData = LZString.compressToEncodedURIComponent(jsonStr);
      const demoUrl = `${origin}/view?p=${compressedData}`;

      setCompressedParam(compressedData);
      setQrUrl(demoUrl);
      setStep("done");
    }, 2800);
  };

  // ★ 保存済みプロフィールをそのまま共有
  const handleShareStored = () => {
    if (!storedProfile) return;
    const jsonStr = JSON.stringify(storedProfile);
    const compressedData = LZString.compressToEncodedURIComponent(jsonStr);
    setCompressedParam(compressedData);
    setQrUrl(`${origin}/view?p=${compressedData}`);
    setFlyingItem("🎈");
    setSharingStored(true);
    setStep("done");
  };

  // ★ 保存済みプロフィールをフォームにプリフィルして更新へ
  const handleEditStored = () => {
    if (!storedProfile) return;
    const { initial, name: parsedName, nickname } = parseStoredName(storedProfile.name);
    setFatherInitial(initial);
    setName(parsedName);
    setNickname(nickname);
    setHobby(storedProfile.hobby || "");
    setFood(storedProfile.food || "");
    setDream(storedProfile.dream || "");
    setMemo(storedProfile.memo || "");
    setSharingStored(false);
    setStep("form");
  };

  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-sky-100 flex items-center justify-center">
        <div className="animate-pulse text-sky-400 text-sm italic">Бэлдэж байна...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-sky-100 p-4 text-slate-900 overflow-hidden select-none">

      {/* バインダーへのリンク */}
      <div className="absolute top-4 right-4 z-30">
        <Link
          href="/binder"
          className="flex flex-col items-center group no-underline focus:outline-none"
        >
          <div className="bg-white p-3 rounded-2xl shadow-lg group-hover:bg-orange-50 transition-all border-2 border-orange-200 active:scale-90 flex items-center justify-center w-14 h-14">
            <span className="text-3xl">📖</span>
          </div>
        </Link>
      </div>

      {/* 雲の背景レイヤー */}
      <div className={`fixed inset-0 pointer-events-none transition-transform duration-[3000ms] ease-out ${qrUrl ? "translate-y-20" : "translate-y-0"}`}>
        <div className="absolute top-[15%] left-[10%] text-4xl opacity-10">☁️</div>
        <div className="absolute top-[45%] right-[15%] text-3xl opacity-10">☁️</div>
        <div className="absolute bottom-[20%] left-[25%] text-5xl opacity-10">☁️</div>
        <div className="absolute top-[5%] right-[25%] text-6xl opacity-20">☁️</div>
        <div className="absolute top-[60%] left-[5%] text-7xl opacity-20">☁️</div>
        <div className="absolute top-[30%] left-[75%] text-6xl opacity-15">☁️</div>
        <div className="absolute top-[75%] right-[5%] text-8xl opacity-30">☁️</div>
        <div className="absolute -bottom-10 left-[15%] text-9xl opacity-25">☁️</div>
      </div>

      {/* ローディング演出 */}
      {step === "loading" && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-orange-600/90 backdrop-blur-md text-white animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-gradient-to-t from-red-600/30 to-transparent animate-pulse" />
          <div className="relative flex flex-col items-center">

         {/* 下から上へ突き抜けるカスタムアニメーションを適用 */}
         <div 
          className="text-8xl filter drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] absolute"
          style={{
            animation: 'flyUpContinuous 1.5s linear infinite'
          }}
        >
          {flyingItem}
        </div>

        {/* インラインCSSで上に昇るアニメーションのキーフレームを定義 */}
        <style>{`
         @keyframes flyUpContinuous {
           0% { transform: translateY(120px) scale(0.9); opacity: 0; }
           15% { opacity: 1; }
           85% { opacity: 1; }
           100% { transform: translateY(-120px) scale(1.05); opacity: 0; }
          }
        `}</style>

    </div>

    {/* 三つのドットのぽよぽよアニメーション */}
    <div className="flex gap-2 mb-6 mt-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-3 h-3 bg-white rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
    <h2 className="text-2xl font-black tracking-widest text-center">
      ГАЛ АСААЖ БАЙНА...<br/>
      <span className="text-sm font-bold opacity-80 uppercase tracking-normal">Preparing to fly!</span>
    </h2>
  </div>
)}
      {/* メインカード */}
      <div className={`max-w-md mx-auto pt-16 transition-all duration-[2000ms] ease-in-out ${qrUrl ? "-translate-y-10 scale-105" : "translate-y-0"}`}>
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-pink-200 relative z-10">

          <div className={`bg-pink-400 p-6 text-white text-center transition-colors duration-1000 ${qrUrl ? "bg-gradient-to-b from-pink-400 to-orange-400" : ""}`}>
            {/* ★ Doneの時は上でも選択されたアイテムを表示して特別感を演出 */}
            <h1 className="text-2xl font-black tracking-widest">
              МИНИЙ PROFILE {step === "done" ? flyingItem : step === "home" ? "📖" : "🎈"}
            </h1>
            <p className="text-xs mt-1 font-medium italic opacity-90">Найзууддаа өөрийгөө танилцуулаарай!</p>
          </div>

          {step === "home" && storedProfile ? (
            <div className="p-6 space-y-4">
              <div className="bg-pink-50/60 rounded-2xl p-5 border-2 border-pink-100">
                <p className="text-[10px] text-pink-400 font-black uppercase tracking-wider mb-2">Миний профайл</p>
                <h2 className="text-lg font-black text-slate-800 mb-2">{storedProfile.name}</h2>
                {storedProfile.hobby && <p className="text-sm mb-1">🎨 {storedProfile.hobby}</p>}
                {storedProfile.food && (
                  <p className="text-sm mb-1">🍴 {FOOD_MAP[storedProfile.food] || storedProfile.food}</p>
                )}
                {storedProfile.dream && (
                  <p className="text-sm italic text-slate-500 mt-2 whitespace-pre-wrap">✨ {storedProfile.dream}</p>
                )}
                {storedProfile.memo && (
                  <p className="text-sm italic text-slate-500 mt-1 whitespace-pre-wrap">💬 {storedProfile.memo}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleShareStored}
                  className="flex-1 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all"
                >
                  Хуваалцах (共有する)
                </button>
                <button
                  onClick={handleEditStored}
                  className="flex-1 py-3 bg-white border-2 border-pink-200 text-pink-500 font-bold rounded-2xl shadow active:scale-95 transition-all"
                >
                  Шинэчлэх (更新する)
                </button>
              </div>

              <Link
                href="/binder"
                className="flex items-center justify-center gap-2 w-full py-3 bg-slate-800 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all text-decoration-none"
              >
                <span>📖</span> Дэвтэр (バインダー)
              </Link>
            </div>
          ) : step !== "done" ? (
            <div className="p-6 space-y-4">
              <div className="space-y-3 p-3 bg-pink-50/50 rounded-2xl border border-pink-100">
                <div>
                  <label className="block text-pink-600 font-black mb-1 text-[10px] uppercase tracking-wider ml-1">Нэр (お名前) *</label>
                  {/* flex-wrap を追加し、小さな画面でもはみ出さずに綺麗に収まるように調整 */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                    <input 
                      type="text" 
                      maxLength={1}
                      value={fatherInitial} 
                      onChange={(e) => setFatherInitial(e.target.value)} 
                      placeholder="Д"
                      className="w-16 text-center py-4 px-2 rounded-2xl border-2 border-slate-100 focus:border-pink-400 focus:ring-4 focus:ring-pink-50 outline-none transition-all font-black text-slate-800 uppercase bg-white placeholder:text-slate-400 placeholder:font-normal"
                    />
                    <span className="font-bold text-xl text-pink-400">.</span>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Батболд" 
                      className="flex-1 p-4 rounded-2xl border-2 border-slate-100 focus:border-pink-400 focus:ring-4 focus:ring-pink-50 outline-none transition-all font-black text-slate-800 bg-white placeholder:text-slate-400 placeholder:font-normal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-pink-600 font-black mb-1 text-[10px] uppercase tracking-wider ml-1">Дуудах нэр (あだ名)</label>
                  <input 
                    type="text" 
                    value={nickname} 
                    onChange={(e) => setNickname(e.target.value)} 
                    className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-pink-400 focus:ring-4 focus:ring-pink-50 outline-none transition-all font-bold text-slate-800 bg-white placeholder:text-slate-400 placeholder:font-normal" 
                    placeholder="Болдоо (例: Boldoo)" 
                  />
                </div>
              </div>
        
              <div>
                <label className="block text-pink-600 font-black mb-1 text-[10px] uppercase tracking-wider">Хобби (趣味)</label>
                <input type="text" value={hobby} onChange={(e) => setHobby(e.target.value)} className="w-full border-b-2 border-pink-100 focus:border-pink-500 focus:bg-pink-50/50 outline-none p-2 transition-all rounded font-bold text-slate-800 bg-white" placeholder="Дуртай зүйл..." />
              </div>
              <div>
                <label className="block text-pink-600 font-black mb-1 text-[10px] uppercase tracking-wider">Дуртай хоол (食べ物)</label>
                <select value={food} onChange={(e) => setFood(e.target.value)} className="w-full border-b-2 border-pink-100 focus:border-pink-500 outline-none p-2 bg-white rounded cursor-pointer font-bold text-slate-800">
                  <option value="">Сонгох...</option>
                  <option value="buuz">Бууз (ボーズ)</option>
                  <option value="khuushuur">Хуушуур (ホーショール)</option>
                  <option value="tsuivan">Цуйван (ツォイワン)</option>
                  <option value="horhog">Хорхог (ホルホグ)</option>
                </select>
              </div>
              <div>
                <label className="block text-pink-600 font-black mb-1 text-[10px] uppercase tracking-wider">Ирээдүйн хүсэл (夢)</label>
                <textarea value={dream} onChange={(e) => setDream(e.target.value)} className="w-full border-2 border-pink-100 focus:border-pink-400 outline-none p-3 bg-white text-slate-800 rounded-xl h-20 resize-none text-sm font-medium" placeholder="Мөрөөдөл..." />
              </div>
              <div>
                <label className="block text-pink-600 font-black mb-1 text-[10px] uppercase tracking-wider">Нэг үг (一言)</label>
                <textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="w-full border-2 border-pink-100 focus:border-pink-400 outline-none p-3 bg-white text-slate-800 rounded-xl h-20 resize-none text-sm font-medium placeholder:text-slate-400 placeholder:font-normal"                  
                  placeholder="Жишээ нь: Өчигдөр идсэн зайрмаг гоё байсан!"
                />
              </div>

              {/* 着火ボタン：確率抽選関数を呼ぶ */}
              <button
                type="button"
                onClick={handleOpenIgnite}
                disabled={!isFormValid}
                className={`w-full font-black py-4 rounded-full shadow-lg transition-all transform flex flex-col items-center justify-center
                  ${!isFormValid
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed scale-100 shadow-none border-2 border-slate-300"
                    : "bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-white hover:brightness-105 active:scale-95 shadow-xl"
                  }`} 
               >
                <span className="text-lg">ГАЛ АСААХ (着火)</span>
              </button>

              {storedProfile && (
                <button
                  type="button"
                  onClick={() => setStep("home")}
                  className="w-full text-center text-xs text-slate-400 underline py-2"
                >
                  Буцах (やめる)
                </button>
              )}
            </div>
          ) : (
            // 着火完了（done）時
            <div>
              {qrUrl && (
                <div className="p-6 bg-sky-50/60 border-b-4 border-dashed border-sky-100 text-center flex flex-col items-center animate-in zoom-in-95 duration-700">
                  <div className="mb-4">
                    <p className="text-sky-500 font-black flex items-center justify-center gap-2 text-lg">
                      <span className="animate-bounce">{flyingItem}</span> ДЭЭШЭЭ ХӨӨРЛӨӨ!
                    </p>
                    <p className="text-[10px] text-sky-300 font-bold tracking-[0.2em] italic">READY TO SHARE</p>
                  </div>

                  <div className="p-4 rounded-3xl bg-white shadow-xl border-2 border-sky-50 ring-8 ring-sky-50/30">
                    <QRCode value={qrUrl} size={160} />
                  </div>

                  <p className="mt-4 text-[11px] text-slate-400 font-bold leading-relaxed">
                    QR кодыг найздаа уншуулаарай!<br/>
                    (友達にスキャンしてもらってね)
                  </p>

                  <Link
                    href={`/screenshot?p=${compressedParam}`}
                    target="_blank"
                    className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold rounded-2xl shadow-md hover:brightness-105 active:scale-95 text-xs text-decoration-none animate-pulse"
                  >
                    <span>📸</span> Скриншот хийх хуудас (スクショ用の画面を開く)
                  </Link>
                </div>
              )}

              {!sharingStored && (
              <div className="p-6 space-y-4 bg-slate-50/50 animate-in fade-in duration-1000">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider ml-1">Хадгалагдсан мэдээлэл (入力内容の控え)</p>
                
                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-sm">
                  <span className="text-slate-400 block text-[9px] font-bold uppercase">Нэр / 名前</span>
                  <span className="font-black text-slate-800">{fatherInitial.trim().toUpperCase()}. {name.trim()} {nickname.trim() ? `(${nickname.trim()})` : ""}</span>
                </div>

                {hobby.trim() && (
                  <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-sm">
                    <span className="text-slate-400 block text-[9px] font-bold uppercase">Хобби / 趣味</span>
                    <span className="font-normal text-slate-700">{hobby}</span>
                  </div>
                )}

                {food && (
                  <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-sm">
                    <span className="text-slate-400 block text-[9px] font-bold uppercase">Дуртай хоол / 食べ物</span>
                    <span className="font-medium text-slate-700">
                      {food === "buuz" && "Бууз (ブーズ)"}
                      {food === "khuushuur" && "Хуушуур (ホーショール)"}
                      {food === "tsuivan" && "Цуйван (ツイワン)"}
                      {food === "horhog" && "Хорхог (ホルホグ)"}
                    </span>
                  </div>
                )}

                {dream.trim() && (
                  <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-sm">
                    <span className="text-slate-400 block text-[9px] font-bold uppercase">Мөрөөдөл / 夢</span>
                    <span className="font-medium text-slate-700 whitespace-pre-wrap">{dream}</span>
                  </div>
                )}

                {memo.trim() && (
                  <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-sm">
                    <span className="text-slate-400 block text-[9px] font-bold uppercase">Нэг үг / 一言</span>
                    <span className="font-medium text-slate-700 whitespace-pre-wrap">{memo}</span>
                  </div>
                )}

              </div>
              )}

              <div className="p-6 pt-0">
                <button
                  type="button"
                  onClick={() => setStep("home")}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-slate-800 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all"
                >
                  <span>🏠</span> Нүүр хуудас руу (homeへ戻る)
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 画面中央スワイプ用のフルスクリーンレイヤー（モーダル演出） */}
      {step === "ignite" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-4 border-pink-300 text-center relative animate-in zoom-in-95 duration-300">
            
            {/* 💧 水の戻るボタン（消火処理を呼び出す） */}
            <button 
              onClick={handleExtinguish}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-blue-50 hover:bg-blue-100 transition-all flex items-center justify-center text-xl shadow-sm border border-blue-100 active:scale-90 focus:outline-none z-10"
              title="Буцах (戻る)"
            >
              💧
            </button>

            <h3 className="text-lg font-black text-slate-800 mb-1 mt-4">БЭЛЭН БОЛЛОО! {flyingItem}</h3>
            <p className="text-[11px] text-slate-400 font-bold mb-6">
              Дээшээ шудраад галаа асаагаарай<br/>
              (上にスワイプして着火！)
            </p>

            {/* ガチャで選ばれた絵文字をスワイプコンポーネントに渡す */}
            <SwipeIgnite emoji={flyingItem} onComplete={handleSave} />
          </div>

          {/* ★ 1. シュッ💨と消火する水のエフェクトレイヤー */}
          {isExtinguishing && (
            <div className="absolute inset-0 bg-sky-400/90 backdrop-blur-md z-50 animate-in fade-in zoom-in-95 duration-300 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl animate-ping mb-2">💨</div>
                <div className="font-black text-xl tracking-widest">УНТРААЛАА... (消火中)</div>
              </div>
            </div>
          )}
        </div>
      )}

      <p className="text-center text-sky-400/40 text-[9px] mt-12 relative z-10 tracking-[0.3em] font-bold uppercase">
        © 2026 Mazaalai Profile
      </p>
    </div>
  );
}




// ─────────────────────────────────────────────
// ファイル末尾の SwipeIgnite 関数を以下で置き換え [written by Claude]
// ─────────────────────────────────────────────


function SwipeIgnite({ emoji, onComplete }: { emoji: string; onComplete: () => void }) {
  const [dragOffset, setDragOffset] = useState(0);
  const [startY, setStartY]         = useState<number | null>(null);
  const [triggered, setTriggered]   = useState(false);
  const [releasing, setReleasing]   = useState(false);
  const [impactKey, setImpactKey]   = useState(0); // 衝撃エフェクトの再生トリガー
  const isDone = useRef(false);

  const MAX_TRAVEL  = 150;
  const progress    = Math.min(dragOffset / MAX_TRAVEL, 1);
  const isNearBalloon = progress > 0.55;
  const isVeryClose   = progress > 0.82;

  // ── 着火の瞬間：振動 + 衝撃エフェクト発火 ─────────────────
  const fireImpact = () => {
    setImpactKey(k => k + 1);
    // 対応端末のみ：ドン・ドン・ドーン の3連パルス
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([40, 30, 40, 30, 80]);
    }
  };

  // ── マウス操作対応 ──────────────────────────────────────────
  useEffect(() => {
    if (startY === null) return;

    const onMove = (e: MouseEvent) => {
      if (isDone.current) return;
      const moved = Math.max(0, startY - e.clientY);
      setDragOffset(moved);
      if (moved >= MAX_TRAVEL) {
        isDone.current = true;
        setTriggered(true);
        fireImpact();
        setTimeout(() => onComplete(), 750);
      }
    };

    const onUp = () => {
      if (isDone.current) return;
      setStartY(null);
      setReleasing(true);
      setDragOffset(0);
      setTimeout(() => setReleasing(false), 600);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
  }, [startY, onComplete]);

  // ── タッチ操作 ──────────────────────────────────────────────
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    if (isDone.current || startY === null) return;
    const moved = Math.max(0, startY - e.touches[0].clientY);
    setDragOffset(moved);
    if (moved >= MAX_TRAVEL) {
      isDone.current = true;
      setTriggered(true);
      fireImpact();
      setTimeout(() => onComplete(), 750);
    }
  };

  const handleTouchEnd = () => {
    if (isDone.current) return;
    setStartY(null);
    setReleasing(true);
    setDragOffset(0);
    setTimeout(() => setReleasing(false), 600);
  };

  // ── 炎のビジュアル計算 ──────────────────────────────────────
  const fireTranslateY = releasing ? 0 : -Math.min(dragOffset, MAX_TRAVEL);
  const fireScale      = releasing ? 1 : 1 + progress * 0.9;
  const glowPx         = Math.round(progress * 32);
  const glowColor      = `rgba(255, ${Math.round(160 - progress * 120)}, 0, 0.75)`;
  const shakeSpeed     = `${Math.max(0.17, 0.28 - progress * 0.12).toFixed(2)}s`;

  return (
    <div
      className="relative flex flex-col items-center rounded-2xl border-2 border-dashed border-pink-200 select-none touch-none overflow-hidden"
      style={{
        height: 268,
        background: `linear-gradient(to top,
          rgba(251,146,60,${(0.04 + progress * 0.22).toFixed(3)}) 0%,
          transparent ${Math.round(35 + progress * 45)}%)`,
        transition: releasing ? "background 0.5s" : "background 0.08s",
        // 着火の瞬間、コンテナ全体を震わせる
        animation: triggered ? "screenShake 0.4s ease-out" : "none",
      }}
      onTouchStart={e => {
        if (e.cancelable) e.preventDefault();
        if (!isDone.current) setStartY(e.touches[0].clientY);
      }}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={e => { if (!isDone.current) { setReleasing(false); setStartY(e.clientY); } }}
    >
      <style>{`
        @keyframes balloonShake {
          0%,100% { transform: rotate(0deg); }
          25%     { transform: rotate(-7deg) scale(1.07); }
          75%     { transform: rotate( 7deg) scale(1.07); }
        }
        @keyframes launch {
          0%   { transform: scale(1)   translateY(  0px); opacity: 1; }
          15%  { transform: scale(1.6) translateY(-20px); opacity: 1; }
          100% { transform: scale(0.3) translateY(-230px); opacity: 0; }
        }
        @keyframes fireExplode {
          0%   { transform: scale(1)   translateY( 0px); opacity: 1; }
          40%  { transform: scale(2.5) translateY(-22px); opacity: 0.9; }
          100% { transform: scale(0)   translateY(-44px); opacity: 0; }
        }
        /* 衝撃波：パッと広がって消える輪 */
        @keyframes shockwave {
          0%   { transform: scale(0.2); opacity: 0.9; border-width: 6px; }
          100% { transform: scale(3.2); opacity: 0;   border-width: 0px; }
        }
        /* 火花：中心から飛び散る */
        @keyframes sparkFly {
          0%   { transform: translate(0,0) scale(1);   opacity: 1; }
          100% { transform: translate(var(--sx), var(--sy)) scale(0); opacity: 0; }
        }
        /* 全体の軽い揺れ */
        @keyframes screenShake {
          0%   { transform: translate(0,0); }
          20%  { transform: translate(-4px, 2px); }
          40%  { transform: translate(5px, -3px); }
          60%  { transform: translate(-3px, -2px); }
          80%  { transform: translate(3px, 2px); }
          100% { transform: translate(0,0); }
        }
        /* 中心からのフラッシュ */
        @keyframes impactFlash {
          0%   { opacity: 0.85; transform: scale(0.4); }
          100% { opacity: 0;    transform: scale(2.2); }
        }
      `}</style>

      {/* ── 風船 ─────────────────────────────────────────────── */}
      <div
        className="absolute top-8 text-6xl leading-none pointer-events-none"
        style={{
          animation: triggered
            ? "launch 0.7s cubic-bezier(0.2, 0, 0.8, 1) forwards"
            : isNearBalloon
            ? `balloonShake ${shakeSpeed} ease-in-out infinite`
            : "none",
          filter: isVeryClose
            ? "drop-shadow(0 0 20px rgba(255,100,0,0.95))"
            : isNearBalloon
            ? "drop-shadow(0 0 9px rgba(255,160,0,0.55))"
            : "none",
          transition: "filter 0.2s",
        }}
      >
        {emoji}
      </div>

      {/* ── 衝突エフェクト群（着火の瞬間だけ再生） ─────────────── */}
      {triggered && (
        <div
          key={impactKey}
          className="absolute top-8 pointer-events-none"
          style={{ width: "1px", height: "1px" }} // 中心点として機能
        >
          {/* フラッシュ：中心から白い光が広がる */}
          <div
            className="absolute rounded-full"
            style={{
              left: "50%", top: "50%",
              width: 90, height: 90,
              marginLeft: -45, marginTop: -45,
              background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,200,80,0.5) 45%, transparent 75%)",
              animation: "impactFlash 0.35s ease-out forwards",
            }}
          />
          {/* 衝撃波の輪 */}
          <div
            className="absolute rounded-full border-orange-300"
            style={{
              left: "50%", top: "50%",
              width: 70, height: 70,
              marginLeft: -35, marginTop: -35,
              borderStyle: "solid",
              animation: "shockwave 0.5s ease-out forwards",
            }}
          />
          {/* 火花 8方向 */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const dist  = 55 + (i % 2) * 20;
            const sx = Math.cos(angle) * dist;
            const sy = Math.sin(angle) * dist;
            return (
              <div
                key={i}
                className="absolute text-lg"
                style={{
                  left: "50%", top: "50%",
                  // @ts-expect-error: CSS custom properties
                  "--sx": `${sx}px`,
                  "--sy": `${sy}px`,
                  animation: `sparkFly 0.5s ease-out forwards`,
                  animationDelay: "0.02s",
                }}
              >
                {i % 2 === 0 ? "✨" : "🔥"}
              </div>
            );
          })}
        </div>
      )}

      {/* ── 炎 ───────────────────────────────────────────────── */}
      <div
        className="absolute leading-none pointer-events-none"
        style={{
          bottom: 28,
          fontSize: "3.5rem",
          transform: `translateY(${fireTranslateY}px) scale(${fireScale})`,
          transition: releasing
            ? "transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)"
            : triggered
            ? "none"
            : "transform 0.04s linear",
          filter: triggered
            ? "none"
            : `drop-shadow(0 0 ${glowPx}px ${glowColor})`,
          animation: triggered ? "fireExplode 0.4s ease-out forwards" : "none",
          cursor: startY !== null ? "grabbing" : "grab",
        }}
      >
        🔥
      </div>

      {/* ── 操作ガイド ───────────────────────────────────────── */}
      <p
        className="absolute bottom-2 text-[10px] font-black text-orange-400 tracking-widest"
        style={{
          opacity: dragOffset > 12 ? 0 : 0.75,
          transition: "opacity 0.15s",
        }}
      >
        ↑ дээш чирнэ үү
      </p>
    </div>
  );
}