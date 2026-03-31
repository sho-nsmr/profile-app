"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ProfileContent() {
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLanded, setIsLanded] = useState(false);

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(atob(data)));
        setProfile(decodedData);
        setTimeout(() => setIsLanded(true), 1500);
      } catch (e) {
        console.error(e);
      }
    }
  }, [searchParams]);

  if (!profile) return <div className="p-10 text-center text-pink-400">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] relative">
      <div className={`w-32 h-6 bg-black/10 rounded-[100%] blur-xl transition-all duration-[2000ms] ${isLanded ? "scale-100 opacity-40" : "scale-50 opacity-0 translate-y-20"}`} />
      <div className={`relative z-10 transition-all duration-[1500ms] ease-out ${isLanded ? "translate-y-0" : "-translate-y-[100vh]"}`}>
        {!isOpen ? (
          <button onClick={() => setIsOpen(true)} className="group flex flex-col items-center animate-bounce">
            <div className="text-8xl mb-4 transform group-hover:scale-110 transition-transform">🎈</div>
            <div className="bg-white px-6 py-2 rounded-full shadow-lg border-2 border-pink-400 text-pink-500 font-bold">
              Товшиж нээгээрэй!
            </div>
          </button>
        ) : (
          <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-pink-200 animate-in zoom-in duration-500">
            <div className="bg-pink-400 p-6 text-white text-center">
              <div className="text-4xl mb-2">🎈</div>
              <h1 className="text-xl font-bold">{profile.name}-ийн профайл</h1>
            </div>
            <div className="p-6 space-y-4 bg-white">
              <div className="bg-pink-50 p-3 rounded-xl border border-pink-100 text-slate-700">
                <p className="text-[10px] text-pink-400 font-bold uppercase">Хобби</p>
                <p className="font-medium text-lg">{profile.hobby || "---"}</p>
              </div>
              <div className="bg-pink-50 p-3 rounded-xl border border-pink-100 text-slate-700">
                <p className="text-[10px] text-pink-400 font-bold uppercase">Хоол</p>
                <p className="font-medium text-lg text-pink-600">{profile.food || "---"}</p>
              </div>
              <div className="bg-pink-50 p-4 rounded-xl border-2 border-dashed border-pink-200 text-slate-700 italic">
                <p className="text-[10px] text-pink-400 font-bold uppercase not-italic mb-1">Хүсэл</p>
                "{profile.dream || "---"}"
              </div>
              <a href="/" className="block w-full text-center py-4 bg-pink-400 text-white font-bold rounded-full shadow-lg hover:bg-pink-500 transition-colors">
                Буцах
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ViewPage() {
  return (
    <div className="min-h-screen bg-sky-50 p-4 overflow-hidden relative flex flex-col items-center justify-between">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-6xl opacity-20 animate-pulse">☁️</div>
        <div className="absolute top-1/2 right-10 text-8xl opacity-10 animate-bounce">☁️</div>
        <div className="absolute top-1/4 right-1/4 text-5xl opacity-10">☁️</div>
      </div>
      <Suspense fallback={<div className="mt-20">Loading...</div>}>
        <ProfileContent />
      </Suspense>
      <div className="w-full h-16 bg-gradient-to-t from-green-100 to-transparent opacity-80" />
      <p className="fixed bottom-4 text-pink-300 text-[10px]">© 2026 Mazaalai Profile</p>
    </div>
  );
}