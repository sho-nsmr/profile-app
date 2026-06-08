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
          // view用のURLを復元
          setQrUrl(`${window.location.origin}/view?p=${compressedData}`);
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

  if (!qrUrl) {
    return <div className="text-slate-400 animate-pulse text-sm">Loading...</div>;
  }

  return (
    <div className="w-full max-w-xs bg-white rounded-[2rem] shadow-2xl border-4 border-pink-200 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
      
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
        <QRCode value={qrUrl} size={150} />
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
      <Suspense fallback={<div className="text-sky-400 italic text-sm">Бэлдэж байна...</div>}>
        <ScreenshotContent />
      </Suspense>
    </div>
  );
}