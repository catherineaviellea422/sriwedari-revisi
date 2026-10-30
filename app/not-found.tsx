import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-green-dark text-canvas flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-green border border-brand-gold/40 flex items-center justify-center text-brand-gold mb-4 shadow-lg">
        <span className="material-symbols-outlined text-4xl">temple_buddhist</span>
      </div>
      <h1 className="font-serif text-3xl font-bold gold-gradient-text mb-2">404 — Layar Tidak Ditemukan</h1>
      <p className="text-canvas/70 max-w-md mb-6 text-sm">
        Halaman atau pusaka yang Anda cari tidak tersedia dalam arsip pergelaran Galeri Sriwedari.
      </p>
      <Link
        href="/dashboard"
        className="px-6 py-2.5 rounded-xl bg-brand-gold text-brand-green-dark font-semibold text-sm hover:brightness-110 transition shadow-md"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
