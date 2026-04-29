"use client";

import React, { useState, useEffect } from 'react'; // useEffectを追加
import QRCode from "react-qr-code";
import Link from 'next/link';

export default function Home() {
  const [name, setName] = useState("");
  const [hobby, setHobby] = useState("");
  const [food, setFood] = useState("");
  const [dream, setDream] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [origin, setOrigin] = useState(""); // originを保存するステートを追加
  const [step, setStep] = useState<"form" | "ignite" | "loading" | "done">("form");


  // マウント時に一度だけ実行してドメイン名を取得
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const handleSave = () => {
    if (!name.trim()) {
      alert("Нэрээ оруулна уу! (名前を入力してください！)");
      return;
    }

   setStep("loading");

    // 1.8秒間の「着火」演出
    setTimeout(() => {
      const profileData = { name, hobby, food, dream };
      const encodedData = btoa(encodeURIComponent(JSON.stringify(profileData)));
      const demoUrl = `${origin}/view?data=${encodedData}`;      
      
      setQrUrl(demoUrl);
      setStep("done");
    }, 1800);
  };

  return (
    <div className="relative min-h-screen bg-sky-100 p-4 font-sans text-slate-900 overflow-hidden">
      
      {/* バインダーへのリンク (アイコンのみのシンプル設計) */}
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

{/* 雲の背景レイヤー (修正済み) */}
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

      {/* --- 強化された「着火」ローディング演出 --- */}
      {step === "loading" && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-orange-600/90 backdrop-blur-md text-white animate-in fade-in duration-300">
          {/* 背景の熱気を感じさせるパルスアニメーション */}
          <div className="absolute inset-0 bg-gradient-to-t from-red-600/30 to-transparent animate-pulse" />
          
          <div className="relative flex flex-col items-center">
            {/* 激しく揺れる火のアイコン */}
            <div className="text-8xl animate-bounce mb-6 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">🔥</div>
            
            {/* 進行状況を示すドット */}
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

          <form className="p-6 space-y-4">
            <div>
              <label className="block text-pink-600 font-black mb-1 text-[10px] uppercase tracking-wider">Нэр (名前) *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border-b-2 border-pink-100 focus:border-pink-500 focus:bg-pink-50/50 outline-none p-2 transition-all rounded font-bold" placeholder="Нэрээ бичнэ үү..." />
            </div>
            <div>
              <label className="block text-pink-600 font-black mb-1 text-[10px] uppercase tracking-wider">Хобби (趣味)</label>
              <input type="text" value={hobby} onChange={(e) => setHobby(e.target.value)} className="w-full border-b-2 border-pink-100 focus:border-pink-500 focus:bg-pink-50/50 outline-none p-2 transition-all rounded font-bold" placeholder="Дуртай зүйл..." />
            </div>
            <div>
              <label className="block text-pink-600 font-black mb-1 text-[10px] uppercase tracking-wider">Дуртай хоол (食べ物)</label>
              <select value={food} onChange={(e) => setFood(e.target.value)} className="w-full border-b-2 border-pink-100 focus:border-pink-500 outline-none p-2 bg-pink-50/30 rounded cursor-pointer font-bold">
                <option value="">Сонгох...</option>
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
              className={`w-full font-black py-4 rounded-full shadow-lg transition-all transform active:scale-95 flex flex-col items-center justify-center ${isLoading ? "bg-gray-300" : "bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-white hover:brightness-105"}`}
            >
              <span className="text-lg">ГАЛ АСААХ (着火)</span>
            </button>
        )}


                {/* スワイプ点火レイヤー（追加） */}
{step === "ignite" && (
  <div className="mt-6">
    <SwipeIgnite
      onComplete={() => {
        setStep("loading");
        handleSave();
      }}
    />
  </div>
)}


          </form>

          {/* QRコードセクション */}
          {step === "done" && qrUrl && !isLoading && (
            <div className="p-8 bg-white border-t-4 border-dashed border-sky-100 text-center flex flex-col items-center animate-in zoom-in-95 duration-700">
              <div className="mb-6">
                <p className="text-sky-500 font-black flex items-center justify-center gap-2 text-lg">
                  <span className="animate-bounce">🎈</span> ДЭЭШЭЭ ХӨӨРЛӨӨ!
                </p>
                <p className="text-[10px] text-sky-300 font-bold tracking-[0.2em] italic">READY TO SHARE</p>
              </div>
              
              <div className="p-4 rounded-3xl bg-white shadow-2xl border-2 border-sky-50 ring-8 ring-sky-50/30">
                <QRCode value={qrUrl} size={160} />
              </div>
              
              <p className="mt-8 text-[11px] text-slate-400 font-bold leading-relaxed">
                QR кодыг найздаа уншуулаарай<br/>
                (友達にスキャンしてもらってね)
              </p>
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





// スワイプ演出を外に置くこと
function SwipeIgnite({ onComplete }: { onComplete: () => void }) {
  const [startY, setStartY] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [triggered, setTriggered] = useState(false);

  return (
    <div
      className="flex flex-col items-center justify-center select-none"
      onTouchStart={(e) => setStartY(e.touches[0].clientY)}
      onTouchMove={(e) => {
        if (startY === null) return;
        const diff = startY - e.touches[0].clientY;
        const p = Math.min(Math.max(diff / 3, 0), 100);
        setProgress(p);
        if (p > 80 && !triggered) {
        setTriggered(true);
        onComplete();
        }
      }}
      onTouchEnd={() => {
        setStartY(null);
        setProgress(0);
      }}
    >
      <div className="text-6xl">🎈</div>
      <p className="text-xs mt-2 text-pink-500 animate-pulse">
        ↑ Swipe up to ignite
      </p>
      <div className="w-40 h-2 bg-pink-100 rounded-full mt-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-400 to-pink-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}