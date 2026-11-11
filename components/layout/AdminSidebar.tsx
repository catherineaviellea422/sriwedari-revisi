'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const navigationGroups = [
    {
      title: 'Operasional',
      items: [
        { label: 'Dashboard Analitik', href: '/admin/dashboard', icon: 'dashboard' },
        { label: 'Pesanan & QC Sewa', href: '/admin/bookings', icon: 'receipt_long' },
        { label: 'Kasir POS & Gate Scanner', href: '/admin/pos', icon: 'qr_code_scanner', highlight: 'Loket' },
        { label: 'Rekap Pengunjung', href: '/admin/visitor', icon: 'supervised_user_circle' },
      ],
    },
    {
      title: 'Katalog & Pentas',
      items: [
        { label: 'Koleksi Galeri Seni', href: '/admin/collection', icon: 'photo_library' },
        { label: 'Jadwal Pentas Wayang', href: '/admin/events', icon: 'theater_comedy' },
        { label: 'Kupon Diskon', href: '/admin/coupons', icon: 'loyalty' },
        { label: 'Moderasi Ulasan', href: '/admin/reviews', icon: 'rate_review' },
      ],
    },
    {
      title: 'Sistem & Pengawasan',
      items: [
        { label: 'Kelola Pengguna', href: '/admin/account', icon: 'manage_accounts' },
        { label: 'Audit Trail Keamanan', href: '/admin/audit', icon: 'security' },
        { label: 'Pengaturan Sanggar', href: '/admin/settings', icon: 'settings' },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static top-0 bottom-0 left-0 w-64 bg-brand-green-dark border-r border-brand-gold/20 flex flex-col shrink-0 text-canvas z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Branding Header */}
        <div className="h-16 px-4 border-b border-brand-gold/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-brand-green border border-brand-gold/40 flex items-center justify-center text-brand-gold shadow-md shrink-0">
              <span className="material-symbols-outlined text-xl">temple_buddhist</span>
            </div>
            <div className="min-w-0">
              <span className="font-serif text-sm font-bold gold-gradient-text tracking-wider block leading-none truncate">
                SRIWEDARI ADMIN
              </span>
              <span className="text-[10px] text-canvas/60 block mt-1">Panel Kurator Keraton</span>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          <button
            onClick={onClose}
            className="md:hidden w-8 h-8 rounded-lg text-canvas/60 hover:text-white flex items-center justify-center hover:bg-white/10"
            aria-label="Tutup Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Grouped Nav List */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {navigationGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold/70 px-2.5 block">
                {group.title}
              </span>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                        isActive
                          ? 'bg-brand-gold text-brand-green-dark font-semibold shadow-sm'
                          : 'text-canvas/75 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="material-symbols-outlined text-lg shrink-0">
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.highlight && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                            isActive
                              ? 'bg-brand-green-dark text-brand-gold'
                              : 'bg-brand-gold/20 text-brand-gold'
                          }`}
                        >
                          {item.highlight}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Quick Links */}
        <div className="p-3 border-t border-brand-gold/20 space-y-2 bg-[#102c22]">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-brand-gold text-xs font-semibold transition"
          >
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            <span>Web App Pengunjung</span>
          </Link>
          <Link
            href="/auth/logout"
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-300 text-xs font-medium transition"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>Keluar Sesi</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
