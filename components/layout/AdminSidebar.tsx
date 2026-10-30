'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const menu = [
    { label: 'Dashboard Analitik', href: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Kelola Pengguna', href: '/admin/account', icon: 'manage_accounts' },
    { label: 'Rekap Kunjungan', href: '/admin/visitor', icon: 'supervised_user_circle' },
    { label: 'Kunjungan Harian', href: '/admin/visitor/daily', icon: 'today' },
    { label: 'Pesanan & QC Sewa', href: '/admin/bookings', icon: 'receipt_long' },
    { label: 'Koleksi Galeri Seni', href: '/admin/collection', icon: 'photo_library' },
    { label: 'Jadwal Pentas (Events)', href: '/admin/events', icon: 'theater_comedy' },
    { label: 'Kasir Loket (POS)', href: '/admin/pos', icon: 'point_of_sale' },
    { label: 'Kupon Diskon', href: '/admin/coupons', icon: 'loyalty' },
    { label: 'Audit Trail Keamanan', href: '/admin/audit', icon: 'security' },
    { label: 'Pengaturan & Reset DB', href: '/admin/settings', icon: 'settings' },
    { label: 'Dokumentasi Alur', href: '/admin/docs', icon: 'description' },
  ];

  return (
    <aside className="w-64 bg-brand-green-dark border-r border-brand-gold/20 flex flex-col shrink-0 text-canvas">
      {/* Branding */}
      <div className="h-16 px-5 border-b border-brand-gold/20 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand-green border border-brand-gold/40 flex items-center justify-center text-brand-gold shadow-md">
          <span className="material-symbols-outlined text-2xl">temple_buddhist</span>
        </div>
        <div>
          <span className="font-serif text-sm font-bold gold-gradient-text tracking-wider block">
            SRIWEDARI ADMIN
          </span>
          <span className="text-[10px] text-canvas/60">Panel Operasional Kurator</span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menu.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-brand-gold text-brand-green-dark font-semibold shadow-sm'
                  : 'text-canvas/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer shortcut */}
      <div className="p-3 border-t border-brand-gold/20 space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-brand-gold text-xs font-semibold transition"
        >
          <span className="material-symbols-outlined text-sm">open_in_new</span>
          <span>Buka Web App Pengguna</span>
        </Link>
        <Link
          href="/auth/logout"
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-300 text-xs font-medium transition"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          <span>Keluar Sesi</span>
        </Link>
      </div>
    </aside>
  );
}
