'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function LogoutPage() {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    const timer = setTimeout(() => {
      router.push('/auth/login');
    }, 1200);
    return () => clearTimeout(timer);
  }, [logout, router]);

  return (
    <div className="bg-[#14382C]/90 backdrop-blur-xl border border-brand-gold/30 rounded-3xl p-8 shadow-2xl text-center">
      <div className="w-14 h-14 rounded-2xl bg-brand-green border border-brand-gold/40 flex items-center justify-center text-brand-gold shadow-md mx-auto mb-4">
        <span className="material-symbols-outlined text-3xl">logout</span>
      </div>
      <h2 className="font-serif text-xl font-bold gold-gradient-text mb-2">
        Sesi Telah Diakhiri
      </h2>
      <p className="text-xs text-canvas/70">
        Matur nuwun telah berkunjung ke Galeri Sriwedari. Mengarahkan Anda kembali ke halaman masuk...
      </p>
    </div>
  );
}
