"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import QRCode from "react-qr-code";
import Link from 'next/link';
import LZString from 'lz-string';

function ScreenshotContent() {
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const compressedData = searchParams.get('p');
    if (compressedData) {
      try {
        const jsonStr = LZString.decompressFromEncodedURIComponent(compressedData);
        if (jsonStr) {
          const decodedData = JSON.parse(jsonStr);
          setName(decodedData.name);
          
          // ★ 高速化：window.location.origin の解決を非同期のラグなしで即座に実行
          const origin = window.location.origin;
          // view用のURLを復元
          setQrUrl(`${origin}/view?p=${compressedData}`);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      }
    } else {
      setError(true);
    }
  }, [searchParams]);

  if (error) {
    return <div className="text-red-500 font-bold text-sm">Өгөгдөл буруу байна (エラー)</div>;
  }

  // ★ 高速化：青い画面での数秒間の膠着を防ぎ、最初にカードの「骨組み」をパッと出すことで体感速度を限界まで向上
  if (!qrUrl) {
    return (
      <div className="w-full max-w-xs bg-white rounded-[2rem] p-6 flex flex-col items-center justify-center text-center shadow-xl">
        <div className="w-32 h-6 bg-slate-100 animate-pulse rounded mb-4" />
        <div className="w-[150px] h-[150px] bg-slate-100 animate-pulse rounded-2xl" />
      </div>
    );
  }

  return (
    // ★ 高速化：0.2秒のスムーズなフェードイン（duration-200）で一瞬でカードを浮かび上がらせる
    <div className="w-full max-w-xs bg-white rounded-[2rem] shadow-2xl border-4 border-pink-200 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      {/* 装飾用のうっすらした背景バルーン */}
      <div className="absolute -top-6 -right-6 text-7xl opacity-10 pointer-events-none">🎈</div>
      <div className="absolute -bottom-6 -left-6 text-7xl opacity-10 pointer-events-none">🎈</div>

      {/* ヘッダータイトル */}
      <p className="text-[10px] text-pink-400 font-black tracking-[0.2em] uppercase mb-2">
        Mazaalai Profile QR
      </p>

      {/* 整形された名前（あだ名入り）を表示 */}
      <h1 className="text-xl font-black text-slate-800 tracking-tight leading-snug mb-5 max-w-[240px] break-words">
        {name}
      </h1>

      {/* QRコード（どんな画面でも絶対に収まるサイズ150px） */}
      <div className="p-3.5 rounded-2xl bg-white shadow-xl border border-pink-50 ring-4 ring-pink-50/50">
        {/* ★ 高速化：level="H" (最高レベルのエラー訂正) を追加し、スクショが多少荒くても一瞬でスキャン可能に */}
        <QRCode value={qrUrl} size={150} level="H" />
      </div>

      {/* スキャンを促すテキスト */}
      <p className="mt-5 text-[10px] text-slate-400 font-bold leading-relaxed">
        QR кодыг уншуулаад профайлыг үзээрэй ✨<br/>
        (QRコードをスキャンしてプロフィールを見てね)
      </p>

      {/* スクショに映したくない、戻るための隠しリンク（目立たないように配置） */}
      <Link 
        href="/" 
        className="mt-4 text-[10px] text-slate-300 hover:text-pink-400 transition-colors underline decoration-dotted"
      >
        🏠 Буцах (トップに戻る)
      </Link>
    </div>
  );
}

export default function ScreenshotPage() {
  return (
    // 画面の縦横を完全に固定し、はみ出し（スクロール）を絶対させないコンテナ
    <div className="w-screen h-screen h-[100dvh] bg-sky-100 flex items-center justify-center p-4 overflow-hidden select-none">
      {/* ★ 高速化：待機中(fallback) も真っ白な画面にせず、あらかじめカードの骨組みを出してチラつきを根絶 */}
      <Suspense fallback={
        <div className="w-full max-w-xs bg-white rounded-[2rem] p-6 flex flex-col items-center justify-center text-center shadow-xl">
          <div className="w-32 h-6 bg-slate-100 animate-pulse rounded mb-4" />
          <div className="w-[150px] h-[150px] bg-slate-100 animate-pulse rounded-2xl" />
        </div>
      }>
        <ScreenshotContent />
      </Suspense>
    </div>
  );
}