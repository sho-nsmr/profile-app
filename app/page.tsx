"use client";

import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-pink-50 p-4 font-sans text-slate-900 leading-relaxed">
      {/* ヘッダー：プロフィール帳のタイトル */}
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-pink-200 mt-4">
        <div className="bg-pink-400 p-6 text-white text-center">
          <h1 className="text-2xl font-bold tracking-wider">Миний Профайл</h1>
          <p className="text-sm mt-1 font-medium">Найзууддаа өөрийгөө танилцуулаарай!</p>
          <p className="text-[10px] opacity-80 mt-1 italic">~ プロフィールをかいてね！ ~</p>
        </div>

        <form className="p-6 space-y-6">
          {/* 名前 */}
          <div>
            <label className="block text-pink-600 font-bold mb-1 ml-1 text-sm">Нэр (名前)</label>
            <input 
              type="text" 
              className="w-full border-b-2 border-pink-200 focus:border-pink-500 outline-none p-2 bg-pink-50/50 rounded-t-md transition-all"
              placeholder="Нэрээ бичээрэй..."
            />
          </div>

          {/* 趣味 */}
          <div>
            <label className="block text-pink-600 font-bold mb-1 ml-1 text-sm">Хобби (趣味)</label>
            <input 
              type="text" 
              className="w-full border-b-2 border-pink-200 focus:border-pink-500 outline-none p-2 bg-pink-50/50 rounded-t-md transition-all"
              placeholder="Дуртай зүйл..."
            />
          </div>

          {/* モンゴルの好きな食べ物 */}
          <div>
            <label className="block text-pink-600 font-bold mb-1 ml-1 text-sm">Дуртай хоол (好きな食べ物)</label>
            <select className="w-full border-b-2 border-pink-200 focus:border-pink-500 outline-none p-2 bg-pink-50/50 rounded-t-md transition-all appearance-none cursor-pointer">
              <option value="">Сонгох...</option>
              <option value="buuz">Бууз (ブーズ)</option>
              <option value="khuushuur">Хуушуур (ホーショール)</option>
              <option value="tsuivan">Цуйван (ツイワン)</option>
              <option value="horhog">Хорхог (ホルホグ)</option>
            </select>
          </div>

          {/* 将来の夢 */}
          <div>
            <label className="block text-pink-600 font-bold mb-1 ml-1 text-sm">Ирээдүйн хүсэл (将来の夢)</label>
            <textarea 
              className="w-full border-2 border-pink-100 focus:border-pink-400 outline-none p-3 bg-pink-50/50 rounded-xl h-28 transition-all resize-none"
              placeholder="Би ирээдүйд..."
            />
          </div>

          {/* 保存ボタン */}
          <div className="pt-2">
            <button 
              type="button" 
              className="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-bold py-4 rounded-full shadow-lg transition-all transform active:scale-95 shadow-pink-200"
            >
              Хадгалах (保存してQR作成)
            </button>
          </div>
        </form>
      </div>
      
      {/* フッター（ちょっとした装飾） */}
      <p className="text-center text-pink-300 text-xs mt-8">© 2026 Mazaalai Profile</p>
    </div>
  );
}
