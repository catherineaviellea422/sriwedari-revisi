'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setError('Silakan masukkan alamat email atau username Anda.');
      return;
    }

    if (!cleanPassword) {
      setError('Silakan masukkan kata sandi Anda.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(cleanEmail, cleanPassword, activeTab);

      if (result.success && result.user) {
        if (result.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(result.error || 'Email atau kata sandi tidak sesuai.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#14382C]/90 backdrop-blur-xl border border-brand-gold/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
      {/* Header Branding */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-brand-green border border-brand-gold/50 flex items-center justify-center text-brand-gold shadow-md mb-3">
          <span className="material-symbols-outlined text-3xl">temple_buddhist</span>
        </div>
        <h1 className="font-serif text-2xl font-bold gold-gradient-text tracking-wide">
          GALERI SRIWEDARI
        </h1>
        <p className="text-xs text-canvas/70 mt-1 max-w-xs">
          Gerbang Masuk Eksplorasi Seni Tradisi &amp; Busana Pusaka Keraton Surakarta
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="flex bg-black/40 p-1 rounded-xl border border-brand-gold/20 mb-6">
        <button
          type="button"
          onClick={() => {
            setActiveTab('user');
            setError('');
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'user'
              ? 'bg-brand-gold text-brand-green-dark shadow-sm'
              : 'text-canvas/60 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-base">person</span>
          <span>Pengguna / Tamu</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('admin');
            setError('');
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'admin'
              ? 'bg-brand-gold text-brand-green-dark shadow-sm'
              : 'text-canvas/60 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-base">shield_person</span>
          <span>Kurator / Admin</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-red-400 shrink-0">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-canvas/80 mb-1.5">
            {activeTab === 'admin' ? 'Email Staf / Kurator' : 'Alamat Email Terdaftar'}
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-3 text-brand-gold/60 text-lg">
              {activeTab === 'admin' ? 'admin_panel_settings' : 'mail'}
            </span>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                activeTab === 'admin' ? 'admin@galerisriwedari.id' : 'nama@example.com'
              }
              className="w-full h-11 pl-11 pr-4 bg-black/30 border border-brand-gold/20 rounded-xl text-xs text-white placeholder-canvas/30 focus:outline-none focus:border-brand-gold transition"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-canvas/80">Kata Sandi</label>
            <Link
              href="/auth/forgot-password"
              className="text-[11px] text-brand-gold/80 hover:text-brand-gold transition"
            >
              Lupa sandi?
            </Link>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-3 text-brand-gold/60 text-lg">
              lock
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi akun"
              className="w-full h-11 pl-11 pr-4 bg-black/30 border border-brand-gold/20 rounded-xl text-xs text-white placeholder-canvas/30 focus:outline-none focus:border-brand-gold transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-brand-gold hover:bg-yellow-500 disabled:opacity-50 text-brand-green-dark font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 mt-2"
        >
          {isSubmitting ? (
            <span>Memverifikasi kredensial...</span>
          ) : (
            <>
              <span>Masuk Sekarang</span>
              <span className="material-symbols-outlined text-base">login</span>
            </>
          )}
        </button>
      </form>

      {/* Register Link */}
      <div className="mt-6 pt-5 border-t border-brand-gold/15 text-center">
        <span className="text-canvas/60 text-xs">Belum memiliki akun terdaftar? </span>
        <Link
          href="/auth/register"
          className="text-brand-gold font-semibold hover:underline text-xs inline-flex items-center gap-0.5 ml-1"
        >
          <span>Daftar Akun Baru</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>

      {/* Footer Navigation */}
      <div className="mt-5 text-center flex items-center justify-center gap-4 text-xs text-canvas/60">
        <Link href="/about" className="hover:text-brand-gold transition">
          Tentang Kami
        </Link>
        <span>•</span>
        <Link href="/blog" className="hover:text-brand-gold transition">
          Artikel Budaya
        </Link>
      </div>
    </div>
  );
}
