'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-[#14382C]/90 backdrop-blur-xl border border-brand-gold/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-brand-green border border-brand-gold/40 flex items-center justify-center text-brand-gold shadow-md mb-3">
          <span className="material-symbols-outlined text-2xl">lock_reset</span>
        </div>
        <h1 className="font-serif text-2xl font-bold gold-gradient-text tracking-wide">
          Pemulihan Sandi
        </h1>
        <p className="text-xs text-canvas/70 mt-1 max-w-xs">
          Masukkan email atau WhatsApp terdaftar Anda untuk menerima tautan instruksi pengaturan ulang kata sandi.
        </p>
      </div>

      {submitted ? (
        <div className="text-center space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs leading-relaxed">
            Tautan instruksi pemulihan telah dikirimkan ke <strong>{identifier}</strong>. Silakan periksa pesan masuk Anda.
          </div>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-1.5 w-full h-11 bg-brand-gold text-brand-green-dark font-semibold text-xs rounded-xl shadow-md transition"
          >
            <span>Kembali ke Halaman Masuk</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-canvas/80 mb-1.5">
              Email atau Nomor WhatsApp
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-3 text-brand-gold/60 text-lg">
                contact_mail
              </span>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="misal: oliv@example.com / 081234567890"
                className="w-full h-11 pl-11 pr-4 bg-black/30 border border-brand-gold/20 rounded-xl text-xs text-white placeholder-canvas/30 focus:outline-none focus:border-brand-gold transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 bg-brand-gold hover:bg-yellow-500 text-brand-green-dark font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <span>Kirim Instruksi Pemulihan</span>
            <span className="material-symbols-outlined text-base">send</span>
          </button>

          <div className="text-center pt-2">
            <Link
              href="/auth/login"
              className="text-xs text-brand-gold/80 hover:text-brand-gold transition inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Batalkan &amp; Kembali</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
