'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { SriwedariDB } from '@/lib/db';
import { OrderItem, TicketItem, GalleryItem } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';
import TicketBoardingPassModal from '@/components/ticket/TicketBoardingPassModal';
import { X } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'tickets' | 'wishlist'>('orders');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<GalleryItem[]>([]);

  // Modals & Proof state
  const [selectedTicketForPass, setSelectedTicketForPass] = useState<TicketItem | null>(null);
  const [viewProofUrl, setViewProofUrl] = useState<{ url: string; orderId: string } | null>(null);
  const [toastMsg, setToastMsg] = useState<string>('');
  const [uploadingOrderId, setUploadingOrderId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();

    window.addEventListener('sriwedari_db_updated', handleUpdate);
    window.addEventListener('sriwedari_wishlist_updated', handleUpdate);
    return () => {
      window.removeEventListener('sriwedari_db_updated', handleUpdate);
      window.removeEventListener('sriwedari_wishlist_updated', handleUpdate);
    };
  }, []);

  const loadData = () => {
    const allOrders = SriwedariDB.getOrders();
    const allTickets = SriwedariDB.getTickets();
    const wishlistIds = SriwedariDB.getWishlist();
    const allGalleries = SriwedariDB.getGalleries();

    setOrders(allOrders);
    setTickets(allTickets);
    setWishlistItems(allGalleries.filter(g => wishlistIds.includes(g.id)));
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const handleRemoveWishlist = (id: string) => {
    SriwedariDB.toggleWishlist(id);
  };

  const handleTriggerUpload = (orderId: string) => {
    setUploadingOrderId(orderId);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingOrderId) return;

    if (!file.type.startsWith('image/')) {
      showToast('Harap pilih berkas gambar bukti transfer (JPG / PNG)');
      return;
    }

    try {
      showToast('Mengunggah berkas slip ke server...');
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        SriwedariDB.attachPaymentProof(uploadingOrderId, data.url);

        await fetch('/api/orders', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: uploadingOrderId, paymentProof: data.url }),
        });

        showToast('Slip bukti transfer berhasil disimpan di server! Kurator dapat memverifikasi.');
        loadData();
      } else {
        showToast(data.error || 'Gagal mengunggah berkas');
      }
    } catch {
      showToast('Terjadi kesalahan jaringan saat mengunggah berkas');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-brand-green-dark text-brand-gold px-4 py-2.5 rounded-xl border border-brand-gold/40 shadow-xl text-xs flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hidden File Input for Proof of Transfer */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Profile Card */}
      <div className="p-6 rounded-3xl bg-brand-green text-canvas border border-brand-gold/30 shadow-card-warm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-gold text-brand-green-dark flex items-center justify-center font-bold text-2xl shadow-md">
            {user ? user.name.charAt(0) : 'T'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl font-bold gold-gradient-text">
                {user ? user.name : 'Tamu Budaya'}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-gold text-brand-green-dark">
                Anggota Resmi
              </span>
            </div>
            <p className="text-xs text-canvas/70 mt-0.5">{user ? user.email : 'tamu@sriwedari.id'}</p>
            <div className="mt-2 flex items-center gap-3 text-xs text-canvas/80">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-brand-gold">military_tech</span>
                <span>{user ? user.points : 420} Poin Budaya</span>
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-500/40 text-xs font-semibold transition flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base">logout</span>
          <span>Keluar Akun</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-surface-container-low p-1.5 rounded-2xl border border-divider">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'orders'
              ? 'bg-brand-green text-canvas shadow-sm'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-base">receipt_long</span>
          <span>Pesanan Sewa ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'tickets'
              ? 'bg-brand-green text-canvas shadow-sm'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-base">confirmation_number</span>
          <span>E-Tiket Pentas ({tickets.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'wishlist'
              ? 'bg-brand-green text-canvas shadow-sm'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-base">bookmark</span>
          <span>Favorit ({wishlistItems.length})</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant">
              <p className="text-sm">Belum ada riwayat pesanan sewa busana.</p>
              <Link href="/bookings" className="text-xs text-brand-green font-semibold underline mt-2 inline-block">
                Mulai Pesan Sewa
              </Link>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-2xl bg-surface-container-low border border-divider space-y-3 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-divider">
                  <div>
                    <span className="text-[10px] text-on-surface-variant block">ID Invoice:</span>
                    <span className="font-mono font-bold text-sm text-primary">{ord.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        ord.status === 'Dikonfirmasi'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'Selesai'
                          ? 'bg-blue-100 text-blue-800'
                          : ord.status === 'Sedang Disewa'
                          ? 'bg-purple-100 text-purple-800'
                          : ord.status === 'Dibatalkan'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <span className="text-on-surface-variant text-[10px] block">Busana:</span>
                    <span className="font-semibold text-primary">{ord.costumeName}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant text-[10px] block">Durasi Sewa:</span>
                    <span>{ord.duration} Hari ({ord.startDate})</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant text-[10px] block">Deposit:</span>
                    <span className="price">{formatRupiah(ord.depositFee)}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant text-[10px] block">Total Bayar:</span>
                    <span className="font-bold text-brand-green price">{formatRupiah(ord.totalPrice)}</span>
                  </div>
                </div>

                {/* Proof of Payment Section */}
                <div className="p-3 rounded-xl bg-surface-container border border-divider flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-brand-gold">receipt</span>
                    <div>
                      <span className="font-medium text-primary block">Bukti Transfer / Slip Bayar</span>
                      <span className="text-[10px] text-on-surface-variant">
                        {ord.paymentProof ? 'Slip pembayaran berhasil diunggah' : 'Belum mengunggah slip pembayaran'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {ord.paymentProof && (
                      <button
                        onClick={() => setViewProofUrl({ url: ord.paymentProof!, orderId: ord.id })}
                        className="px-3 py-1.5 rounded-lg bg-brand-green/10 hover:bg-brand-green/20 text-brand-green border border-brand-green/30 text-[11px] font-semibold flex items-center gap-1 transition"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        <span>Lihat Bukti</span>
                      </button>
                    )}

                    {ord.status !== 'Selesai' && ord.status !== 'Dibatalkan' && (
                      <button
                        onClick={() => handleTriggerUpload(ord.id)}
                        className="px-3 py-1.5 rounded-lg bg-brand-green hover:bg-brand-green-dark text-canvas text-[11px] font-semibold flex items-center gap-1 shadow-sm transition"
                      >
                        <span className="material-symbols-outlined text-sm">upload_file</span>
                        <span>{ord.paymentProof ? 'Ganti Slip' : 'Unggah Slip Bayar'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {ord.qcStatus && (
                  <div className="p-3 rounded-xl bg-white border border-divider text-xs flex items-center justify-between">
                    <span>Hasil QC Pengembalian: <strong>{ord.qcStatus}</strong></span>
                    <span className="text-emerald-700 font-bold price">
                      Refund Deposit: {formatRupiah(ord.refundAmount || 0)}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Tickets */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          {tickets.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant">
              <p className="text-sm">Belum ada tiket pementasan yang dipesan.</p>
              <Link href="/visitors" className="text-xs text-brand-green font-semibold underline mt-2 inline-block">
                Pesan Tiket Pentas
              </Link>
            </div>
          ) : (
            tickets.map((tck) => (
              <div
                key={tck.id}
                className="p-4 rounded-2xl bg-surface-container-low border border-divider flex flex-col gap-3 shadow-sm"
              >
                <div className="space-y-1 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-green/10 text-brand-green border border-brand-green/20">
                      Zona {tck.zone}
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-mono">{tck.id}</span>
                  </div>
                  <h3 className="font-serif text-sm font-bold text-primary mt-1">{tck.eventTitle}</h3>
                  <p className="text-xs text-on-surface-variant">
                    Kursi: <strong>{tck.seats?.join(', ') || 'A-05'}</strong> ({tck.quantity} Tiket) • {tck.userName}
                  </p>
                  <p className="text-xs font-bold text-brand-green price pt-0.5">
                    Total: {formatRupiah(tck.totalPrice)}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-divider">
                  <div className="text-left">
                    <span className="text-[10px] text-on-surface-variant block">Kode Boarding:</span>
                    <span className="font-mono text-xs font-bold text-primary tracking-wider">{tck.bookingCode}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tck.status === 'Aktif'
                          ? 'bg-emerald-100 text-emerald-800'
                          : tck.status === 'Check-in'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {tck.status}
                    </span>
                    <button
                      onClick={() => setSelectedTicketForPass(tck)}
                      className="px-2.5 py-1 rounded-lg bg-brand-green hover:bg-brand-green-dark text-canvas text-[11px] font-bold flex items-center gap-1 shadow-sm transition"
                    >
                      <span className="material-symbols-outlined text-sm">print</span>
                      <span>E-Tiket</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {wishlistItems.length === 0 ? (
            <div className="col-span-full py-12 text-center text-on-surface-variant">
              <p className="text-sm">Belum ada karya seni yang disimpan ke favorit.</p>
              <Link href="/collection" className="text-xs text-brand-green font-semibold underline mt-2 inline-block">
                Jelajahi Galeri
              </Link>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-surface-container-low rounded-2xl border border-divider overflow-hidden flex flex-col justify-between"
              >
                <div className="aspect-[4/3] relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <button
                    aria-label="Hapus dari daftar simpan"
                    onClick={() => handleRemoveWishlist(item.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center"
                    title="Hapus"
                  >
                    <X className="w-4 h-4" strokeWidth={2.25} aria-hidden="true" />
                  </button>
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="font-serif text-sm font-bold text-primary line-clamp-1">{item.title}</h4>
                  <Link
                    href={`/collection/${item.id}`}
                    className="w-full py-2 rounded-xl bg-brand-green text-canvas text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <span>Lihat Detail Karya</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Ticket Boarding Pass Modal */}
      <TicketBoardingPassModal
        ticket={selectedTicketForPass}
        onClose={() => setSelectedTicketForPass(null)}
      />

      {/* Proof of Transfer Viewer Modal */}
      {viewProofUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-stone-900 border border-stone-200">
            <button
              aria-label="Tutup"
              onClick={() => setViewProofUrl(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center"
            >
              <X className="w-4 h-4" strokeWidth={2.25} aria-hidden="true" />
            </button>
            <div>
              <span className="text-[10px] text-brand-green font-bold uppercase tracking-wider block">
                Slip Pembayaran Resmi
              </span>
              <h3 className="font-serif text-lg font-bold text-stone-800">
                Invoice {viewProofUrl.orderId}
              </h3>
            </div>

            <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 max-h-96 flex items-center justify-center">
              <img
                src={viewProofUrl.url}
                alt="Slip Pembayaran"
                className="w-full h-auto max-h-80 object-contain"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setViewProofUrl(null)}
                className="px-5 py-2 bg-brand-green text-canvas font-semibold text-xs rounded-xl shadow hover:bg-brand-green-dark transition"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
