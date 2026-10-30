'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { SriwedariDB } from '@/lib/db';
import { GalleryItem } from '@/lib/types';

export default function UserDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setGalleries(SriwedariDB.getGalleries());

    const handleUpdate = () => {
      setGalleries(SriwedariDB.getGalleries());
    };
    window.addEventListener('sriwedari_db_updated', handleUpdate);
    return () => window.removeEventListener('sriwedari_db_updated', handleUpdate);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/collection?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    SriwedariDB.toggleLike(id);
    setGalleries([...SriwedariDB.getGalleries()]);
  };

  const quickLinks = [
    { label: 'Galeri', href: '/collection', icon: 'photo_library' },
    { label: 'Kostum', href: '/collection/costumes', icon: 'checkroom' },
    { label: 'Jadwal', href: '/visitors', icon: 'calendar_month' },
    { label: 'Sewa', href: '/bookings', icon: 'receipt_long' },
  ];

  return (
    <div className="space-y-7">
      {/* Greeting & search */}
      <section>
        <p className="text-[11px] uppercase tracking-[0.14em] text-secondary font-semibold">
          Sugeng rawuh
        </p>
        <h1 className="font-serif text-[26px] leading-tight font-bold text-primary mt-1">
          Halo, {user ? user.name.split(' ')[0] : 'Tamu Budaya'}
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Jelajahi seni tari, busana keraton, dan pentas Wayang Orang Sriwedari.
        </p>

        <form onSubmit={handleSearch} className="relative mt-4" role="search">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-[20px] pointer-events-none">
            search
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari karya, busana, atau lakon"
            aria-label="Cari koleksi"
            className="w-full h-11 pl-11 pr-4 bg-surface-container-lowest border border-outline-variant/70 text-on-surface placeholder:text-on-surface-variant/50 rounded-xl text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/15 transition"
          />
        </form>
      </section>

      {/* Hero banner */}
      <section className="relative rounded-2xl overflow-hidden bg-brand-green-dark">
        <div className="aspect-[16/10] w-full relative">
          <img
            src="/images/tari-jawa-dramatic-stage.png"
            alt="Pentas tari di panggung Sriwedari"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark via-brand-green-dark/30 to-transparent" />

          <div className="absolute inset-0 p-5 flex flex-col justify-end text-canvas">
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-brand-gold">
              Mahakarya Surakarta
            </span>
            <h2 className="font-serif text-lg font-bold leading-snug mt-1 max-w-[85%]">
              Lestarikan warisan luhur melalui seni tari Sriwedari
            </h2>
            <div className="mt-3 flex items-center gap-2">
              <Link
                href="/collection"
                className="h-9 px-4 rounded-lg bg-brand-gold text-brand-green-dark font-semibold text-xs hover:brightness-110 transition inline-flex items-center"
              >
                Jelajahi koleksi
              </Link>
              <Link
                href="/about"
                className="h-9 px-4 rounded-lg text-canvas/90 hover:text-white hover:bg-white/10 font-medium text-xs transition inline-flex items-center"
              >
                Tentang kami
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <nav aria-label="Akses cepat" className="grid grid-cols-4 gap-2">
        {quickLinks.map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="group flex flex-col items-center gap-2 py-1 rounded-xl"
          >
            <span className="w-12 h-12 rounded-2xl bg-surface-container text-brand-green flex items-center justify-center transition group-hover:bg-brand-green group-hover:text-brand-gold">
              <span className="material-symbols-outlined text-[22px]">{q.icon}</span>
            </span>
            <span className="text-xs font-medium text-on-surface">{q.label}</span>
          </Link>
        ))}
      </nav>

      {/* Latest gallery */}
      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-serif text-lg font-bold text-primary leading-tight">
              Koleksi terbaru
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">Arsip panggung dan tari adiluhung</p>
          </div>
          <Link
            href="/collection"
            className="text-xs font-semibold text-brand-green hover:text-primary shrink-0 pb-0.5"
          >
            Lihat semua
          </Link>
        </div>

        {galleries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-outline-variant py-10 px-6 text-center">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant/50">photo_library</span>
            <p className="text-sm font-semibold text-on-surface mt-2">Belum ada koleksi</p>
            <p className="text-xs text-on-surface-variant mt-1">Karya baru dari kurator akan tampil di sini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {galleries.slice(0, 6).map((item) => (
              <Link key={item.id} href={`/collection/${item.id}`} className="group block">
                <div className="aspect-[4/5] relative overflow-hidden rounded-xl bg-surface-container">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <button
                    type="button"
                    onClick={(e) => handleLike(e, item.id)}
                    aria-label={item.isLiked ? 'Batal suka' : 'Sukai'}
                    aria-pressed={!!item.isLiked}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition ${
                      item.isLiked ? 'bg-white text-red-600' : 'bg-black/30 text-white hover:bg-black/45'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: item.isLiked ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      favorite
                    </span>
                  </button>
                </div>

                <div className="pt-2 px-0.5">
                  <p className="text-[11px] text-on-surface-variant truncate">
                    {item.categoryName || 'Tari'}
                  </p>
                  <h3 className="font-serif text-sm font-semibold text-primary leading-snug line-clamp-2 mt-0.5 group-hover:text-brand-green transition">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-on-surface-variant mt-1 tabular-nums">
                    {item.views.toLocaleString('id-ID')} dilihat · {item.likes.toLocaleString('id-ID')} suka
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
