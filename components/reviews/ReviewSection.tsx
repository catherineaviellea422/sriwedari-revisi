'use client';

import React, { useState, useEffect } from 'react';
import { SriwedariDB } from '@/lib/db';
import { ReviewItem } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';

interface ReviewSectionProps {
  targetId: string;
  targetType: 'gallery' | 'costume';
  targetTitle: string;
}

export default function ReviewSection({ targetId, targetType, targetTitle }: ReviewSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>(user ? user.name : '');
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  useEffect(() => {
    loadReviews();
    const handleUpdate = () => loadReviews();
    window.addEventListener('sriwedari_db_updated', handleUpdate);
    return () => window.removeEventListener('sriwedari_db_updated', handleUpdate);
  }, [targetId]);

  useEffect(() => {
    if (user && !authorName) {
      setAuthorName(user.name);
    }
  }, [user]);

  const loadReviews = () => {
    const db = SriwedariDB as any;
    if (typeof db.getReviews === 'function') {
      const list = db.getReviews(targetId);
      setReviews(list || []);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const db = SriwedariDB as any;
    if (typeof db.addReview === 'function') {
      db.addReview({
        targetId,
        targetType,
        userName: authorName.trim() || 'Sahabat Budaya',
        rating,
        comment: comment.trim(),
        verified: true,
      });
    }

    setComment('');
    setSubmittedSuccess(true);
    loadReviews();
    setTimeout(() => setSubmittedSuccess(false), 4000);
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <section className="mt-10 pt-8 border-t border-divider space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider block">
            Apresiasi &amp; Ulasan Pelestari
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-primary">
            Ulasan Budaya ({reviews.length})
          </h2>
        </div>

        <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2 rounded-2xl border border-divider">
          <div className="text-2xl font-serif font-black text-brand-green">
            {averageRating}
          </div>
          <div>
            <div className="flex text-brand-gold text-sm">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="material-symbols-outlined text-base">
                  {Number(averageRating) >= star ? 'star' : 'star_half'}
                </span>
              ))}
            </div>
            <span className="text-[10px] text-on-surface-variant block">
              Berdasarkan {reviews.length} ulasan terverifikasi
            </span>
          </div>
        </div>
      </div>

      {/* Submission Form */}
      <div className="p-6 rounded-3xl bg-surface-container-low border border-divider shadow-sm space-y-4">
        <h3 className="font-serif text-base font-bold text-primary">
          Tulis Apresiasi untuk &ldquo;{targetTitle}&rdquo;
        </h3>

        {submittedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-emerald-600">verified</span>
            <span>Matur nuwun! Ulasan apresiasi budaya Anda berhasil dipublikasikan.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Star selector */}
          <div className="space-y-1">
            <label className="block text-on-surface-variant font-medium">Beri Penilaian Bintang:</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-2xl text-brand-gold focus:outline-none transition-transform hover:scale-125"
                >
                  <span className="material-symbols-outlined fill-current">
                    {(hoverRating || rating) >= star ? 'star' : 'star_border'}
                  </span>
                </button>
              ))}
              <span className="ml-2 font-bold text-primary text-sm">{rating} / 5 Bintang</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-on-surface-variant mb-1 font-medium">Nama Anda / Pengulas:</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Contoh: Bp. Suryo Diningrat"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-divider text-primary focus:border-brand-green focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-on-surface-variant mb-1 font-medium">Ulasan &amp; Kesan Budaya:</label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ceritakan keanggunan tata busana, ukiran pusaka, maupun keotentikan nilai sejarah..."
              className="w-full p-3.5 rounded-xl bg-surface border border-divider text-primary focus:border-brand-green focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-dark text-canvas font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">send</span>
            <span>Kirim Ulasan Budaya</span>
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant bg-surface-container-low rounded-2xl border border-divider">
            <span className="material-symbols-outlined text-3xl text-brand-gold/60 mb-2">rate_review</span>
            <p className="text-xs">Jadilah yang pertama memberikan ulasan apresiasi untuk karya pusaka ini.</p>
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-2xl bg-surface-container-low border border-divider space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-gold text-brand-green-dark flex items-center justify-center font-bold text-xs shadow-sm">
                    {rev.userName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-primary">{rev.userName}</span>
                      {rev.verified && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[10px]">verified</span>
                          <span>Terverifikasi</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-on-surface-variant block">{rev.createdAt}</span>
                  </div>
                </div>

                <div className="flex text-brand-gold text-xs">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm">
                      {i < rev.rating ? 'star' : 'star_border'}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-on-surface-variant pl-10 leading-relaxed">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
