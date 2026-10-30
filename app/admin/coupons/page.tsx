'use client';

import React, { useEffect, useState } from 'react';
import { SriwedariDB } from '@/lib/db';
import { CouponItem } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';
import { X } from 'lucide-react';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [showModal, setShowModal] = useState(false);

  // New Coupon Form
  const [code, setCode] = useState('');
  const [type, setType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [value, setValue] = useState<number>(10);
  const [minOrder, setMinOrder] = useState<number>(200000);
  const [maxUses, setMaxUses] = useState<number>(100);
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadCoupons();
    const handleUpdate = () => loadCoupons();
    window.addEventListener('sriwedari_db_updated', handleUpdate);
    return () => window.removeEventListener('sriwedari_db_updated', handleUpdate);
  }, []);

  const loadCoupons = () => {
    setCoupons(SriwedariDB.getCoupons());
  };

  const handleToggleStatus = (c: CouponItem) => {
    SriwedariDB.saveCoupon({ ...c, isActive: !c.isActive });
    loadCoupons();
  };

  const handleDeleteCoupon = (id: string) => {
    if (confirm('Yakin ingin menghapus kupon promo ini?')) {
      SriwedariDB.deleteCoupon(id);
      loadCoupons();
    }
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const newCoupon: CouponItem = {
      id: 'coup-' + Date.now(),
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      minOrder: Number(minOrder),
      maxUses: Number(maxUses),
      usedCount: 0,
      isActive: true,
      expiresAt: '2026-12-31',
      description,
    };
    SriwedariDB.saveCoupon(newCoupon);
    setShowModal(false);
    setCode('');
    setDescription('');
    loadCoupons();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold gold-gradient-text">
            Manajemen Kupon Promo Budaya
          </h1>
          <p className="text-xs text-canvas/70 mt-0.5">
            Pengaturan kode voucher potongan harga untuk sanggar seni dan penyewa busana adat
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-brand-gold text-brand-green-dark font-semibold text-xs hover:brightness-110 transition flex items-center gap-1.5 shadow-md"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span>Buat Kupon Baru</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl bg-[#14382C]/80 border border-brand-gold/20 flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-base text-brand-gold tracking-wider">
                  {c.code}
                </span>
                <button
                  onClick={() => handleToggleStatus(c)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border transition ${
                    c.isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border-red-500/40'
                  }`}
                >
                  {c.isActive ? 'Aktif' : 'Nonaktif'}
                </button>
              </div>

              <div className="text-xs text-white font-semibold mt-1">
                {c.type === 'PERCENTAGE' ? `Diskon ${c.value}%` : `Potongan ${formatRupiah(c.value)}`}
              </div>
              <p className="text-[11px] text-canvas/70 mt-1 line-clamp-2">{c.description}</p>
            </div>

            <div className="pt-3 border-t border-brand-gold/15 text-[11px] text-canvas/60 space-y-1">
              <div className="flex justify-between">
                <span>Min. Belanja:</span>
                <span className="text-white font-medium price">{formatRupiah(c.minOrder)}</span>
              </div>
              <div className="flex justify-between">
                <span>Klaim Terpakai:</span>
                <span className="text-brand-gold font-mono">{c.usedCount} / {c.maxUses}</span>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleDeleteCoupon(c.id)}
                  className="text-red-400 hover:text-red-300 text-xs flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-xs">delete</span>
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Create Coupon */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14382C] border border-brand-gold/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-canvas">
            <button
              aria-label="Tutup"
              onClick={() => setShowModal(false)}
              className="flex items-center justify-center absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 text-canvas hover:text-white"
            >
              <X className="w-4 h-4" strokeWidth={2.25} aria-hidden="true" />
            </button>

            <h3 className="font-serif text-lg font-bold gold-gradient-text">
              Buat Kupon Promo Budaya
            </h3>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block text-canvas/80 mb-1">Kode Voucher:</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="misal: FESTIVAL50"
                  className="w-full h-10 px-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white uppercase tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-canvas/80 mb-1">Tipe Kupon:</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
                  >
                    <option value="PERCENTAGE">Persentase (%)</option>
                    <option value="FIXED">Potongan Tetap (Rp)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-canvas/80 mb-1">Nilai Diskon:</label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-canvas/80 mb-1">Min. Transaksi:</label>
                  <input
                    type="number"
                    required
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-canvas/80 mb-1">Maksimal Klaim:</label>
                  <input
                    type="number"
                    required
                    value={maxUses}
                    onChange={(e) => setMaxUses(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-canvas/80 mb-1">Deskripsi Singkat:</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Diskon khusus sanggar tari pementasan..."
                  className="w-full h-10 px-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 h-10 bg-brand-gold text-brand-green-dark font-bold text-xs rounded-xl shadow-md hover:brightness-110"
                >
                  Simpan Kupon
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 h-10 bg-black/40 border border-brand-gold/20 text-canvas rounded-xl text-xs"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
