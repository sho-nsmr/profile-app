"use client";
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';

function ProfileContent() {
  const searchParams = useSearchParams();
  const dataRaw = searchParams.get('d');

  // データがない場合の表示
  if (!dataRaw) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-md">
          <p className="text-slate-500 text-lg">データが見つかりませんでした。</p>
          <a href="/" className="mt-4 inline-block text-pink-500 hover:underline">入力画面へ戻る</a>
        </div>
      </div>
    );
  }

  try {
    // 1. Base64デコード 2. URIデコード 3. JSONパース
    // 入力側と対になる復元処理
    const decodedData = JSON.parse(decodeURIComponent(escape(atob(dataRaw))));

    return (
      <div className="min-h-screen bg-pink-50 p-6 flex items-center justify-center">
        <div className="max-w-sm w-full bg-white rounded-3xl shadow-2xl border-4 border-pink-100 overflow-hidden">
          {/* ヘッダー部分 */}
          <div className="bg-pink-400 p-8 text-white text-center">
            <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-5xl">
              👤
            </div>
            <h1 className="text-3xl font-bold">{decodedData.name}</h1>
            <p className="opacity-90 mt-2 font-medium">Миний Профайл (My Profile)</p>
          </div>

          {/* コンテンツ部分 */}
          <div className="p-8 space-y-6">
            <div className="border-l-4 border-pink-200 pl-4">
              <p className="text-pink-500 font-bold text-xs uppercase tracking-widest mb-1">Хобби (趣味)</p>
              <p className="text-xl text-slate-700 font-semibold">{decodedData.hobby}</p>
            </div>

            <div className="border-l-4 border-pink-200 pl-4">
              <p className="text-pink-500 font-bold text-xs uppercase tracking-widest mb-1">Дуртай хоол (好きな食べ物)</p>
              <p className="text-xl text-slate-700 font-semibold">{decodedData.food}</p>
            </div>

            <div className="bg-pink-50 p-4 rounded-2xl relative">
              <p className="text-pink-500 font-bold text-xs uppercase tracking-widest mb-2">Ирээдүй (将来の夢)</p>
              <p className="text-lg text-slate-600 italic leading-relaxed">
                「{decodedData.dream}」
              </p>
            </div>
          </div>

          {/* フッター（戻るボタン） */}
          <div className="p-4 text-center border-t border-pink-50">
            <a href="/" className="text-pink-300 hover:text-pink-500 text-sm transition-colors">
              新しいプロファイルを作る
            </a>
          </div>
        </div>
      </div>
    );
  } catch (e) {
    console.error("Decode error:", e);
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-md border border-red-100">
          <p className="text-red-500 font-bold">データの読み込みに失敗しました。</p>
          <p className="text-sm text-slate-400 mt-2">URLが正しくない可能性があります。</p>
          <a href="/" className="mt-4 inline-block text-slate-500 hover:underline text-sm">戻る</a>
        </div>
      </div>
    );
  }
}

// Next.jsの仕様上、useSearchParamsを使う場合はSuspenseで囲む必要があります
export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="animate-spin h-10 w-10 border-4 border-pink-500 rounded-full border-t-transparent"></div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}