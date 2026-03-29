"use client";
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';

function ProfileContent() {
    const searchParams = useSearchParams();
    const dataRaw = searchParams.get('d');

    if (!dataRaw) return <div className="p-10 text-center">Data not found.</div>;

    try {
        // ƒf[ƒ^‚ğ•œŒ³
        const decodedData = JSON.parse(decodeURIComponent(atob(dataRaw)));

        return (
            <div className="min-h-screen bg-pink-50 p-6 flex items-center justify-center">
                <div className="max-w-sm w-full bg-white rounded-3xl shadow-2xl border-4 border-pink-200 overflow-hidden">
                    <div className="bg-pink-400 p-8 text-white text-center">
                        <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                            ??
                        </div>
                        <h1 className="text-3xl font-bold">{decodedData.name}</h1>
                        <p className="opacity-90 mt-2">„M„y„~„y„z „P„‚„€„†„p„z„|</p>
                    </div>

                    <div className="p-8 space-y-6">
                        <div>
                            <p className="text-pink-500 font-bold text-sm uppercase tracking-widest">„V„€„q„q„y (ï–¡)</p>
                            <p className="text-xl text-slate-700 border-b border-pink-100 pb-2">{decodedData.hobby}</p>
                        </div>
                        <div>
                            <p className="text-pink-500 font-bold text-sm uppercase tracking-widest">„D„…„‚„„„p„z „‡„€„€„| (D‚«‚ÈH‚×•¨)</p>
                            <p className="text-xl text-slate-700 border-b border-pink-100 pb-2">{decodedData.food}</p>
                        </div>
                        <div>
                            <p className="text-pink-500 font-bold text-sm uppercase tracking-widest">„I„‚„„„t?„z («—ˆ‚Ì–²)</p>
                            <p className="text-lg text-slate-600 italic bg-pink-50/50 p-3 rounded-xl">{decodedData.dream}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (e) {
        return <div className="p-10 text-center">Invalid data format.</div>;
    }
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProfileContent />
        </Suspense>
    );
}