import React from 'react';
import Link from 'next/link';

export default function AboutSejarahPage() {
  return (
    <div className="w-full bg-surface pb-12 flex flex-col">
      {/* Mobile Sticky Header */}
      <header className="h-14 bg-brand-green-dark border-b border-brand-gold/20 px-4 flex items-center justify-between sticky top-0 z-30 shrink-0">
        <Link
          href="/about"
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-gold hover:text-white transition"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Tentang Sriwedari</span>
        </Link>
        <Link
          href="/dashboard"
          className="px-2.5 py-1 rounded-lg bg-brand-gold text-brand-green-dark text-xs font-bold hover:brightness-110 transition flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">home</span>
          <span>Beranda</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-4">
        {/* Banner */}
        <div className="p-4 rounded-2xl bg-brand-green-dark text-canvas border border-brand-gold/25 relative overflow-hidden shadow-sm">
          <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-brand-gold/15 blur-xl pointer-events-none" />
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-gold/20 text-brand-gold border border-brand-gold/30 mb-2">
            Kronik Sejarah Keraton
          </span>
          <h1 className="font-serif text-lg font-bold text-white leading-snug">
            Sejarah Panjang Taman Sriwedari (1899 - Sekarang)
          </h1>
          <p className="text-xs text-canvas/75 mt-1 leading-relaxed">
            Menelusuri jejak Sri Susuhunan Pakubuwana X dalam mendirikan pusat kebudayaan rakyat dan gedung pertunjukan Wayang Orang tertua di Nusantara.
          </p>
        </div>

        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden border border-divider shadow-sm aspect-[16/10] relative">
          <img
            src="/images/tari-jawa-dramatic-stage.png"
            alt="Wayang Orang Sriwedari"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Timeline Items */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-surface-container-low border border-divider shadow-sm">
            <span className="text-[10px] font-bold text-brand-green font-mono block mb-1">
              TAHUN 1899 — ERA PAKUBUWANA X
            </span>
            <h2 className="font-serif text-sm font-bold text-primary mb-1">
              Pendirian Kebon Raja Sriwedari
            </h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Taman Sriwedari didirikan sebagai tempat rekreasi keluarga istana dan hiburan rakyat (*bonrojo*). Nama Sriwedari diambil dari mitologi pewayangan yang berarti taman surga yang indah di Kahyangan.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-low border border-divider shadow-sm">
            <span className="text-[10px] font-bold text-brand-green font-mono block mb-1">
              TAHUN 1910 — LAHIRNYA GEDUNG WAYANG ORANG
            </span>
            <h2 className="font-serif text-sm font-bold text-primary mb-1">
              Panggung Wayang Orang Paling Legendaris
            </h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Kelompok kesenian Wayang Orang Sriwedari mulai menggelar pertunjukan rutin setiap malam. Para seniman keraton membawa tradisi tari beksan keluar dari tembok istana untuk dinikmati seluruh lapisan masyarakat.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-low border border-divider shadow-sm">
            <span className="text-[10px] font-bold text-brand-green font-mono block mb-1">
              ERA MODERN &amp; DIGITALISASI
            </span>
            <h2 className="font-serif text-sm font-bold text-primary mb-1">
              Galeri Sriwedari: Arsip Budaya &amp; Sewa Busana
            </h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Melalui aplikasi Galeri Sriwedari, seluruh dokumentasi panggung, filosofi tari, koleksi busana adat, dan pemesanan tiket terhubung dalam satu ekosistem terpadu untuk menjaga nyala api kebudayaan Surakarta.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <Link
            href="/about/kurator"
            className="text-xs font-semibold text-brand-green hover:underline flex items-center gap-1"
          >
            <span>Dewan Kurator</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
          <Link
            href="/visitors"
            className="px-3.5 py-2 rounded-xl bg-brand-gold text-brand-green-dark text-xs font-bold shadow-sm"
          >
            Jadwal Pagelaran
          </Link>
        </div>
      </main>
    </div>
  );
}
