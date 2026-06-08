"use client";

import React, { useState, useEffect } from 'react';
import QRCode from "react-qr-code";
import Link from 'next/link';
import LZString from 'lz-string';

export default function Home() {
  const [fatherInitial, setFatherInitial] = useState(""); 
  const [name, setName] = useState(""); 
  const [nickname, setNickname] = useState("");   
  const [hobby, setHobby] = useState("");
  const [food, setFood] = useState("");
  const [dream, setDream] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [compressedParam, setCompressedParam] = useState(""); 
  const [origin, setOrigin] = useState("");
  const [step, setStep] = useState<"form" | "ignite" | "loading" | "done">("form");

  // ★ 1. 消火エフェクト用のステート
  const [isExtinguishing, setIsExtinguishing] = useState(false);
  // ★ 2. 今回飛ぶアイテムの絵文字を保持するステート
  const [flyingItem, setFlyingItem] = useState("🎈");

  const isFormValid = fatherInitial.trim() !== "" && name.trim() !== "" && origin !== "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
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
        savedAt: localDateStr,
      };
      
      const jsonStr = JSON.stringify(profileData);
      const compressedData = LZString.compressToEncodedURIComponent(jsonStr);
      const demoUrl = `${origin}/view?p=${compressedData}`;

      setCompressedParam(compressedData);
      setQrUrl(demoUrl);
      setStep("done");
    }, 2800);
  };

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
              МИНИЙ PROFILE {step === "done" ? flyingItem : "🎈"}
            </h1>
            <p className="text-xs mt-1 font-medium italic opacity-90">Найзууддаа өөрийгөө танилцуулаарай!</p>
          </div>

          {step !== "done" ? (
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
                      placeholder="Болд" 
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
                    QR кодыг найздаа уншуулаарай<br/>
                    (友達にスキャンしてもらってね)
                  </p>

                  <Link
                    href={`/screenshot?p=${compressedParam}`}
                    target="_blank"
                    className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold rounded-2xl shadow-md hover:brightness-105 active:scale-95 text-xs text-decoration-none animate-pulse"
                  >
                    <span>📸</span> Скриншот хийх хуудас (スクショ用画面を開く)
                  </Link>
                </div>
              )}

              <div className="p-6 space-y-4 bg-slate-50/50 animate-in fade-in duration-1000">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider ml-1">Хадгалагдсан мэдээлэл (入力内容の控え)</p>
                
                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-sm">
                  <span className="text-slate-400 block text-[9px] font-bold uppercase">Нэр / 名前</span>
                  <span className="font-black text-slate-800">{fatherInitial.trim().toUpperCase()}. {name.trim()} {nickname.trim() ? `(${nickname.trim()})` : ""}</span>
                </div>

                {hobby.trim() && (
                  <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-sm">
                    <span className="text-slate-400 block text-[9px] font-bold uppercase">Хобби / 趣味</span>
                    <span className="font-normal text-slate-600">{hobby}</span>
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




function SwipeIgnite({ emoji, onComplete }: { emoji: string; onComplete: () => void }) {
  const [startY, setStartY] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [triggered, setTriggered] = useState(false);

  return (
    <div
      className="flex flex-col items-center justify-center select-none touch-none p-8 border-2 border-dashed border-pink-200 rounded-2xl bg-pink-50/50 min-h-[260px] relative overflow-hidden"
      onTouchStart={(e) => { setStartY(e.touches[0].clientY); }}
      onTouchMove={(e) => {
        if (startY === null || triggered) return;
        if (e.cancelable) e.preventDefault(); 
        const currentY = e.touches[0].clientY;
        const diff = startY - currentY;
        const p = Math.min(Math.max((diff / 130) * 100, 0), 100); // 少しスワイプしやすく調整
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
      {/* 上で待機しているターゲットアイテム（風船など） */}
      <div className="text-6xl mb-4 filter drop-shadow-sm opacity-90 relative z-10">
        {emoji}
      </div>

      {/* 下からせり上がる「火」の絵文字 */}
      <div
        className="text-6xl transition-transform duration-75 ease-out filter drop-shadow-[0_4px_10px_rgba(239,68,68,0.4)] relative z-20 cursor-grab active:cursor-grabbing"
        style={{ transform: `translateY(-${progress * 0.9}px)` }} 
      >
        🔥
      </div>

      <p className="text-xs mt-8 text-orange-500 font-black uppercase tracking-wider select-none animate-pulse">
        {triggered ? "🚀 БУУДЛАА! (発射!)" : "↑ SWIPE FIRE UP"}
      </p>
    </div>
  );
}