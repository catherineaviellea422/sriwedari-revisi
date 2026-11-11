'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/layout/AdminSidebar';
import CommandPalette from '@/components/admin/CommandPalette';
import { useAuth } from '@/lib/auth-context';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Generate dynamic breadcrumb label
  const getBreadcrumbLabel = (path: string): string => {
    if (path === '/admin/dashboard') return 'Dashboard Ringkasan';
    if (path.startsWith('/admin/bookings')) return 'Pesanan & QC Sewa Busana';
    if (path.startsWith('/admin/pos')) return 'Kasir Loket & Gate Scanner';
    if (path.startsWith('/admin/visitor')) return 'Rekap Pengunjung & Tiket';
    if (path.startsWith('/admin/collection')) return 'Koleksi Galeri Seni';
    if (path.startsWith('/admin/events')) return 'Jadwal Pagelaran Wayang';
    if (path.startsWith('/admin/coupons')) return 'Kupon Diskon Budaya';
    if (path.startsWith('/admin/reviews')) return 'Moderasi Ulasan Pengunjung';
    if (path.startsWith('/admin/account')) return 'Kelola Pengguna & Staf';
    if (path.startsWith('/admin/audit')) return 'Audit Trail Keamanan';
    if (path.startsWith('/admin/settings')) return 'Pengaturan Operasional Sanggar';
    return 'Panel Kurator';
  };

  return (
    <div className="min-h-screen bg-[#0d1e18] text-canvas flex overflow-hidden">
      {/* Responsive Sidebar (Pinned on desktop, slide-over drawer on mobile/tablet) */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-[#14382C]/90 backdrop-blur-md border-b border-brand-gold/20 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger Button on Mobile */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-brand-gold flex items-center justify-center transition shrink-0"
              aria-label="Buka Menu Samping"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>

            {/* Breadcrumb Navigation */}
            <div className="hidden sm:flex items-center gap-2 text-xs min-w-0">
              <Link href="/admin/dashboard" className="text-canvas/60 hover:text-brand-gold transition truncate">
                Admin
              </Link>
              <span className="text-brand-gold/40">/</span>
              <span className="font-semibold text-brand-gold truncate">
                {getBreadcrumbLabel(pathname)}
              </span>
            </div>

            {/* Operational Status Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Loket Operasional Aktif</span>
            </div>

            <CommandPalette />
          </div>

          {/* Right Admin Profile & Quick Link */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admin/pos"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-gold text-brand-green-dark font-bold text-xs hover:brightness-110 transition shadow-sm"
              title="Buka Kasir POS & Gate Scanner"
            >
              <span className="material-symbols-outlined text-base">qr_code_scanner</span>
              <span>Scanner Gate</span>
            </Link>

            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-white block leading-tight">
                {user ? user.name : 'Kanjeng Kurator'}
              </span>
              <span className="text-[10px] text-brand-gold/80 block mt-0.5">
                {user?.role === 'admin' ? 'Staf Kurator Keraton' : 'Administrator'}
              </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-brand-gold text-brand-green-dark flex items-center justify-center font-bold text-xs ring-2 ring-brand-gold/25">
              {user ? user.name.charAt(0) : 'A'}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0d1e18] text-canvas">
          <div className="max-w-6xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
