'use client';

import React, { useEffect, useState } from 'react';
import { ReviewItem } from '@/lib/types';
import { Trash2, Eye, EyeOff, Star } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (data.success && data.data) {
        setReviews(data.data);
      }
    } catch {}
    setIsLoading(false);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleToggleStatus = async (review: ReviewItem) => {
    const nextStatus = review.status === 'disembunyikan' ? 'tampil' : 'disembunyikan';
    try {
      const res = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: review.id, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          nextStatus === 'tampil'
            ? 'Ulasan berhasil ditampilkan kembali ke katalog publik'
            : 'Ulasan berhasil disembunyikan dari katalog publik'
        );
        loadReviews();
      }
    } catch {
      showToast('Gagal mengubah status ulasan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus ulasan ini secara permanen?')) return;
    try {
      const res = await fetch(`/api/reviews?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showToast('Ulasan berhasil dihapus permanen');
        loadReviews();
      }
    } catch {
      showToast('Gagal menghapus ulasan');
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const matchSearch =
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase());
    const matchRating = filterRating === 'all' || r.rating === Number(filterRating);
    return matchSearch && matchRating;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-brand-gold text-brand-green-dark font-semibold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold gold-gradient-text">
          Moderasi Ulasan Pengunjung
        </h1>
        <p className="text-xs text-canvas/70 mt-0.5">
          Kelola transparansi testimoni, peringkat bintang kepuasan, dan pengawasan konten ulasan etalase budaya
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#14382C]/70 p-3.5 rounded-2xl border border-brand-gold/20">
        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-brand-gold/60 text-lg">
            search
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama penilai atau kata ulasan..."
            className="w-full h-9 pl-9 pr-3 bg-black/30 border border-brand-gold/20 rounded-xl text-xs text-white placeholder-canvas/30 focus:outline-none focus:border-brand-gold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-canvas/60 shrink-0">Filter Bintang:</span>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="h-9 px-3 bg-black/40 border border-brand-gold/20 rounded-xl text-xs text-white focus:outline-none focus:border-brand-gold"
          >
            <option value="all">Semua Nilai Bintang</option>
            <option value="5">5 Bintang</option>
            <option value="4">4 Bintang</option>
            <option value="3">3 Bintang</option>
            <option value="2">2 Bintang</option>
            <option value="1">1 Bintang</option>
          </select>
        </div>
      </div>

      {/* Reviews Table / Cards */}
      {isLoading ? (
        <div className="p-8 text-center text-canvas/60 text-xs">Memuat data ulasan...</div>
      ) : filteredReviews.length === 0 ? (
        <div className="p-8 text-center text-canvas/60 text-xs rounded-2xl border border-dashed border-brand-gold/20">
          Tidak ada ulasan yang sesuai dengan kriteria filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((r) => {
            const isHidden = r.status === 'disembunyikan';
            return (
              <div
                key={r.id}
                className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                  isHidden
                    ? 'bg-black/40 border-red-500/30 opacity-75'
                    : 'bg-[#14382C]/80 border-brand-gold/25'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-brand-gold flex items-center justify-center font-bold text-xs shrink-0">
                        {r.userName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate">
                          {r.userName}
                        </span>
                        <span className="text-[10px] text-canvas/50 block">
                          {r.createdAt} • Target: {r.targetType}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                        isHidden
                          ? 'bg-red-950/80 text-red-300 border border-red-500/40'
                          : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {isHidden ? 'Disembunyikan' : 'Tampil Publik'}
                    </span>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= r.rating
                            ? 'text-brand-gold fill-brand-gold'
                            : 'text-canvas/20'
                        }`}
                      />
                    ))}
                    <span className="text-[11px] font-semibold text-brand-gold ml-1">
                      {r.rating}.0
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-canvas/90 leading-relaxed italic bg-black/20 p-2.5 rounded-xl border border-white/5">
                    "{r.comment}"
                  </p>
                </div>

                {/* Moderation Actions */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-canvas/50">ID: {r.id}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(r)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-[11px] transition ${
                        isHidden
                          ? 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {isHidden ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Tampilkan</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Sembunyikan</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-1 rounded-lg text-red-400 hover:text-white hover:bg-red-950/60 transition"
                      title="Hapus Ulasan Permanen"
                      aria-label="Hapus Ulasan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
