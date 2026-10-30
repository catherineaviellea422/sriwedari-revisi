'use client';

import React, { useEffect, useState } from 'react';
import { SriwedariDB } from '@/lib/db';
import { OrderItem } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';
import { X } from 'lucide-react';

export default function AdminBookingsPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderForQc, setSelectedOrderForQc] = useState<OrderItem | null>(null);
  const [selectedProofOrder, setSelectedProofOrder] = useState<OrderItem | null>(null);

  // QC Form
  const [qcGrade, setQcGrade] = useState<'Grade A' | 'Grade B' | 'Grade C' | 'Grade D'>('Grade A');
  const [qcNote, setQcNote] = useState('');

  useEffect(() => {
    loadOrders();
    const handleUpdate = () => loadOrders();
    window.addEventListener('sriwedari_db_updated', handleUpdate);
    return () => window.removeEventListener('sriwedari_db_updated', handleUpdate);
  }, []);

  const loadOrders = () => {
    setOrders(SriwedariDB.getOrders());
  };

  const handleUpdateStatus = (id: string, status: OrderItem['status']) => {
    SriwedariDB.updateOrderStatus(id, status);
    loadOrders();
  };

  const handleSimulateWebhook = async (orderId: string) => {
    try {
      const res = await fetch('/api/payments/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          transactionStatus: 'settlement',
          paymentType: 'QRIS Dinamis (Auto-Callback)',
        }),
      });
      const data = await res.json();
      if (data.success) {
        SriwedariDB.updateOrderStatus(orderId, 'Dikonfirmasi');
        setSelectedProofOrder(null);
        loadOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplyQc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForQc) return;

    let refund = 100000;
    if (qcGrade === 'Grade B') refund = 75000;
    if (qcGrade === 'Grade C') refund = 50000;
    if (qcGrade === 'Grade D') refund = 0;

    SriwedariDB.updateOrderQc(selectedOrderForQc.id, qcGrade, refund, qcNote);
    setSelectedOrderForQc(null);
    loadOrders();
  };

  const handleWhatsApp = (ord: OrderItem) => {
    const text = encodeURIComponent(
      `Sugeng Rawuh ${ord.userName}, kami kurator Galeri Sriwedari mengonfirmasi pesanan sewa ${ord.id} (${ord.costumeName}). Total: ${formatRupiah(ord.totalPrice)}. Silakan ambil busana sesuai jadwal.`
    );
    window.open(`https://wa.me/${ord.userPhone.replace(/^0/, '62')}?text=${text}`, '_blank');
  };

  const filtered = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'with_proof') return !!o.paymentProof;
    return o.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold gold-gradient-text">
          Manajemen Pesanan Sewa, Verifikasi &amp; QC Retur
        </h1>
        <p className="text-xs text-canvas/70 mt-0.5">
          Proses verifikasi slip pembayaran sewa busana adat keraton dan inspeksi pengembalian deposit garansi
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'with_proof', 'Menunggu', 'Dikonfirmasi', 'Sedang Disewa', 'Selesai', 'Dibatalkan'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              statusFilter === st
                ? 'bg-brand-gold text-brand-green-dark shadow-sm'
                : 'bg-[#14382C]/80 text-canvas/70 border border-brand-gold/20 hover:text-white'
            }`}
          >
            {st === 'all'
              ? `Semua (${orders.length})`
              : st === 'with_proof'
              ? `Ada Slip Transfer (${orders.filter(o => o.paymentProof).length})`
              : st}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-[#14382C]/80 border border-brand-gold/20 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-black/40 text-canvas/60 uppercase text-[10px] tracking-wider border-b border-brand-gold/20">
            <tr>
              <th className="py-3.5 px-4">Invoice / Tanggal</th>
              <th className="py-3.5 px-4">Penyewa &amp; Kontak</th>
              <th className="py-3.5 px-4">Busana / Durasi</th>
              <th className="py-3.5 px-4">Total Biaya</th>
              <th className="py-3.5 px-4">Slip Transfer</th>
              <th className="py-3.5 px-4">Status &amp; QC</th>
              <th className="py-3.5 px-4 text-right">Tindakan Kurator</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((ord) => (
              <tr key={ord.id} className="hover:bg-white/5 transition">
                <td className="py-3.5 px-4">
                  <span className="font-mono font-bold text-brand-gold block">{ord.id}</span>
                  <span className="text-[10px] text-canvas/50">{ord.createdAt}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-white block">{ord.userName}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-canvas/60">{ord.userPhone}</span>
                    <button
                      onClick={() => handleWhatsApp(ord)}
                      className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[9px] hover:bg-emerald-900"
                    >
                      WA
                    </button>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-medium text-white block">{ord.costumeName}</span>
                  <span className="text-[10px] text-canvas/60">{ord.duration} Hari (Mulai {ord.startDate})</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-bold text-emerald-400 price block">{formatRupiah(ord.totalPrice)}</span>
                  <span className="text-[10px] text-canvas/50">Deposit: {formatRupiah(ord.depositFee)}</span>
                </td>

                {/* Slip Transfer Column */}
                <td className="py-3.5 px-4">
                  {ord.paymentProof ? (
                    <button
                      onClick={() => setSelectedProofOrder(ord)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold border border-brand-gold/40 text-[10px] font-semibold transition"
                    >
                      <span className="material-symbols-outlined text-xs">receipt_long</span>
                      <span>Lihat Slip</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-canvas/40 italic">
                      Belum Unggah
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      ord.status === 'Dikonfirmasi'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : ord.status === 'Selesai'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : ord.status === 'Sedang Disewa'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : ord.status === 'Dibatalkan'
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {ord.status}
                  </span>
                  {ord.qcStatus && (
                    <span className="block text-[10px] text-brand-gold mt-1">
                      QC: {ord.qcStatus} ({formatRupiah(ord.refundAmount || 0)})
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {ord.status === 'Menunggu' && (
                      <button
                        onClick={() => handleUpdateStatus(ord.id, 'Dikonfirmasi')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold"
                      >
                        Konfirmasi
                      </button>
                    )}
                    {ord.status === 'Dikonfirmasi' && (
                      <button
                        onClick={() => handleUpdateStatus(ord.id, 'Sedang Disewa')}
                        className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold"
                      >
                        Kirim/Serah
                      </button>
                    )}
                    {ord.status === 'Sedang Disewa' && (
                      <button
                        onClick={() => setSelectedOrderForQc(ord)}
                        className="px-2.5 py-1 rounded-lg bg-brand-gold text-brand-green-dark text-[11px] font-bold shadow-sm"
                      >
                        Inspeksi QC &amp; Retur
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Proof of Payment Viewer Modal */}
      {selectedProofOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14382C] border border-brand-gold/40 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-canvas animate-in fade-in zoom-in-95">
            <button
              aria-label="Tutup"
              onClick={() => setSelectedProofOrder(null)}
              className="flex items-center justify-center absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 text-canvas hover:text-white"
            >
              <X className="w-4 h-4" strokeWidth={2.25} aria-hidden="true" />
            </button>

            <div>
              <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider block">
                Pemeriksaan Slip Bukti Transfer Kurator
              </span>
              <h3 className="font-serif text-lg font-bold text-white">
                Pesanan {selectedProofOrder.id} ({selectedProofOrder.userName})
              </h3>
            </div>

            {/* Proof Image Box */}
            <div className="rounded-2xl overflow-hidden border border-brand-gold/30 bg-black/50 p-2 max-h-80 flex items-center justify-center">
              {selectedProofOrder.paymentProof ? (
                <img
                  src={selectedProofOrder.paymentProof}
                  alt="Bukti Transfer"
                  className="w-full h-auto max-h-72 object-contain rounded-xl"
                />
              ) : (
                <p className="text-xs text-canvas/50 py-12">Belum ada slip terlampir</p>
              )}
            </div>

            {/* Order Details Brief */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs">
              <div>
                <span className="text-canvas/50 text-[10px] block">Busana:</span>
                <span className="font-semibold text-white">{selectedProofOrder.costumeName}</span>
              </div>
              <div>
                <span className="text-canvas/50 text-[10px] block">Metode Bayar:</span>
                <span className="font-semibold text-brand-gold">{selectedProofOrder.paymentMethod}</span>
              </div>
              <div>
                <span className="text-canvas/50 text-[10px] block">Total Transaksi:</span>
                <span className="font-bold text-emerald-400 price">{formatRupiah(selectedProofOrder.totalPrice)}</span>
              </div>
              <div>
                <span className="text-canvas/50 text-[10px] block">Status Terkini:</span>
                <span className="font-semibold text-amber-300">{selectedProofOrder.status}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              {selectedProofOrder.status === 'Menunggu' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      handleUpdateStatus(selectedProofOrder.id, 'Dikonfirmasi');
                      setSelectedProofOrder(null);
                    }}
                    className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base">verified</span>
                    <span>Verifikasi Lunas</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateWebhook(selectedProofOrder.id)}
                    className="px-4 h-11 bg-brand-gold text-brand-green-dark hover:bg-yellow-400 font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                    title="Uji coba callback webhook gateway otomatis"
                  >
                    <span className="material-symbols-outlined text-base">bolt</span>
                    <span>Simulasi Gateway Webhook</span>
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setSelectedProofOrder(null)}
                className="px-5 h-11 bg-black/40 border border-brand-gold/20 text-canvas hover:text-white rounded-xl text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QC Modal */}
      {selectedOrderForQc && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14382C] border border-brand-gold/40 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-canvas">
            <button
              aria-label="Tutup"
              onClick={() => setSelectedOrderForQc(null)}
              className="flex items-center justify-center absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 text-canvas hover:text-white"
            >
              <X className="w-4 h-4" strokeWidth={2.25} aria-hidden="true" />
            </button>

            <div>
              <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider">
                QC Inspeksi Pengembalian &amp; Refund Deposit
              </span>
              <h3 className="font-serif text-lg font-bold text-white">
                Pesanan {selectedOrderForQc.id} — {selectedOrderForQc.costumeName}
              </h3>
            </div>

            <form onSubmit={handleApplyQc} className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="block text-canvas/80 font-medium">Tingkat Kondisi Mutu Busana Saat Kembali:</label>
                <div className="space-y-2">
                  {[
                    { grade: 'Grade A', label: 'Grade A: Sempurna / Utuh (Denda Rp 0 -> 100% Deposit Rp 100.000 Dicairkan)' },
                    { grade: 'Grade B', label: 'Grade B: Kotor Ringan / Noda Keringat (Denda cuci Rp 25.000 -> Refund Rp 75.000)' },
                    { grade: 'Grade C', label: 'Grade C: Kerusakan Sedang / Jahitan Lepas (Denda Rp 50.000 -> Refund Rp 50.000)' },
                    { grade: 'Grade D', label: 'Grade D: Rusak Parah / Aksesoris Hilang (Denda Rp 100.000 -> Deposit Hangus)' },
                  ].map((opt) => (
                    <label
                      key={opt.grade}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                        qcGrade === opt.grade
                          ? 'bg-brand-gold/20 border-brand-gold text-white font-medium'
                          : 'bg-black/30 border-white/10 text-canvas/70 hover:bg-black/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="qcGrade"
                        value={opt.grade}
                        checked={qcGrade === opt.grade}
                        onChange={() => setQcGrade(opt.grade as any)}
                        className="accent-brand-gold"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-canvas/80 mb-1">Catatan Kurator / Detail Kerusakan:</label>
                <textarea
                  rows={2}
                  value={qcNote}
                  onChange={(e) => setQcNote(e.target.value)}
                  placeholder="Kondisi kain bersih, kelat bahu aman, manik omprok utuh..."
                  className="w-full p-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 h-11 bg-brand-gold text-brand-green-dark font-bold text-xs rounded-xl shadow-md hover:brightness-110"
                >
                  Selesaikan QC &amp; Cairkan Refund
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrderForQc(null)}
                  className="px-4 h-11 bg-black/40 border border-brand-gold/20 text-canvas rounded-xl text-xs"
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
