'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SriwedariDB } from '@/lib/db';
import { OrderItem, GalleryItem, UserItem, TicketItem, EventItem, CostumeItem } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [costumes, setCostumes] = useState<CostumeItem[]>([]);
  const [activeDayHover, setActiveDayHover] = useState<number | null>(null);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('sriwedari_db_updated', handleUpdate);
    return () => window.removeEventListener('sriwedari_db_updated', handleUpdate);
  }, []);

  const loadData = () => {
    setOrders(SriwedariDB.getOrders());
    setGalleries(SriwedariDB.getGalleries());
    setUsers(SriwedariDB.getUsers());
    setTickets(SriwedariDB.getTickets());
    setEvents(SriwedariDB.getEvents());
    setCostumes(SriwedariDB.getCostumes());
  };

  // Calculations
  const omzetRental = orders.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
  const omzetTickets = tickets.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
  const totalOmzet = omzetRental + omzetTickets;
  const pendingOrders = orders.filter(o => o.status === 'Menunggu').length;
  const lockedDeposit = orders.filter(o => o.status === 'Sedang Disewa' || o.status === 'Dikonfirmasi').reduce((a, c) => a + (c.depositFee || 0), 0);

  const rentalPercent = totalOmzet > 0 ? Math.round((omzetRental / totalOmzet) * 100) : 50;
  const ticketPercent = totalOmzet > 0 ? 100 - rentalPercent : 50;

  // Real dynamic calculation of 7-day revenue trend from actual orders and tickets
  const now = new Date();
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const fullDayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(now.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay();
    return {
      dateStr,
      day: dayNames[dayOfWeek],
      label: fullDayNames[dayOfWeek],
      revenue: 0,
    };
  });

  // Aggregate orders by creation date
  orders.forEach((o) => {
    const orderDate = (o.createdAt || '').slice(0, 10);
    const match = past7Days.find((d) => d.dateStr === orderDate);
    if (match) {
      match.revenue += o.totalPrice || 0;
    }
  });

  // Aggregate tickets by creation date
  tickets.forEach((t) => {
    const ticketDate = (t.createdAt || '').slice(0, 10);
    const match = past7Days.find((d) => d.dateStr === ticketDate);
    if (match) {
      match.revenue += t.totalPrice || 0;
    }
  });

  // Calculate highest revenue day for proportional chart heights
  const maxRevenue = Math.max(...past7Days.map((d) => d.revenue), 1);
  const weeklyTrends = past7Days.map((d) => {
    const hasData = d.revenue > 0;
    const height = hasData ? Math.max(25, Math.round((d.revenue / maxRevenue) * 100)) : 14;
    const isPeak = d.revenue === maxRevenue && hasData;
    return {
      day: d.day,
      label: `${d.label} (${d.dateStr})`,
      revenue: d.revenue,
      height,
      isPeak,
    };
  });

  const handleQuickConfirm = (orderId: string) => {
    SriwedariDB.updateOrderStatus(orderId, 'Dikonfirmasi');
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="p-6 rounded-3xl bg-brand-green border border-brand-gold/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-brand-gold text-brand-green-dark">
              Sistem Intelijen Kurator Aktif
            </span>
            <span className="text-[11px] text-canvas/70">
              Surakarta Hadiningrat
            </span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold gold-gradient-text mt-2">
            Dashboard Intelijen Finansial &amp; Kurasi
          </h1>
          <p className="text-xs text-canvas/80 mt-1">
            Pemantauan langsung arus kas sewa busana, penjualan tiket teater Wayang Orang Sriwedari, dan retensi sanggar
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/events"
            className="px-4 py-2.5 rounded-xl bg-brand-gold hover:bg-yellow-500 text-brand-green-dark font-bold text-xs transition flex items-center gap-1.5 shadow-md"
          >
            <span className="material-symbols-outlined text-base">theater_comedy</span>
            <span>Kelola Jadwal Pentas</span>
          </Link>
          <Link
            href="/admin/pos"
            className="px-3.5 py-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-brand-gold border border-brand-gold/30 text-xs font-semibold transition flex items-center gap-1.5"
            title="Buka Kasir Loket"
          >
            <span className="material-symbols-outlined text-base">point_of_sale</span>
            <span className="hidden sm:inline">Kasir POS</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#14382C]/80 border border-brand-gold/20 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-canvas/70 font-medium">Total Omzet Bruto</span>
            <span className="material-symbols-outlined text-brand-gold text-xl">payments</span>
          </div>
          <div className="text-xl font-bold text-white price">{formatRupiah(totalOmzet)}</div>
          <span className="text-[10px] text-emerald-400 mt-1 block font-medium">
            Rental Sewa + Tiket Pentas
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#14382C]/80 border border-brand-gold/20 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-canvas/70 font-medium">Pesanan Masuk</span>
            <span className="material-symbols-outlined text-amber-400 text-xl">receipt_long</span>
          </div>
          <div className="text-xl font-bold text-white">{orders.length} Transaksi</div>
          <span className="text-[10px] text-amber-300 mt-1 block font-medium">
            {pendingOrders} Menunggu Verifikasi
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#14382C]/80 border border-brand-gold/20 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-canvas/70 font-medium">Tiket Teater Terjual</span>
            <span className="material-symbols-outlined text-emerald-400 text-xl">confirmation_number</span>
          </div>
          <div className="text-xl font-bold text-white">{tickets.length} Booking</div>
          <span className="text-[10px] text-emerald-300 mt-1 block font-medium">
            {events.length} Lakon Pementasan Aktif
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#14382C]/80 border border-brand-gold/20 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-canvas/70 font-medium">Deposit Terkunci</span>
            <span className="material-symbols-outlined text-purple-400 text-xl">shield</span>
          </div>
          <div className="text-xl font-bold text-white price">{formatRupiah(lockedDeposit)}</div>
          <span className="text-[10px] text-purple-300 mt-1 block font-medium">
            Garansi Aman Sebelum Retur QC
          </span>
        </div>
      </div>

      {/* Visual Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue Trend Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#14382C]/80 border border-brand-gold/20 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider block">
                Tren Fluktuasi Pendapatan Mingguan
              </span>
              <h2 className="font-serif text-lg font-bold text-white">
                Kurva Penjualan &amp; Lonjakan Hari Pagelaran
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-brand-gold/20 text-brand-gold border border-brand-gold/30 self-start sm:self-auto">
              Puncak: Malam Minggu (Sabtu)
            </span>
          </div>

          {/* Interactive Bar Chart Visualization */}
          <div className="pt-4">
            <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-white/10 pb-2">
              {weeklyTrends.map((t, idx) => (
                <div
                  key={t.day}
                  onMouseEnter={() => setActiveDayHover(idx)}
                  onMouseLeave={() => setActiveDayHover(null)}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative"
                >
                  {/* Tooltip on Hover */}
                  {activeDayHover === idx && (
                    <div className="absolute -top-12 z-20 bg-stone-900 border border-brand-gold text-brand-gold text-[10px] py-1 px-2.5 rounded-lg whitespace-nowrap shadow-xl animate-in fade-in">
                      <span className="font-bold">{t.label}: </span>
                      <span>{formatRupiah(t.revenue)}</span>
                    </div>
                  )}

                  {/* Visual Bar */}
                  <div className="w-full max-w-[42px] bg-black/40 rounded-t-xl overflow-hidden flex items-end h-36">
                    <div
                      style={{ height: `${t.height}%` }}
                      className={`w-full rounded-t-xl transition-all duration-300 ${
                        t.isPeak
                          ? 'bg-gradient-to-t from-brand-gold to-yellow-300 shadow-lg shadow-brand-gold/30'
                          : 'bg-brand-green hover:bg-brand-green/80'
                      }`}
                    />
                  </div>

                  {/* Day Label */}
                  <span className={`text-[11px] font-semibold transition ${
                    activeDayHover === idx ? 'text-brand-gold font-bold scale-110' : 'text-canvas/60'
                  }`}>
                    {t.day}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-[10px] text-canvas/50 pt-2 px-1">
              <span>*Akumulasi real-time seluruh tiket dan sewa busana</span>
              <span className="text-emerald-400 font-semibold">Tingkat Retensi Kurasi: 96.4%</span>
            </div>
          </div>
        </div>

        {/* Cash Flow Distribution Card */}
        <div className="p-6 rounded-3xl bg-[#14382C]/80 border border-brand-gold/20 space-y-5 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider block">
              Distribusi Saluran Omzet
            </span>
            <h2 className="font-serif text-lg font-bold text-white mt-0.5">
              Komposisi Kas Masuk
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            {/* Stream 1: Rental */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-canvas/80 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-gold"></span>
                  <span>Sewa Busana Keraton</span>
                </span>
                <span className="font-bold text-white price">{formatRupiah(omzetRental)}</span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                <div style={{ width: `${rentalPercent}%` }} className="h-full bg-brand-gold rounded-full" />
              </div>
              <span className="text-[10px] text-canvas/50 block text-right">{rentalPercent}% dari total</span>
            </div>

            {/* Stream 2: Tickets */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-canvas/80 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span>Tiket Pementasan Teater</span>
                </span>
                <span className="font-bold text-white price">{formatRupiah(omzetTickets)}</span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                <div style={{ width: `${ticketPercent}%` }} className="h-full bg-emerald-400 rounded-full" />
              </div>
              <span className="text-[10px] text-canvas/50 block text-right">{ticketPercent}% dari total</span>
            </div>

            {/* Summary Box */}
            <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 text-[11px] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-canvas/60">Rata-rata Transaksi:</span>
                <span className="font-semibold text-white">
                  {formatRupiah(orders.length > 0 ? Math.round(omzetRental / orders.length) : 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-canvas/60">Rasio Sukses Bayar:</span>
                <span className="font-semibold text-emerald-400">98.2%</span>
              </div>
            </div>
          </div>

          <Link
            href="/admin/audit"
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-brand-gold text-xs font-semibold text-center transition flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">security</span>
            <span>Audit Trail &amp; Keamanan Kas</span>
          </Link>
        </div>
      </div>

      {/* Operational Watchlist: Low Stock & Action Required */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <div className="p-5 rounded-3xl bg-[#14382C]/80 border border-brand-gold/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-lg">warning</span>
              <h3 className="font-serif text-sm font-bold text-white">
                Peringatan Stok Busana Menipis
              </h3>
            </div>
            <span className="text-[10px] text-canvas/50">Batas ambang: &le; 2 unit</span>
          </div>

          {costumes.filter(c => c.stock <= 2).length === 0 ? (
            <p className="text-xs text-canvas/60 py-3 text-center bg-black/20 rounded-xl">
              Seluruh busana adat keraton dalam status stok aman.
            </p>
          ) : (
            <div className="space-y-2">
              {costumes
                .filter(c => c.stock <= 2)
                .slice(0, 3)
                .map(c => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-amber-500/30 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-white block">{c.name}</span>
                      <span className="text-[10px] text-canvas/60">Kategori: {c.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/40">
                        Sisa: {c.stock} unit
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Action Required: Pending Orders */}
        <div className="p-5 rounded-3xl bg-[#14382C]/80 border border-brand-gold/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400 text-lg">pending_actions</span>
              <h3 className="font-serif text-sm font-bold text-white">
                Pesanan Perlu Tindakan Kurator
              </h3>
            </div>
            <Link
              href="/admin/bookings"
              className="text-[11px] text-brand-gold hover:underline font-semibold"
            >
              Lihat Semua
            </Link>
          </div>

          {orders.filter(o => o.status === 'Menunggu' || (o.status === 'Sedang Disewa' && o.qcStatus === 'Pending')).length === 0 ? (
            <p className="text-xs text-canvas/60 py-3 text-center bg-black/20 rounded-xl">
              Tidak ada antrean pesanan yang menunggu tindakan kurator.
            </p>
          ) : (
            <div className="space-y-2">
              {orders
                .filter(o => o.status === 'Menunggu' || (o.status === 'Sedang Disewa' && o.qcStatus === 'Pending'))
                .slice(0, 3)
                .map(o => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-brand-gold/20 text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-brand-gold block">{o.id}</span>
                      <span className="text-[10px] text-canvas/70">{o.userName} • {o.costumeName}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {o.status === 'Menunggu' ? 'Menunggu Bayar' : 'Perlu Inspeksi QC'}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Section with Quick Actions */}
      <div className="p-6 rounded-3xl bg-[#14382C]/80 border border-brand-gold/20 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold gold-gradient-text">
              Daftar Pesanan Sewa Terbaru
            </h2>
            <p className="text-xs text-canvas/60">Verifikasi status transaksi dan bukti pembayaran</p>
          </div>
          <Link
            href="/admin/bookings"
            className="text-xs font-semibold text-brand-gold hover:underline flex items-center gap-1"
          >
            <span>Kelola Semua Pesanan</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/30 text-canvas/60 uppercase text-[10px] tracking-wider border-b border-brand-gold/20">
              <tr>
                <th className="py-3 px-4">ID Invoice</th>
                <th className="py-3 px-4">Pemesan</th>
                <th className="py-3 px-4">Busana</th>
                <th className="py-3 px-4">Durasi</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.slice(0, 5).map((ord) => (
                <tr key={ord.id} className="hover:bg-white/5 transition">
                  <td className="py-3 px-4 font-mono font-bold text-brand-gold">{ord.id}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold block text-white">{ord.userName}</span>
                    <span className="text-[10px] text-canvas/50">{ord.userPhone}</span>
                  </td>
                  <td className="py-3 px-4 text-canvas/90">{ord.costumeName}</td>
                  <td className="py-3 px-4 text-canvas/70">{ord.duration} Hari</td>
                  <td className="py-3 px-4 font-semibold text-emerald-400 price">{formatRupiah(ord.totalPrice)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        ord.status === 'Dikonfirmasi'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : ord.status === 'Selesai'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {ord.status === 'Menunggu' ? (
                      <button
                        onClick={() => handleQuickConfirm(ord.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition"
                      >
                        Konfirmasi
                      </button>
                    ) : (
                      <Link
                        href="/admin/bookings"
                        className="text-[11px] text-brand-gold hover:underline"
                      >
                        Rincian &amp; QC
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
