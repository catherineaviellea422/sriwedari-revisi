'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SriwedariDB } from '@/lib/db';
import { TicketItem, EventItem } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';

export default function AdminVisitorPage() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    setTickets(SriwedariDB.getTickets());
    setEvents(SriwedariDB.getEvents());
    const handleUpdate = () => {
      setTickets(SriwedariDB.getTickets());
      setEvents(SriwedariDB.getEvents());
    };
    window.addEventListener('sriwedari_db_updated', handleUpdate);
    return () => window.removeEventListener('sriwedari_db_updated', handleUpdate);
  }, []);

  const totalSpectators = tickets.reduce((acc, curr) => acc + (curr.quantity || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold gold-gradient-text">
            Rekap Kunjungan &amp; Tiket Pementasan
          </h1>
          <p className="text-xs text-canvas/70 mt-0.5">
            Daftar reservasi penonton Wayang Orang Sriwedari dan pagelaran tari keraton
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/visitor/daily"
            className="px-3.5 py-2 rounded-xl bg-brand-gold text-brand-green-dark font-semibold text-xs hover:brightness-110 transition flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">today</span>
            <span>Rekap Harian (Daily)</span>
          </Link>
          <Link
            href="/admin/pos"
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-brand-gold border border-brand-gold/30 font-semibold text-xs transition flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
            <span>Gate Scanner</span>
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#14382C]/80 border border-brand-gold/20">
          <span className="text-xs text-canvas/70 block mb-1">Total Reservasi Tiket</span>
          <span className="text-2xl font-bold text-white">{tickets.length} Transaksi</span>
          <span className="text-[10px] text-emerald-400 mt-1 block">Tersimpan di SriwedariDB</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#14382C]/80 border border-brand-gold/20">
          <span className="text-xs text-canvas/70 block mb-1">Estimasi Total Penonton</span>
          <span className="text-2xl font-bold text-brand-gold">{totalSpectators} Orang</span>
          <span className="text-[10px] text-brand-gold/80 mt-1 block">Seluruh jadwal pagelaran</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#14382C]/80 border border-brand-gold/20">
          <span className="text-xs text-canvas/70 block mb-1">Jadwal Lakon Aktif</span>
          <span className="text-2xl font-bold text-purple-300">{events.length} Agenda</span>
          <span className="text-[10px] text-purple-400 mt-1 block">GWO Sriwedari &amp; Pendopo</span>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="rounded-3xl bg-[#14382C]/80 border border-brand-gold/20 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-brand-gold/20">
          <h3 className="font-serif text-sm font-bold gold-gradient-text">
            Daftar Booking E-Tiket Penonton
          </h3>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-black/40 text-canvas/60 uppercase text-[10px] tracking-wider border-b border-brand-gold/20">
            <tr>
              <th className="py-3 px-4">Kode Booking</th>
              <th className="py-3 px-4">Penonton</th>
              <th className="py-3 px-4">Pagelaran</th>
              <th className="py-3 px-4">Zona / Kursi</th>
              <th className="py-3 px-4">Total Tagihan</th>
              <th className="py-3 px-4">Status Gerbang</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tickets.map((tck) => (
              <tr key={tck.id} className="hover:bg-white/5 transition">
                <td className="py-3 px-4 font-mono font-bold text-brand-gold">{tck.bookingCode}</td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-white block">{tck.userName}</span>
                  <span className="text-[10px] text-canvas/50">{tck.userPhone}</span>
                </td>
                <td className="py-3 px-4 text-canvas/80 max-w-xs truncate">{tck.eventTitle}</td>
                <td className="py-3 px-4">
                  <span className="font-medium text-white block">Zona {tck.zone}</span>
                  <span className="text-[10px] text-brand-gold font-mono">{tck.seats?.join(', ') || '-'}</span>
                </td>
                <td className="py-3 px-4 font-semibold text-emerald-400 price">{formatRupiah(tck.totalPrice)}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      tck.status === 'Check-in'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {tck.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
