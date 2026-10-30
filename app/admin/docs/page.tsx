'use client';

import React from 'react';
import Link from 'next/link';

export default function AdminDocsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold gold-gradient-text">
            Dokumentasi Alur Sistem &amp; Panduan Operasional Kurator
          </h1>
          <p className="text-xs text-canvas/70 mt-0.5">
            Relokasi resmi dokumentasi FLOW.md dari project hub ke modul internal kurator
          </p>
        </div>

        <Link
          href="/admin/dashboard"
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-brand-gold text-brand-green-dark font-semibold text-xs hover:brightness-110 transition flex items-center gap-1.5 shadow-md"
        >
          <span className="material-symbols-outlined text-base">dashboard</span>
          <span>Kembali ke Dashboard</span>
        </Link>
      </div>

      {/* Guide Cards */}
      <div className="space-y-5 text-xs text-canvas/90">
        <div className="p-6 rounded-3xl bg-[#14382C]/80 border border-brand-gold/20 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-brand-gold/20 text-brand-gold flex items-center justify-center font-bold">1</span>
            <h2 className="font-serif text-base font-bold text-white">Alur Masuk Langsung Tanpa Emulator (Entry Flow)</h2>
          </div>
          <p className="leading-relaxed text-canvas/70">
            Aplikasi dikonfigurasi menggunakan Next.js App Router di mana seluruh panggilan ke alamat <code className="text-brand-gold">http://localhost:3000/</code> akan langsung dialihkan via HTTP 307 ke <code className="text-brand-gold">/auth/login</code> tanpa melalui wrapper emulator statis.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#14382C]/80 border border-brand-gold/20 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-brand-gold/20 text-brand-gold flex items-center justify-center font-bold">2</span>
            <h2 className="font-serif text-base font-bold text-white">Siklus Verifikasi &amp; QC Pengembalian Busana (Refund Engine)</h2>
          </div>
          <p className="leading-relaxed text-canvas/70">
            Ketika penyewa mengembalikan busana adat ke sanggar, kurator wajib membuka menu <strong>Pesanan &amp; QC Sewa (/admin/bookings)</strong> dan memilih tingkat mutu:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-canvas/80">
            <li><strong>Grade A (Sempurna / Utuh):</strong> Denda Rp 0 &rarr; 100% deposit Rp 100.000 dicairkan kembali ke penyewa.</li>
            <li><strong>Grade B (Kotor Ringan / Keringat):</strong> Denda cuci Rp 25.000 &rarr; Refund deposit Rp 75.000.</li>
            <li><strong>Grade C (Kerusakan Sedang / Jahitan):</strong> Denda perbaikan Rp 50.000 &rarr; Refund deposit Rp 50.000.</li>
            <li><strong>Grade D (Rusak Berat / Hilang):</strong> Denda Rp 100.000 &rarr; Deposit hangus sepenuhnya.</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-[#14382C]/80 border border-brand-gold/20 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-brand-gold/20 text-brand-gold flex items-center justify-center font-bold">3</span>
            <h2 className="font-serif text-base font-bold text-white">Operasional Kasir Loket Walk-in &amp; Gate Scanner</h2>
          </div>
          <p className="leading-relaxed text-canvas/70">
            Staf loket di gedung pementasan dapat menggunakan modul <strong>Kasir Loket (POS) (/admin/pos)</strong> untuk mencetak struk tiket langsung di tempat serta memvalidasi barcode/QR booking penonton di pintu gerbang. Tiket yang sudah pernah check-in akan ditolak oleh sistem untuk mencegah tiket ganda.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#14382C]/80 border border-brand-gold/20 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-brand-gold/20 text-brand-gold flex items-center justify-center font-bold">4</span>
            <h2 className="font-serif text-base font-bold text-white">Keamanan &amp; Audit Trail Ekspor CSV</h2>
          </div>
          <p className="leading-relaxed text-canvas/70">
            Seluruh transaksi finansial, pembuatan pesanan sewa, reservasi tiket, mutasi peran staf, dan reset database dicatat otomatis di <strong>Audit Trail (/admin/audit)</strong> dengan tombol ekspor file CSV berformat UTF-8 BOM yang langsung dapat dibuka di Excel dan Google Sheets.
          </p>
        </div>
      </div>
    </div>
  );
}
