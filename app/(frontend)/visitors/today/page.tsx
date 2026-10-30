import React from 'react';
import Link from 'next/link';

export default function VisitorsTodayPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/visitors"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-green hover:underline"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Kembali ke Kalender Jadwal</span>
        </Link>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
          Pentas Hari Ini
        </span>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-brand-green-dark text-canvas border border-brand-gold/30 shadow-card-warm space-y-3">
        <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider block">
          Gedung Wayang Orang Sriwedari Surakarta
        </span>
        <h1 className="font-serif text-base sm:text-lg font-bold gold-gradient-text leading-snug">
          Pentas Spesial: Lakon Ramayana Tambak
        </h1>
        <p className="text-xs text-canvas/80 leading-relaxed">
          Malam ini panggung legendaris Sriwedari menyajikan epos heroisme Wanara dalam membangun jembatan batu melintasi samudra luas. Didukung 60 seniman dan iringan gamelan live Kyai Kaduk Manis.
        </p>

        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-brand-gold/20 text-xs">
          <div>
            <span className="text-canvas/60 block text-[10px]">Pintu Masuk:</span>
            <span className="font-semibold text-white">Gerbang Timur &amp; Barat</span>
          </div>
          <div>
            <span className="text-canvas/60 block text-[10px]">Buka Gerbang:</span>
            <span className="font-semibold text-white">19:00 WIB</span>
          </div>
          <div>
            <span className="text-canvas/60 block text-[10px]">Mulai Pentas:</span>
            <span className="font-semibold text-brand-gold">20:00 WIB Tepat</span>
          </div>
          <div>
            <span className="text-canvas/60 block text-[10px]">Loket On-the-spot:</span>
            <span className="font-semibold text-emerald-300">Tersedia di Loket</span>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/visitors"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold text-brand-green-dark font-semibold text-xs hover:brightness-110 transition shadow-md"
          >
            <span>Reservasi Kursi Teater Sekarang</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
