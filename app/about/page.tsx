import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="w-full bg-surface pb-12 flex flex-col">
      {/* Mobile Sticky Header */}
      <header className="h-14 bg-brand-green-dark border-b border-brand-gold/20 px-4 flex items-center justify-between sticky top-0 z-30 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-green border border-brand-gold/40 flex items-center justify-center text-brand-gold">
            <span className="material-symbols-outlined text-lg">temple_buddhist</span>
          </div>
          <div>
            <span className="font-serif text-sm font-bold gold-gradient-text tracking-wide block leading-none">
              GALERI SRIWEDARI
            </span>
            <span className="text-[9px] text-canvas/60">Tentang Lembaga Budaya</span>
          </div>
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
        {/* Hero Card */}
        <div className="p-4 rounded-2xl bg-brand-green-dark text-canvas border border-brand-gold/25 relative overflow-hidden shadow-sm">
          <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-brand-gold/15 blur-xl pointer-events-none" />
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-gold/20 text-brand-gold border border-brand-gold/30 mb-2">
            Sejarah &amp; Warisan Luhur
          </span>
          <h1 className="font-serif text-lg font-bold text-white leading-snug">
            Menjaga Napas Kebudayaan Keraton Surakarta
          </h1>
          <p className="text-xs text-canvas/75 mt-1.5 leading-relaxed">
            Galeri Sriwedari adalah pusat digitalisasi dan pelestarian karya seni tari tradisional, busana adat pementasan, dan denyut panggung Wayang Orang Sriwedari sejak masa Sri Susuhunan Pakubuwana X.
          </p>

          {/* Quick Subpage Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10">
            <Link
              href="/about/sejarah"
              className="py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-brand-gold/30 text-[11px] font-semibold text-brand-gold transition flex items-center justify-center gap-1.5 text-center"
            >
              <span className="material-symbols-outlined text-sm">history_edu</span>
              <span>Sejarah 1899</span>
            </Link>
            <Link
              href="/about/kurator"
              className="py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-brand-gold/30 text-[11px] font-semibold text-brand-gold transition flex items-center justify-center gap-1.5 text-center"
            >
              <span className="material-symbols-outlined text-sm">groups</span>
              <span>Dewan Kurator</span>
            </Link>
          </div>
        </div>

        {/* 3 Value Pillars (Mobile Vertical Stack) */}
        <div className="space-y-3">
          <Link
            href="/about/sejarah"
            className="group p-4 rounded-2xl bg-surface-container-low border border-divider hover:border-brand-gold/50 shadow-sm transition block"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">history_edu</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-sm font-bold text-primary group-hover:text-brand-green transition flex items-center justify-between">
                  <span>Didirikan Sejak 1899</span>
                  <span className="material-symbols-outlined text-sm text-brand-green group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </h2>
                <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                  Taman Sriwedari dibangun sebagai taman rekreasi dan kebudayaan rakyat oleh Pakubuwana X, menghidupkan tradisi wayang orang setiap malam.
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/collection/costumes"
            className="group p-4 rounded-2xl bg-surface-container-low border border-divider hover:border-brand-gold/50 shadow-sm transition block"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">checkroom</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-sm font-bold text-primary group-hover:text-brand-green transition flex items-center justify-between">
                  <span>Busana Pakem Adat</span>
                  <span className="material-symbols-outlined text-sm text-brand-green group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </h2>
                <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                  Merawat ratusan koleksi busana panggung, mahkota omprok, topeng kayu, hingga dodot keraton asli dengan standar kurasi ketat.
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/about/kurator"
            className="group p-4 rounded-2xl bg-surface-container-low border border-divider hover:border-brand-gold/50 shadow-sm transition block"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">diversity_3</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-sm font-bold text-primary group-hover:text-brand-green transition flex items-center justify-between">
                  <span>Regenerasi Seniman</span>
                  <span className="material-symbols-outlined text-sm text-brand-green group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </h2>
                <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                  Mewadahi generasi muda dan sanggar tari Nusantara untuk terus berkarya, menyewa busana, dan mementaskan lakon budaya adiluhung.
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Location & Details Mobile Card */}
        <div className="p-4 rounded-2xl bg-brand-green-dark text-canvas border border-brand-gold/30 space-y-3 shadow-sm">
          <div>
            <h3 className="font-serif text-sm font-bold gold-gradient-text mb-0.5">
              Gedung Wayang Orang &amp; Galeri Pusaka
            </h3>
            <p className="text-xs text-canvas/70 leading-relaxed">
              Jl. Brigjend Slamet Riyadi No. 275, Sriwedari, Laweyan, Surakarta. Jam buka loket &amp; galeri: 08.00 - 22.00 WIB.
            </p>
          </div>
          <Link
            href="/visitors"
            className="w-full py-2.5 rounded-xl bg-brand-gold text-brand-green-dark font-bold text-xs hover:brightness-110 transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Lihat Jadwal Pentas Wayang</span>
            <span className="material-symbols-outlined text-sm">calendar_month</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
