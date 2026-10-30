import React from 'react';
import Link from 'next/link';

export default function AboutKuratorPage() {
  const kuratorList = [
    {
      name: 'K.R.M. Sasangka Hadiningrat',
      role: 'Kurator Utama & Pengawas Pakem Keraton',
      origin: 'Keraton Surakarta Hadiningrat',
      bio: 'Mengabdi lebih dari 35 tahun dalam pelestarian tari Bedhaya, Srimpi, dan tata busana adat pusaka keraton Surakarta.',
      initial: 'K',
      badge: 'Senior Kurator',
    },
    {
      name: 'Dra. Nyi Ayu Condrowati',
      role: 'Kurator Kostum & Tekstil Batik Kuno',
      origin: 'Paguyuban Busana Sriwedari',
      bio: 'Pakar konservasi kain dodot ageng, prada emas, dan pemeliharaan mahkota omprok kuningan tari tradisional.',
      initial: 'D',
      badge: 'Konservasi Kain',
    },
    {
      name: 'Ki Anom Sutrisno',
      role: 'Sutradara & Pengarah Musik Gamelan',
      origin: 'Gedung Wayang Orang Sriwedari',
      bio: 'Memimpin aransemen gending gamelan kyai pelog-salendro dan pelatihan koreografi wayang orang lintas generasi.',
      initial: 'A',
      badge: 'Maestro Gamelan',
    },
  ];

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

      {/* Content Body */}
      <main className="p-4 space-y-4">
        {/* Page Banner Title */}
        <div className="p-4 rounded-2xl bg-brand-green-dark text-canvas border border-brand-gold/25 relative overflow-hidden shadow-sm">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-brand-gold/15 blur-xl pointer-events-none" />
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-gold/20 text-brand-gold border border-brand-gold/30 mb-2">
            Dewan Kurator &amp; Pengampu Budaya
          </span>
          <h1 className="font-serif text-lg font-bold text-white leading-snug">
            Para Penjaga Warisan Luhur Sriwedari
          </h1>
          <p className="text-xs text-canvas/75 mt-1 leading-relaxed">
            Mengenal para empu, kurator seni, dan maestro yang mendedikasikan hidupnya untuk merawat keaslian pakem kesenian tari dan wayang orang.
          </p>
        </div>

        {/* Curators Single Column Stack (Proper Mobile Form Factor) */}
        <div className="space-y-3">
          {kuratorList.map((k) => (
            <div
              key={k.name}
              className="p-4 rounded-2xl bg-surface-container-low border border-divider shadow-sm hover:border-brand-gold/40 transition flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-brand-green text-brand-gold border border-brand-gold/40 flex items-center justify-center font-serif font-bold text-base shadow-sm shrink-0">
                  {k.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-serif text-sm font-bold text-primary truncate">
                      {k.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-brand-gold/15 text-brand-green-dark text-[9px] font-bold shrink-0">
                      {k.badge}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-brand-green block mt-0.5 leading-snug">
                    {k.role}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-on-surface-variant block mt-1">
                    {k.origin}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-divider/60">
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {k.bio}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Consultation Callout */}
        <div className="p-4 rounded-2xl bg-brand-green-dark text-canvas border border-brand-gold/30 space-y-2.5 shadow-sm">
          <div>
            <h3 className="font-serif font-bold gold-gradient-text text-sm">
              Konsultasi Sewa Busana Sanggar
            </h3>
            <p className="text-xs text-canvas/70 leading-relaxed mt-0.5">
              Tim kurator siap membantu verifikasi ukuran, motif pakem, dan kelengkapan busana adat Anda.
            </p>
          </div>
          <Link
            href="/bookings"
            className="w-full py-2.5 rounded-xl bg-brand-gold text-brand-green-dark text-xs font-bold hover:brightness-110 transition shadow-sm flex items-center justify-center gap-1.5"
          >
            <span>Buka Formulir Sewa</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
