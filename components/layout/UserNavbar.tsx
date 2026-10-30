'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import UserSidebar from './UserSidebar';
import HeritageAudioPlayer from '@/components/ui/HeritageAudioPlayer';

export default function UserNavbar() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isAdmin = user?.role === 'admin';

  return (
    <>
      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <header className="relative w-full h-14 bg-brand-green-dark border-b border-brand-gold/20 pl-2 pr-3 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 rounded-xl hover:bg-white/10 active:scale-95 text-brand-gold flex items-center justify-center transition"
            aria-label="Buka menu navigasi"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>

          <Link href="/dashboard" className="min-w-0">
            <span className="font-serif text-[15px] font-bold gold-gradient-text tracking-wide block leading-none truncate">
              Galeri Sriwedari
            </span>
            <span className="text-[10px] tracking-wider uppercase text-canvas/50 block mt-1">
              Pusaka Seni Keraton
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <HeritageAudioPlayer />

          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className="w-9 h-9 rounded-full text-brand-gold/80 hover:text-brand-gold hover:bg-white/10 flex items-center justify-center transition"
              aria-label="Buka panel kurator"
              title="Panel Kurator"
            >
              <span className="material-symbols-outlined text-[20px]">shield_person</span>
            </Link>
          )}

          <Link
            href={user ? '/profile' : '/auth/login'}
            className="w-9 h-9 rounded-full bg-brand-gold text-brand-green-dark flex items-center justify-center font-bold text-sm ring-2 ring-brand-gold/25 hover:ring-brand-gold/60 transition"
            aria-label={user ? 'Buka profil' : 'Masuk akun'}
            title={user ? user.name : 'Masuk'}
          >
            {user ? user.name.charAt(0).toUpperCase() : (
              <span className="material-symbols-outlined text-[18px]">person</span>
            )}
          </Link>
        </div>
      </header>
    </>
  );
}
