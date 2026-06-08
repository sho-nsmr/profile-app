export default function Loading() {
  return (
    // 画面全体を screenshot ページと同じ淡い水色背景にする
    <div className="w-screen h-screen h-[100dvh] bg-sky-100 flex flex-col items-center justify-center p-4 overflow-hidden select-none">
      
      {/* スクショ用カードと同じ形の「枠組み（スケルトン）」を表示 */}
      <div className="w-full max-w-xs bg-white rounded-[2rem] shadow-2xl border-4 border-pink-100 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
        
        {/* 中央でくるくる回るスピナーのロード演出 */}
        <div className="flex flex-col items-center justify-center py-10">
          
          {/* くるくる回るピンクのスピナー */}
          <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mb-4" />
          
          <p className="text-pink-400 font-black text-xs tracking-widest uppercase animate-pulse">
            Бэлдэж байна...
          </p>
          <p className="text-[10px] text-slate-400 mt-1 font-medium italic">
            Preparing QR Code...
          </p>
        </div>

      </div>
    </div>
  );
}