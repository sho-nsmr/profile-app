"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ProfileContent() {
const searchParams = useSearchParams();
const [profile, setProfile] = useState<{name:string;hobby:string;food:string;dream:string;}|null>(null);
const [error, setError] = useState(false);
useEffect(() => {
const data = searchParams.get('data');
if (data) {
try {
const decodedData = JSON.parse(decodeURIComponent(atob(data)));
setProfile(decodedData);
} catch (e) {
setError(true);
}
}
}, [searchParams]);
if (error) return <div className="p-10 text-center">Алдаа гарлаа (エラー)</div>;
if (!profile) return <div className="p-10 text-center">Loading...</div>;
const getFoodName = (code: string) => {
const foods: {[key: string]: string} = {
buuz: "Бууз (ブーズ) 🥟",
khuushuur: "Хуушуур (ホーショール) 🥟",
tsuivan: "Цуйван (ツイワン) 🍝",
horhog: "Хорхог (ホルホグ) 🍖"
};
return foods[code] || "---";
};
return (
<div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-pink-200 mt-10 animate-in slide-in-from-top-full duration-[2000ms] ease-out">
<div className="bg-pink-400 p-8 text-white text-center">
<div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-inner">🎈</div>
<h1 className="text-2xl font-bold">{profile.name}-ийн профайл</h1>
</div>
<div className="p-8 space-y-6 bg-gradient-to-b from-white to-pink-50">
<section>
<h2 className="text-xs font-bold text-pink-400 mb-2 uppercase tracking-tighter">Хобби (趣味)</h2>
<div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm text-lg">{profile.hobby || "---"}</div>
</section>
<section>
<h2 className="text-xs font-bold text-pink-400 mb-2 uppercase tracking-tighter">Дуртай хоол (好きな食べ物)</h2>
<div className="bg-white p-4 rounded-2xl border border-pink-100 shadow-sm text-lg">{getFoodName(profile.food)}</div>
</section>
<section>
<h2 className="text-xs font-bold text-pink-400 mb-2 uppercase tracking-tighter">Ирээдүйн хүсэл (将来の夢)</h2>
<div className="bg-white p-5 rounded-2xl border-2 border-dashed border-pink-200 italic text-slate-600 leading-relaxed">"{profile.dream || "---"}"</div>
</section>
<div className="pt-6">
<a href="/" className="block w-full text-center py-4 text-white bg-pink-400 font-bold rounded-full shadow-lg transition-all transform active:scale-95">Буцах (戻る)</a>
</div>
</div>
);
}

export default function ViewPage() {
return (
<div className="min-h-screen bg-sky-50 p-4 overflow-x-hidden relative">
<div className="fixed top-20 left-10 text-6xl opacity-20 pointer-events-none">☁️</div>
<div className="fixed top-40 right-10 text-5xl opacity-10 pointer-events-none">☁️</div>
<Suspense fallback={<div className="text-center p-10 text-pink-400">Loading...</div>}>
<ProfileContent />
</Suspense>
<div className="fixed bottom-0 left-0 w-full h-20 bg-gradient-to-t from-green-100 to-transparent opacity-60 -z-10"></div>
<p className="text-center text-pink-300 text-xs mt-12">© 2026 Mazaalai Profile</p>
</div>
);
}