"use client";

import React, { useState, useEffect } from 'react';
import QRCode from "react-qr-code";
import Link from 'next/link';
import LZString from 'lz-string';

export default function Home() {
  const [fatherInitial, setFatherInitial] = useState(""); // （例: "Д"）
  const [name, setName] = useState(""); // 自分の名前（例: "Болд"）  
  const [nickname, setNickname] = useState("");   // あだ名 (例: Boldoo)
  const [hobby, setHobby] = useState("");
  const [food, setFood] = useState("");
  const [dream, setDream] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [compressedParam, setCompressedParam] = useState(""); // ★ currentParamの代わりに圧縮データを保持
  const [origin, setOrigin] = useState("");
  const [step, setStep] = useState<"form" | "ignite" | "loading" | "done">("form");

  const isFormValid = fatherInitial.trim() !== "" && name.trim() !== "" && origin !== "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const handleSave = () => {
    setStep("loading");

    setTimeout(() => {
      // 文字列を「父称. 本名 (あだ名)」の形に整形
      const formattedName = nickname.trim()
        ? `${fatherInitial.trim().toUpperCase()}. ${name.trim()} (${nickname.trim()})`
        : `${fatherInitial.trim().toUpperCase()}. ${name.trim()}`;

      // ユーザーの現地時間（ローカルタイム）で YYYY-MM-DD 形式の文字列を作成
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const localDateStr = `${year}-${month}-${day}`;

      // savedAt（日付）をプロフィールデータに追加
      const profileData = {
        name: formattedName,
        hobby,
        food,
        dream,
        savedAt: localDateStr, // 現地時間基準の "2026-06-08" 形式
      };
      
      const jsonStr = JSON.stringify(profileData);
      const compressedData = LZString.compressToEncodedURIComponent(jsonStr);
      const demoUrl = `${origin}/view?p=${compressedData}`;

      setCompressedParam(compressedData); // ★ ステートに保存
      setQrUrl(demoUrl);
      setStep("done");
    }, 1800);
  };

  return (
    <div className="relative min-h-screen bg-sky-100 p-4 text-slate-900 overflow-hidden">

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
            <div className="text-8xl animate-bounce mb-6 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">🔥</div>
            <div className="flex gap-2 mb-6">
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
        </div>
      )}

      {/* メインカード */}
      <div className={`max-w-md mx-auto pt-16 transition-all duration-[2000ms] ease-in-out ${qrUrl ? "-translate-y-10 scale-105" : "translate-y-0"}`}>
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-pink-200 relative z-10">

          <div className={`bg-pink-400 p-6 text-white text-center transition-colors duration-1000 ${qrUrl ? "bg-gradient-to-b from-pink-400 to-orange-400" : ""}`}>
            <h1 className="text-2xl font-black tracking-widest">МИНИЙ PROFILE 🎈</h1>
            <p className="text-xs mt-1 font-medium italic opacity-90">Найзууддаа өөрийгөө танилцуулаарай!</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-3 p-3 bg-pink-50/50 rounded-2xl border border-pink-100">
              <div>
                <label className="block text-pink-600 font-black mb-1 text-[10px] uppercase tracking-wider ml-1">Нэр (お名前) *</label>
                <div className="flex items-center gap-2">
                  {/* 父称の頭文字入力 */}
                  <input 
                    type="text" 
                    maxLength={1}
                    value={fatherInitial} 
                    onChange={(e) => setFatherInitial(e.target.value)} 
                    className="w-14 border-b-2 border-pink-200 focus:border-pink-500 outline-none p-2 text-center uppercase font-black text-slate-700 bg-white" 
                    placeholder="Д" 
                  />
                  <span className="font-bold text-xl text-pink-400">.</span>
                  {/* 本名の入力 */}
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="flex-1 border-b-2 border-pink-200 focus:border-pink-500 outline-none p-2 font-bold text-slate-700 bg-white" 
                    placeholder="Болд" 
                  />
                </div>
              </div>

              {/* あだ名（ニックネーム）の入力 */}
              <div>
                <label className="block text-pink-600 font-black mb-1 text-[10px] uppercase tracking-wider ml-1">Дуудах нэр (あだ名)</label>
                <input 
                  type="text" 
                  value={nickname} 
                  onChange={(e) => setNickname(e.target.value)} 
                  className="w-full border-b-2 border-pink-100 focus:border-pink-500 outline-none p-2 text-sm font-medium text-slate-700 bg-white" 
                  placeholder="Болдоо (例: Boldoo)" 
                />
              </div>
            </div>
      
            <div>
              <label className="block text-pink-600 font-black mb-1 text-[10px] uppercase tracking-wider">Хобби (趣味)</label>
              <input type="text" value={hobby} onChange={(e) => setHobby(e.target.value)} className="w-full border-b-2 border-pink-100 focus:border-pink-500 focus:bg-pink-50/50 outline-none p-2 transition-all rounded font-bold" placeholder="Дуртай зүйл..." />
            </div>
            <div>
              <label className="block text-pink-600 font-black mb-1 text-[10px] uppercase tracking-wider">Дуртай хоол (食べ物)</label>
              <select value={food} onChange={(e) => setFood(e.target.value)} className="w-full border-b-2 border-pink-100 focus:border-pink-500 outline-none p-2 bg-pink-50/30 rounded cursor-pointer font-bold">
                <option value="">С放гох...</option>
                <option value="buuz">Бууз (ブーズ)</option>
                <option value="khuushuur">Хуушуур (ホーショール)</option>
                <option value="tsuivan">Цуйван (ツイワン)</option>
                <option value="horhog">Хорхог (ホルホグ)</option>
              </select>
            </div>
            <div>
              <label className="block text-pink-600 font-black mb-1 text-[10px] uppercase tracking-wider">Ирээдүйн хүсэл (夢)</label>
              <textarea value={dream} onChange={(e) => setDream(e.target.value)} className="w-full border-2 border-pink-100 focus:border-pink-400 outline-none p-3 bg-pink-50/30 rounded-xl h-20 resize-none text-sm font-medium" placeholder="Мөрөөдөл..." />
            </div>

            {step === "form" && (
              <button
                type="button"
                onClick={() => setStep("ignite")}
                disabled={!isFormValid}
                className={`w-full font-black py-4 rounded-full shadow-lg transition-all transform flex flex-col items-center justify-center
                  ${!isFormValid
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed scale-100 shadow-none border-2 border-slate-300"
                    : "bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-white hover:brightness-105 active:scale-95 shadow-xl"
                  }`} 
               >
                <span className="text-lg">ГАЛ АСААХ (着火)</span>
              </button>
            )}

            {step === "ignite" && (
              <div className="mt-6">
                <SwipeIgnite onComplete={() => { handleSave(); }} />
              </div>
            )}
          </div>

          {/* QRコードセクション */}
          {step === "done" && qrUrl && (
            <div className="p-6 bg-sky-50/60 border-t-4 border-b-4 border-dashed border-sky-100 text-center flex flex-col items-center animate-in zoom-in-95 duration-700">
              <div className="mb-4">
                <p className="text-sky-500 font-black flex items-center justify-center gap-2 text-lg">
                  <span className="animate-bounce">🎈</span> ДЭЭШЭЭ ХӨӨРЛӨӨ!
                </p>
                <p className="text-[10px] text-sky-300 font-bold tracking-[0.2em] italic">READY TO SHARE</p>
              </div>

              <div className="p-4 rounded-3xl bg-white shadow-xl border-2 border-sky-50 ring-8 ring-sky-50/30">
                <QRCode value={qrUrl} size={160} />
              </div>

              <p className="mt-4 text-[11px] text-slate-400 font-bold leading-relaxed">
                QR кодыг найздаа уншуулаарай<br/>
                (友達にスキャンしてもらってね)
              </p>

              {/* ★ JSXコメントアウトの修正 ＆ currentParamをcompressedParamに修正 */}
              <Link
                href={`/screenshot?p=${compressedParam}`}
                target="_blank"
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold rounded-2xl shadow-md hover:brightness-105 active:scale-95 text-xs text-decoration-none animate-pulse"
              >
                <span>📸</span> Скриншот хийх хуудас (スクショ用画面を開く)
              </Link>
            </div>
          )}

          {/* ★ 並び替え：着火完了後、入力したプロフィール内容の「控え」を下に表示 */}
          {step === "done" && (
            <div className="p-6 space-y-4 bg-slate-50/50 animate-in fade-in duration-1000">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider ml-1">Хадгалагдсан мэдээлэл (入力内容の控え)</p>
              
              <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-sm">
                <span className="text-slate-400 block text-[9px] font-bold uppercase">Нэр / 名前</span>
                <span className="font-bold text-slate-800">{fatherInitial.trim().toUpperCase()}. {name.trim()} {nickname.trim() ? `(${nickname.trim()})` : ""}</span>
              </div>

              {hobby.trim() && (
                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-sm">
                  <span className="text-slate-400 block text-[9px] font-bold uppercase">Хобби / 趣味</span>
                  <span className="font-medium text-slate-700">{hobby}</span>
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
                  <span className="font-medium text-slate-600 italic">"{dream}"</span>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      <p className="text-center text-sky-400/40 text-[9px] mt-12 relative z-10 tracking-[0.3em] font-bold uppercase">
        © 2026 Mazaalai Profile
      </p>
    </div>
  );
}

function SwipeIgnite({ onComplete }: { onComplete: () => void }) {
  const [startY, setStartY] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [triggered, setTriggered] = useState(false);

  return (
    <div
      className="flex flex-col items-center justify-center select-none touch-none p-4 border-2 border-dashed border-pink-200 rounded-2xl bg-pink-50/20"
      onTouchStart={(e) => { setStartY(e.touches[0].clientY); }}
      onTouchMove={(e) => {
        if (startY === null || triggered) return;
        if (e.cancelable) e.preventDefault();
        const currentY = e.touches[0].clientY;
        const diff = startY - currentY;
        const p = Math.min(Math.max((diff / 120) * 100, 0), 100);
        setProgress(p);
        if (p >= 100 && !triggered) {
          setTriggered(true);
          onComplete();
        }
      }}
      onTouchEnd={() => {
        setStartY(null);
        if (!triggered) setProgress(0);
      }}
    >
      <div
        className="text-6xl transition-transform duration-75 ease-out"
        style={{ transform: `translateY(-${progress * 0.4}px)` }}
      >
        🎈
      </div>
      <p className="text-xs mt-2 text-pink-500 font-bold animate-pulse">
        {triggered ? "🚀 IGNITED!" : "↑ Swipe up to ignite"}
      </p>
      <div className="w-40 h-2 bg-pink-100 rounded-full mt-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-400 to-pink-500 transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}