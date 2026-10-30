'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SriwedariDB } from '@/lib/db';
import { OrderItem } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const [order, setOrder] = useState<OrderItem | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  useEffect(() => {
    if (orderId) {
      const found = SriwedariDB.getOrderById(orderId);
      if (found) {
        setOrder(found);
        if (found.status === 'Dikonfirmasi' || found.status === 'Selesai') {
          setPaymentDone(true);
        }
      }
    }
  }, [orderId]);

  const handleSimulatePayment = async () => {
    if (!order) return;
    setIsSimulating(true);
    try {
      const res = await fetch('/api/payments/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          transactionStatus: 'settlement',
          paymentType: order.paymentMethod,
          grossAmount: order.totalPrice,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPaymentDone(true);
        SriwedariDB.updateOrderStatus(order.id, 'Dikonfirmasi');
        setOrder(prev => prev ? { ...prev, status: 'Dikonfirmasi' } : null);
      }
    } catch {}
    setIsSimulating(false);
  };

  return (
    <div className="max-w-md mx-auto text-center space-y-5 py-4">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md ${
        paymentDone ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
      }`}>
        <span className="material-symbols-outlined text-3xl">
          {paymentDone ? 'task_alt' : 'hourglass_top'}
        </span>
      </div>

      <div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          paymentDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
        }`}>
          {paymentDone ? 'Pembayaran Terverifikasi Lunas' : 'Menunggu Pelunasan Invoice'}
        </span>
        <h1 className="font-serif text-2xl font-bold text-primary mt-2">
          {paymentDone ? 'Pembayaran Berhasil Dikonfirmasi!' : 'Invoice Pesanan Diterbitkan'}
        </h1>
        <p className="text-xs text-on-surface-variant mt-1">
          {paymentDone
            ? 'Kurator telah menerima pelunasan. Busana adat Anda dijadwalkan untuk proses packing.'
            : 'Nomor invoice pesanan sewa busana Anda telah tercatat pada sistem kurator Sriwedari.'}
        </p>
      </div>

      {order && (
        <div className="p-5 rounded-3xl bg-surface-container-low border border-divider text-left space-y-3 text-xs shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b border-divider">
            <span className="text-on-surface-variant">ID Pesanan:</span>
            <span className="font-mono font-bold text-primary">{order.id}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant">Busana:</span>
            <span className="font-semibold text-primary">{order.costumeName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant">Durasi:</span>
            <span>{order.duration} Hari (Mulai {order.startDate})</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant">Deposit Jaminan:</span>
            <span className="price">{formatRupiah(order.depositFee)}</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-divider text-sm font-bold text-brand-green">
            <span>Total Tagihan:</span>
            <span className="price">{formatRupiah(order.totalPrice)}</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-divider flex items-center justify-between text-[11px]">
            <span className="text-on-surface-variant">Saluran Bayar:</span>
            <span className="font-semibold text-primary">{order.paymentMethod}</span>
          </div>

          {/* Interactive QRIS & Gateway Simulation Box */}
          {!paymentDone && (
            <div className="p-4 rounded-2xl bg-brand-green text-canvas space-y-3 mt-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-brand-gold text-xs">Simulasi Gateway Pembayaran</span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-canvas/80">QRIS / VA Demo</span>
              </div>
              <p className="text-[11px] text-canvas/80 leading-relaxed">
                Untuk keperluan presentasi/demo, klik tombol di bawah untuk menyimulasikan konfirmasi pelunasan instan dari Payment Gateway.
              </p>
              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={isSimulating}
                className="w-full py-2.5 rounded-xl bg-brand-gold hover:bg-yellow-500 text-brand-green-dark font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base">
                  {isSimulating ? 'sync' : 'verified_user'}
                </span>
                <span>
                  {isSimulating ? 'Memverifikasi...' : 'Simulasikan Pembayaran Lunas (1-Klik)'}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        <Link
          href="/profile"
          className="w-full h-11 bg-brand-green hover:bg-brand-green-dark text-canvas font-semibold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base">receipt_long</span>
          <span>Lihat di Profil &amp; Riwayat Pesanan</span>
        </Link>
        <Link
          href="/dashboard"
          className="w-full h-11 bg-surface-container-low hover:bg-surface-container text-on-surface font-semibold text-xs rounded-xl border border-divider transition flex items-center justify-center gap-1"
        >
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-on-surface-variant">Memuat konfirmasi pesanan...</div>}>
      <BookingSuccessContent />
    </Suspense>
  );
}
