'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SriwedariDB } from '@/lib/db';
import { TicketItem } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';

export default function AdminVisitorTodayPage() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);

  useEffect(() => {
    setTickets(SriwedariDB.getTickets());
    const handleUpdate = () => setTickets(SriwedariDB.getTickets());
    window.addEventListener('sriwedari_db_updated', handleUpdate);
    return () => window.removeEventListener('sriwedari_db_updated', handleUpdate);
  }, []);

  const todayRevenue = tickets.reduce((acc, t) => acc + (t.totalPrice || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold gold-gradient-text">
            Jadwal &amp; Kehadiran Pengunjung Hari Ini (Today)
          </h1>
          <p className="text-xs text-canvas/70 mt-0.5">
            Daftar penonton yang memiliki tiket pementasan aktif malam ini
          </p>
        </div>

        <Link
          href="/admin/visitor/daily"
          className="inline-flex items-center gap-1.5 text-xs text-brand-gold hover:underline"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Buka Rekap Harian (Daily)</span>
        </Link>
      </div>

      {/* Highlights */}
      <div className="p-6 rounded-3xl bg-brand-green border border-brand-gold/30 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider block mb-1">
            Agenda Pagelaran Malam Ini
          </span>
          <h2 className="font-serif text-xl font-bold text-white">
            Lakon Ramayana Tambak — Wayang Orang Sriwedari
          </h2>
          <p className="text-xs text-canvas/80 mt-1">Pintu gerbang pementasan dibuka pukul 19:00 WIB.</p>
        </div>

        <div className="text-right">
          <span className="text-xs text-canvas/70 block">Estimasi Omzet Tiket:</span>
          <span className="text-xl font-bold text-brand-gold price">{formatRupiah(todayRevenue)}</span>
        </div>
      </div>

      {/* Tickets List */}
      <div className="rounded-3xl bg-[#14382C]/80 border border-brand-gold/20 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-black/40 text-canvas/60 uppercase text-[10px] tracking-wider border-b border-brand-gold/20">
            <tr>
              <th className="py-3 px-4">Kode Booking</th>
              <th className="py-3 px-4">Nama Penonton</th>
              <th className="py-3 px-4">Zona &amp; Kursi</th>
              <th className="py-3 px-4">Status Gerbang</th>
              <th className="py-3 px-4 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tickets.map((t) => (
              <tr key={t.id} className="hover:bg-white/5 transition">
                <td className="py-3 px-4 font-mono font-bold text-brand-gold">{t.bookingCode}</td>
                <td className="py-3 px-4 font-semibold text-white">{t.userName}</td>
                <td className="py-3 px-4">Zona {t.zone} ({t.seats?.join(', ') || 'Kursi Otomatis'})</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      t.status === 'Check-in'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <Link
                    href="/admin/pos"
                    className="px-3 py-1 rounded-lg bg-black/40 hover:bg-black/60 text-brand-gold border border-brand-gold/30 text-[11px] font-medium"
                  >
                    Buka Scanner
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
