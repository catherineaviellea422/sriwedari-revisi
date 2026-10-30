'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SriwedariDB } from '@/lib/db';
import { TicketItem } from '@/lib/types';

export default function AdminVisitorDailyPage() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);

  useEffect(() => {
    setTickets(SriwedariDB.getTickets());
    const handleUpdate = () => setTickets(SriwedariDB.getTickets());
    window.addEventListener('sriwedari_db_updated', handleUpdate);
    return () => window.removeEventListener('sriwedari_db_updated', handleUpdate);
  }, []);

  const checkedInCount = tickets.filter(t => t.status === 'Check-in').length;
  const waitingCount = tickets.filter(t => t.status === 'Aktif').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold gold-gradient-text">
            Presensi &amp; Rekap Kunjungan Harian (Daily)
          </h1>
          <p className="text-xs text-canvas/70 mt-0.5">
            Monitoring arus masuk penonton melalui pemindai gerbang teater secara waktu nyata
          </p>
        </div>

        <Link
          href="/admin/visitor"
          className="inline-flex items-center gap-1.5 text-xs text-brand-gold hover:underline"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Kembali ke Rekap Tiket</span>
        </Link>
      </div>

      {/* Realtime Attendance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#14382C]/80 border border-brand-gold/20">
          <span className="text-xs text-canvas/70 block mb-1">Tiket Terdaftar Hari Ini</span>
          <span className="text-2xl font-bold text-white">{tickets.length} Tiket</span>
          <span className="text-[10px] text-canvas/50 mt-1 block">Seluruh kuota terbit</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#14382C]/80 border border-brand-gold/20">
          <span className="text-xs text-canvas/70 block mb-1">Sudah Check-In Gerbang</span>
          <span className="text-2xl font-bold text-emerald-400">{checkedInCount} Pengunjung</span>
          <span className="text-[10px] text-emerald-300 mt-1 block">Tervalidasi di Pintu Masuk</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#14382C]/80 border border-brand-gold/20">
          <span className="text-xs text-canvas/70 block mb-1">Menunggu Kehadiran</span>
          <span className="text-2xl font-bold text-amber-400">{waitingCount} Tiket</span>
          <span className="text-[10px] text-amber-300 mt-1 block">Pintu gerbang masih dibuka</span>
        </div>
      </div>

      {/* Gate Scanner Action Box */}
      <div className="p-6 rounded-3xl bg-brand-green border border-brand-gold/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-base font-bold gold-gradient-text">
            Validasi Gerbang Langsung (Gate Scanner)
          </h3>
          <p className="text-xs text-canvas/80 mt-1">
            Gunakan barcode scanner atau input manual kode booking untuk mencatat kehadiran pengunjung.
          </p>
        </div>
        <Link
          href="/admin/pos"
          className="px-5 py-2.5 rounded-xl bg-brand-gold text-brand-green-dark font-semibold text-xs hover:brightness-110 transition flex items-center gap-1.5 shadow-md"
        >
          <span className="material-symbols-outlined text-base">qr_code_scanner</span>
          <span>Buka Pemindai Tiket</span>
        </Link>
      </div>
    </div>
  );
}
