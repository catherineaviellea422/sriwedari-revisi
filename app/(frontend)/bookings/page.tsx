'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SriwedariDB } from '@/lib/db';
import { CostumeItem, OrderItem } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { formatRupiah } from '@/lib/utils';
import ReviewSection from '@/components/reviews/ReviewSection';

function BookingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preCostumeId = searchParams.get('costumeId');
  const { user } = useAuth();

  const [costumes, setCostumes] = useState<CostumeItem[]>([]);
  const [selectedCostumeId, setSelectedCostumeId] = useState<string>(preCostumeId || 'costume-gandrung');
  const [durationDays, setDurationDays] = useState<number>(3);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  
  // Contact
  const [name, setName] = useState(user ? user.name : 'Oliv Satoro');
  const [phone, setPhone] = useState(user ? user.phone : '081234567890');
  const [email, setEmail] = useState(user ? user.email : 'oliv@example.com');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'VA' | 'Tunai'>('QRIS');

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean }>({ text: '', error: false });

  useEffect(() => {
    const list = SriwedariDB.getCostumes();
    setCostumes(list);
    if (preCostumeId && list.some(c => c.id === preCostumeId)) {
      setSelectedCostumeId(preCostumeId);
    }
  }, [preCostumeId]);

  const selectedCostume = costumes.find((c) => c.id === selectedCostumeId) || costumes[0];
  const costumePrice = selectedCostume ? selectedCostume.price : 250000;
  const depositFee = 100000;
  const subtotal = costumePrice * durationDays;
  const totalAfterDiscount = Math.max(0, subtotal - appliedDiscount) + depositFee;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    const res = SriwedariDB.validateCoupon(couponCode, subtotal);
    if (res.valid) {
      setAppliedDiscount(res.discount);
      setCouponMsg({ text: res.message, error: false });
    } else {
      setAppliedDiscount(0);
      setCouponMsg({ text: res.message, error: true });
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCostume) return;

    const newOrder = SriwedariDB.createOrder({
      userName: name,
      userPhone: phone,
      userEmail: email,
      costumeId: selectedCostume.id,
      costumeName: selectedCostume.name,
      costumes: [
        {
          id: selectedCostume.id,
          name: selectedCostume.name,
          price: selectedCostume.price,
          days: durationDays,
          size: selectedSize,
        },
      ],
      startDate,
      duration: durationDays,
      totalPrice: totalAfterDiscount,
      depositFee,
      discountAmount: appliedDiscount,
      couponCode: appliedDiscount > 0 ? couponCode.toUpperCase() : undefined,
      status: 'Menunggu',
      paymentMethod,
    });

    router.push(`/bookings/success?id=${newOrder.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-primary flex items-center gap-2">
          <span>Formulir Pemesanan &amp; Sewa Busana Adat</span>
        </h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Layanan reservasi busana pementasan budaya Keraton Surakarta dengan jaminan kurasi mutu
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="space-y-6">
        {/* Step 1: Pilih Busana */}
        <div className="p-5 sm:p-6 rounded-3xl bg-surface-container-low border border-divider shadow-sm space-y-4">
          <h2 className="font-serif text-base font-bold text-primary flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-green text-canvas flex items-center justify-center text-xs font-sans">1</span>
            <span>Pilihan Busana Panggung</span>
          </h2>

          <div className="space-y-3">
            <label className="block text-xs font-medium text-on-surface">Pilih Busana:</label>
            <select
              value={selectedCostumeId}
              onChange={(e) => setSelectedCostumeId(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-white border border-divider text-xs text-on-surface focus:outline-none focus:border-brand-gold"
            >
              {costumes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {formatRupiah(c.price)}/hari (Stok: {c.stock})
                </option>
              ))}
            </select>

            {selectedCostume && (
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-divider">
                <img
                  src={selectedCostume.image}
                  alt={selectedCostume.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-serif text-xs font-bold text-primary">{selectedCostume.name}</h4>
                  <p className="text-[11px] text-on-surface-variant line-clamp-1">{selectedCostume.description}</p>
                  <span className="text-xs font-bold text-brand-green mt-1 block">
                    {formatRupiah(selectedCostume.price)} <span className="text-[10px] font-normal text-on-surface-variant">/ hari</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2.5 pt-2">
            <div>
              <label className="block text-xs font-medium text-on-surface mb-1">Durasi Sewa:</label>
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl bg-white border border-divider text-xs text-on-surface"
              >
                <option value={1}>1 Hari (Pentas Kilat)</option>
                <option value={2}>2 Hari</option>
                <option value={3}>3 Hari (Standar)</option>
                <option value={7}>7 Hari (Festival)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-on-surface mb-1">Ukuran Busana:</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white border border-divider text-xs text-on-surface"
              >
                {selectedCostume?.sizes.map((s) => (
                  <option key={s} value={s}>
                    Ukuran {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-on-surface mb-1">Mulai Tanggal:</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white border border-divider text-xs text-on-surface"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Data Pemesan */}
        <div className="p-5 sm:p-6 rounded-3xl bg-surface-container-low border border-divider shadow-sm space-y-4">
          <h2 className="font-serif text-base font-bold text-primary flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-green text-canvas flex items-center justify-center text-xs font-sans">2</span>
            <span>Identitas Pemesan</span>
          </h2>

          <div className="grid grid-cols-1 gap-2.5">
            <div>
              <label className="block text-xs font-medium text-on-surface mb-1">Nama Lengkap / Sanggar:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="misal: Oliv Satoro"
                className="w-full h-10 px-3 rounded-xl bg-white border border-divider text-xs text-on-surface"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-on-surface mb-1">Nomor WhatsApp Aktif:</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="misal: 081234567890"
                className="w-full h-10 px-3 rounded-xl bg-white border border-divider text-xs text-on-surface"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-on-surface mb-1">Email Konfirmasi:</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="misal: oliv@example.com"
              className="w-full h-10 px-3 rounded-xl bg-white border border-divider text-xs text-on-surface"
            />
          </div>
        </div>

        {/* Step 3: Kupon & Rincian Biaya */}
        <div className="p-5 sm:p-6 rounded-3xl bg-surface-container-low border border-divider shadow-sm space-y-4">
          <h2 className="font-serif text-base font-bold text-primary flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-brand-green text-canvas flex items-center justify-center text-xs font-sans">3</span>
            <span>Kupon Promo &amp; Rincian Finansial</span>
          </h2>

          {/* Kupon Input */}
          <div>
            <label className="block text-xs font-medium text-on-surface mb-1">Kode Voucher Diskon Budaya:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Contoh: SRIWEDARI10, HEMATBUDAYA"
                className="flex-1 h-10 px-3 rounded-xl bg-white border border-divider text-xs text-on-surface uppercase tracking-wider"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="px-4 h-10 rounded-xl bg-brand-gold text-brand-green-dark font-semibold text-xs hover:brightness-110 transition"
              >
                Terapkan
              </button>
            </div>
            {couponMsg.text && (
              <p className={`text-[11px] mt-1.5 ${couponMsg.error ? 'text-red-600' : 'text-emerald-700 font-medium'}`}>
                {couponMsg.text}
              </p>
            )}
          </div>

          {/* Breakdown Table */}
          <div className="p-4 rounded-2xl bg-white border border-divider space-y-2 text-xs">
            <div className="flex justify-between text-on-surface-variant">
              <span>Biaya Sewa ({formatRupiah(costumePrice)} × {durationDays} hari)</span>
              <span className="font-medium text-primary price">{formatRupiah(subtotal)}</span>
            </div>
            {appliedDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Potongan Kupon ({couponCode})</span>
                <span className="price">- {formatRupiah(appliedDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-on-surface-variant">
              <span>Deposit Jaminan Keamanan (Dicairkan Saat Kembali)</span>
              <span className="font-medium text-primary price">{formatRupiah(depositFee)}</span>
            </div>
            <div className="pt-2 border-t border-divider flex justify-between font-bold text-sm text-brand-green">
              <span>Total Pembayaran</span>
              <span className="price">{formatRupiah(totalAfterDiscount)}</span>
            </div>
          </div>

          {/* Metode Bayar */}
          <div>
            <label className="block text-xs font-medium text-on-surface mb-2">Pilih Saluran Pembayaran:</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['QRIS', 'VA', 'Tunai'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-semibold transition text-center ${
                    paymentMethod === method
                      ? 'bg-brand-green text-canvas border-brand-green shadow-sm'
                      : 'bg-white text-on-surface border-divider hover:border-brand-gold'
                  }`}
                >
                  {method === 'QRIS' ? 'QRIS' : method === 'VA' ? 'BCA VA' : 'Loket Tunai'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-12 bg-brand-gold hover:bg-yellow-500 text-brand-green-dark font-bold text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2"
        >
          <span>Konfirmasi &amp; Kirim Pesanan Sewa</span>
          <span className="material-symbols-outlined text-lg">check_circle</span>
        </button>
      </form>

      {/* Costume Review & Ratings Section */}
      {selectedCostume && (
        <ReviewSection
          targetId={selectedCostume.id}
          targetType="costume"
          targetTitle={selectedCostume.name}
        />
      )}
    </div>
  );
}

export default function BookingsRentalPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-on-surface-variant">Memuat formulir pemesanan...</div>}>
      <BookingsContent />
    </Suspense>
  );
}
