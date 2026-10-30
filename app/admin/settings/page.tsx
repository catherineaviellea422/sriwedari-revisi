'use client';

import React, { useEffect, useState } from 'react';
import { SriwedariDB } from '@/lib/db';
import { SettingsItem } from '@/lib/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsItem>(SriwedariDB.getSettings());
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    setSettings(SriwedariDB.getSettings());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    SriwedariDB.saveSettings(settings);
    showToast('Pengaturan lembaga berhasil disimpan!');
  };

  const handleResetDB = () => {
    if (confirm('PERINGATAN: Apakah Anda yakin ingin mereset seluruh database Sriwedari ke data awal bawaan? Seluruh perubahan lokal akan dikembalikan.')) {
      SriwedariDB.resetDB();
      setSettings(SriwedariDB.getSettings());
      showToast('Database berhasil direset ke seed awal pementasan!');
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-brand-green-dark text-brand-gold px-4 py-2.5 rounded-xl border border-brand-gold/40 shadow-2xl text-xs flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold gold-gradient-text">
          Pengaturan Sistem &amp; Pemeliharaan Basis Data
        </h1>
        <p className="text-xs text-canvas/70 mt-0.5">
          Konfigurasi profil lembaga sanggar, deposit sewa busana, dan alat reset data pengujian
        </p>
      </div>

      {/* Form Settings */}
      <form onSubmit={handleSave} className="p-6 md:p-8 rounded-3xl bg-[#14382C]/80 border border-brand-gold/20 space-y-4 text-xs shadow-sm">
        <h2 className="font-serif text-base font-bold text-white">Profil Lembaga Budaya</h2>

        <div>
          <label className="block text-canvas/80 mb-1">Nama Galeri / Lembaga:</label>
          <input
            type="text"
            required
            value={settings.galleryName}
            onChange={(e) => setSettings({ ...settings, galleryName: e.target.value })}
            className="w-full h-10 px-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
          />
        </div>

        <div>
          <label className="block text-canvas/80 mb-1">Tagline Filosofis:</label>
          <input
            type="text"
            required
            value={settings.tagline}
            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            className="w-full h-10 px-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-canvas/80 mb-1">Jam Operasional:</label>
            <input
              type="text"
              required
              value={settings.openHours}
              onChange={(e) => setSettings({ ...settings, openHours: e.target.value })}
              className="w-full h-10 px-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
            />
          </div>
          <div>
            <label className="block text-canvas/80 mb-1">Nomor WhatsApp Staf:</label>
            <input
              type="text"
              required
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full h-10 px-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-canvas/80 mb-1">Alamat Gedung:</label>
          <input
            type="text"
            required
            value={settings.location}
            onChange={(e) => setSettings({ ...settings, location: e.target.value })}
            className="w-full h-10 px-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
          />
        </div>

        <div>
          <label className="block text-canvas/80 mb-1">Ketentuan Mutu &amp; Syarat Pengembalian:</label>
          <textarea
            rows={3}
            required
            value={settings.terms}
            onChange={(e) => setSettings({ ...settings, terms: e.target.value })}
            className="w-full p-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-6 h-11 bg-brand-gold text-brand-green-dark font-bold text-xs rounded-xl shadow-md hover:brightness-110 transition flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">save</span>
            <span>Simpan Konfigurasi Lembaga</span>
          </button>
        </div>
      </form>

      {/* Relocated Feature: Reset DB */}
      <div className="p-6 md:p-8 rounded-3xl bg-amber-950/40 border border-amber-500/30 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-xl">restart_alt</span>
              <h2 className="font-serif text-base font-bold text-amber-300">
                Reset Basis Data ke Kondisi Awal (Reset DB)
              </h2>
            </div>
            <p className="text-xs text-canvas/70 mt-1 max-w-lg leading-relaxed">
              Fitur ini sebelumnya berada di bilah atas emulator. Gunakan tombol ini untuk mengembalikan seluruh koleksi galeri, katalog busana keraton, transaksi, kupon, dan tiket ke seed awal pementasan bawaan.
            </p>
          </div>

          <button
            onClick={handleResetDB}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">restart_alt</span>
            <span>Reset DB Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
}
