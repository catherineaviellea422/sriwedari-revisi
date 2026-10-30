'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Role } from '@/lib/types';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [activeRole, setActiveRole] = useState<Role>('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    const cleanPassword = password.trim();

    if (!cleanName) {
      setError('Mohon isi nama lengkap atau nama sanggar Anda.');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Mohon masukkan alamat email yang valid.');
      return;
    }

    if (!cleanPhone) {
      setError('Mohon masukkan nomor WhatsApp / HP aktif Anda.');
      return;
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      setError('Kata sandi harus terdiri dari minimal 6 karakter.');
      return;
    }

    if (cleanPassword !== confirmPassword.trim()) {
      setError('Konfirmasi kata sandi tidak cocok. Silakan ketik ulang kata sandi Anda.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await register({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        password: cleanPassword,
        role: activeRole,
      });

      if (result.success && result.user) {
        if (result.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(result.error || 'Terjadi kesalahan saat pendaftaran akun.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#14382C]/90 backdrop-blur-xl border border-brand-gold/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-brand-green border border-brand-gold/40 flex items-center justify-center text-brand-gold shadow-md mb-3">
          <span className="material-symbols-outlined text-3xl">person_add</span>
        </div>
        <h1 className="font-serif text-2xl font-bold gold-gradient-text tracking-wide">
          Daftar Akun Baru
        </h1>
        <p className="text-xs text-canvas/70 mt-1 max-w-xs">
          Buat akun untuk mengakses reservasi tiket pementasan, sewa busana adat keraton, atau manajemen kurator
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="mb-5 space-y-1.5">
        <label className="block text-[11px] font-semibold text-canvas/70 uppercase tracking-wider">
          Pilih Peran Akun:
        </label>
        <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-xl border border-brand-gold/20">
          <button
            type="button"
            onClick={() => {
              setActiveRole('user');
              setError('');
            }}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeRole === 'user'
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
              setActiveRole('admin');
              setError('');
            }}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeRole === 'admin'
                ? 'bg-brand-gold text-brand-green-dark shadow-sm'
                : 'text-canvas/60 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">shield_person</span>
            <span>Kurator / Admin</span>
          </button>
        </div>
        <p className="text-[10px] text-canvas/50 px-1">
          {activeRole === 'user'
            ? 'Akun Pengguna: tampilan aplikasi mobile, reservasi tiket pentas, dan sewa busana keraton.'
            : 'Akun Kurator: tampilan dashboard desktop, manajemen pementasan, loket gate POS, dan analitik.'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-red-400 shrink-0">error</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
        <div>
          <label className="block text-canvas/80 mb-1 font-medium">Nama Lengkap / Sanggar:</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="misal: Raden Bagus Wicaksono"
            className="w-full h-10 px-3.5 rounded-xl bg-black/40 border border-brand-gold/20 text-white placeholder-canvas/30 focus:outline-none focus:border-brand-gold transition"
          />
        </div>

        <div>
          <label className="block text-canvas/80 mb-1 font-medium">Alamat Email:</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@example.com"
            className="w-full h-10 px-3.5 rounded-xl bg-black/40 border border-brand-gold/20 text-white placeholder-canvas/30 focus:outline-none focus:border-brand-gold transition"
          />
        </div>

        <div>
          <label className="block text-canvas/80 mb-1 font-medium">Nomor WhatsApp / HP:</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="081234567890"
            className="w-full h-10 px-3.5 rounded-xl bg-black/40 border border-brand-gold/20 text-white placeholder-canvas/30 focus:outline-none focus:border-brand-gold transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-canvas/80 mb-1 font-medium">Kata Sandi:</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full h-10 px-3.5 rounded-xl bg-black/40 border border-brand-gold/20 text-white placeholder-canvas/30 focus:outline-none focus:border-brand-gold transition"
            />
          </div>
          <div>
            <label className="block text-canvas/80 mb-1 font-medium">Ulangi Kata Sandi:</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ketik ulang kata sandi"
              className="w-full h-10 px-3.5 rounded-xl bg-black/40 border border-brand-gold/20 text-white placeholder-canvas/30 focus:outline-none focus:border-brand-gold transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-brand-gold hover:bg-yellow-500 disabled:opacity-50 text-brand-green-dark font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 mt-2"
        >
          {isSubmitting ? (
            <span>Mendaftarkan akun ke sistem...</span>
          ) : (
            <>
              <span>
                {activeRole === 'admin'
                  ? 'Daftar & Masuk ke Panel Admin'
                  : 'Daftar & Masuk ke Aplikasi Mobile'}
              </span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </>
          )}
        </button>

        <div className="text-center pt-3 border-t border-brand-gold/15">
          <span className="text-canvas/60 text-xs">Sudah memiliki akun terdaftar? </span>
          <Link
            href="/auth/login"
            className="text-brand-gold font-semibold hover:underline text-xs inline-flex items-center gap-0.5 ml-1"
          >
            <span>Masuk di sini</span>
            <span className="material-symbols-outlined text-sm">login</span>
          </Link>
        </div>
      </form>
    </div>
  );
}
