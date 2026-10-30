'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserSidebar({ isOpen, onClose }: UserSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    onClose();
    await logout();
    router.push('/auth/login');
  };

  const mainNav = [
    { label: 'Beranda Utama', href: '/dashboard', icon: 'home', badge: '' },
    { label: 'Koleksi Galeri Seni', href: '/collection', icon: 'photo_library', badge: '' },
    { label: 'Sewa Busana Keraton', href: '/collection/costumes', icon: 'checkroom', badge: 'Populer' },
    { label: 'Jadwal Pagelaran Wayang', href: '/visitors', icon: 'theater_comedy', badge: '' },
    { label: 'Pentas Hari Ini', href: '/visitors/today', icon: 'today', badge: 'Live' },
    { label: 'Pesanan & E-Tiket Saya', href: '/profile', icon: 'receipt_long', badge: '' },
  ];

  const heritageNav = [
    { label: 'Tentang Sriwedari', href: '/about', icon: 'info' },
    { label: 'Kronik Sejarah 1899', href: '/about/sejarah', icon: 'history_edu' },
    { label: 'Dewan Kurator & Maestro', href: '/about/kurator', icon: 'groups' },
    { label: 'Warta & Artikel Budaya', href: '/blog', icon: 'menu_book' },
  ];

  return (
    <>
      {/* Dimmed Overlay Scrim */}
      <div
        className={`fixed md:absolute inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Sidebar Drawer */}
      <aside
        className={`fixed md:absolute top-0 bottom-0 left-0 w-[300px] max-w-[85%] bg-[#0e241c] border-r border-brand-gold/30 text-canvas z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        }`}
      >
        {/* Drawer Header / Branding & Close Button */}
        <div className="p-4 border-b border-brand-gold/20 flex items-center justify-between bg-[#14382C]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-green border border-brand-gold/40 flex items-center justify-center text-brand-gold shadow-sm">
              <span className="material-symbols-outlined text-xl">temple_buddhist</span>
            </div>
            <div>
              <span className="font-serif text-sm font-bold gold-gradient-text tracking-wider block">
                GALERI SRIWEDARI
              </span>
              <span className="text-[10px] text-canvas/60">Aplikasi Pengunjung</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/10 text-brand-gold/80 hover:text-white flex items-center justify-center transition"
            title="Tutup Menu"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* User Profile Summary Card */}
        <div className="p-4 bg-gradient-to-br from-[#14382C] to-[#0e241c] border-b border-brand-gold/15">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-brand-gold text-brand-green-dark flex items-center justify-center font-bold text-base shadow-md ring-2 ring-brand-gold/40">
              {user ? user.name.charAt(0) : 'T'}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white truncate">
                {user ? user.name : 'Tamu Budaya Sriwedari'}
              </h4>
              <p className="text-[11px] text-brand-gold/80 truncate">
                {user ? user.email : 'Pengunjung Umum'}
              </p>
              <span className="inline-block px-2 py-0.5 mt-1 rounded-full text-[9px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                {user?.role === 'admin' ? 'Staf Kurator Keraton' : 'Akun Pengunjung'}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Nav Menu List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Main Navigation */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold/70 px-2.5 mb-1.5 block">
              Menu Utama
            </span>
            <div className="space-y-0.5">
              {mainNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
                      isActive
                        ? 'bg-brand-gold text-brand-green-dark font-semibold shadow-sm'
                        : 'text-canvas/80 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-brand-gold/15 text-brand-gold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Heritage & Education */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold/70 px-2.5 mb-1.5 block">
              Eksplorasi Budaya
            </span>
            <div className="space-y-0.5">
              {heritageNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-all ${
                      isActive
                        ? 'bg-brand-gold text-brand-green-dark font-semibold shadow-sm'
                        : 'text-canvas/80 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Curator panel shortcut (admin accounts only) */}
          {user?.role === 'admin' && (
            <div className="pt-1">
              <Link
                href="/admin/dashboard"
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-brand-gold/25 text-brand-gold hover:bg-white/5 font-semibold transition"
              >
                <span className="material-symbols-outlined text-lg">shield_person</span>
                <span className="flex-1">Panel Kurator</span>
                <span className="material-symbols-outlined text-base text-brand-gold/60">arrow_forward</span>
              </Link>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-brand-gold/20 bg-[#0e241c] space-y-2">
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-300 text-xs font-semibold transition"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              <span>Keluar Sesi</span>
            </button>
          ) : (
            <Link
              href="/auth/login"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-brand-gold text-brand-green-dark text-xs font-bold hover:brightness-110 transition"
            >
              <span className="material-symbols-outlined text-base">login</span>
              <span>Masuk Akun</span>
            </Link>
          )}

          <div className="text-center text-[10px] text-canvas/35 pt-1">
            Taman Sriwedari Surakarta
          </div>
        </div>
      </aside>
    </>
  );
}

