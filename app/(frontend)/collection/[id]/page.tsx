'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SriwedariDB } from '@/lib/db';
import { GalleryItem } from '@/lib/types';
import ReviewSection from '@/components/reviews/ReviewSection';

export default function GalleryDetailPage({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<GalleryItem | null>(null);
  const [toastMsg, setToastMsg] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    const found = SriwedariDB.getGalleryById(params.id);
    if (found) {
      setItem(found);
      setIsSaved(SriwedariDB.getWishlist().includes(found.id));
    }
  }, [params.id]);

  if (!item) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-on-surface-variant">Memuat rincian pusaka seni...</p>
      </div>
    );
  }

  const handleLike = () => {
    SriwedariDB.toggleLike(item.id);
    const updated = SriwedariDB.getGalleryById(item.id);
    if (updated) setItem({ ...updated });
  };

  const handleWishlist = () => {
    const saved = SriwedariDB.toggleWishlist(item.id);
    setIsSaved(saved);
    showToast(saved ? 'Karya ditambahkan ke Koleksi Favorit' : 'Karya dihapus dari Favorit');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Tautan berhasil disalin ke papan klip!');
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed md:absolute top-16 md:top-16 left-1/2 -translate-x-1/2 z-50 bg-brand-green-dark text-brand-gold px-4 py-2 rounded-xl border border-brand-gold/40 shadow-xl text-xs flex items-center gap-2 whitespace-nowrap">
          <span className="material-symbols-outlined text-base">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Back button */}
      <Link
        href="/collection"
        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-green hover:underline"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        <span>Kembali ke Galeri</span>
      </Link>

      <div className="space-y-4">
        {/* Visual Showcase Card */}
        <div className="rounded-3xl overflow-hidden border border-divider shadow-card-warm bg-black/10 relative">
          <img
            src={item.image}
            alt={item.title}
            className="w-full aspect-[4/3] object-cover"
          />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleWishlist}
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition ${
                isSaved ? 'bg-brand-gold text-brand-green-dark' : 'bg-black/50 text-white hover:text-brand-gold'
              }`}
              title="Simpan Favorit"
            >
              <span className="material-symbols-outlined text-xl">
                {isSaved ? 'bookmark_added' : 'bookmark'}
              </span>
            </button>
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md shadow-md transition"
              title="Bagikan Tautan"
            >
              <span className="material-symbols-outlined text-xl">share</span>
            </button>
          </div>
        </div>

        {/* Content Details */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-brand-green/10 text-brand-green border border-brand-green/20">
                {item.categoryName}
              </span>
              <span className="text-xs text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">location_on</span>
                <span>{item.origin}</span>
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary leading-tight">
              {item.title}
            </h1>
          </div>

          {/* Social Stats & Like CTA */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-divider flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">visibility</span>
                <span className="font-medium text-primary">{item.views} Dilihat</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-red-600">favorite</span>
                <span className="font-medium text-primary">{item.likes} Apresiasi</span>
              </span>
            </div>

            <button
              onClick={handleLike}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                item.isLiked
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-white text-on-surface border border-divider hover:border-red-300'
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {item.isLiked ? 'favorite' : 'favorite_border'}
              </span>
              <span>{item.isLiked ? 'Disukai' : 'Apresiasi'}</span>
            </button>
          </div>

          {/* Philosophy & Narrative */}
          <div className="p-5 sm:p-6 rounded-2xl bg-surface-container-low border border-divider space-y-3">
            <div className="flex items-center gap-2 border-b border-divider pb-2.5">
              <span className="material-symbols-outlined text-brand-gold text-lg">auto_stories</span>
              <h3 className="font-serif text-base font-bold text-primary">Filosofi &amp; Narasi Sejarah Budaya</h3>
            </div>
            <div className="text-xs sm:text-sm text-on-surface-variant leading-relaxed whitespace-pre-line break-words space-y-2 font-serif sm:font-sans">
              {item.description}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-divider flex flex-col sm:flex-row items-center gap-3">
            <Link
              href={`/bookings?costumeId=${item.costumeId || 'costume-topeng'}`}
              className="w-full sm:w-auto flex-1 h-11 bg-brand-green hover:bg-brand-green-dark text-canvas font-semibold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">checkroom</span>
              <span>Sewa Busana Terkait Karya Ini</span>
            </Link>

            <Link
              href="/visitors"
              className="w-full sm:w-auto px-5 h-11 bg-surface-container-low hover:bg-surface-container text-primary border border-divider font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">confirmation_number</span>
              <span>Jadwal Pentas</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Cultural Review & Ratings Section */}
      <ReviewSection
        targetId={item.id}
        targetType="gallery"
        targetTitle={item.title}
      />
    </div>
  );
}
