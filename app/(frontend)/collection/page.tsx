'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SriwedariDB } from '@/lib/db';
import { GalleryItem, CategoryItem } from '@/lib/types';

function CollectionContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';

  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [search, setSearch] = useState<string>(initialQ);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    setGalleries(SriwedariDB.getGalleries());
    setCategories(SriwedariDB.getCategories());
    setWishlist(SriwedariDB.getWishlist());

    const handleUpdate = () => {
      setGalleries(SriwedariDB.getGalleries());
      setWishlist(SriwedariDB.getWishlist());
    };
    window.addEventListener('sriwedari_db_updated', handleUpdate);
    window.addEventListener('sriwedari_wishlist_updated', handleUpdate);
    return () => {
      window.removeEventListener('sriwedari_db_updated', handleUpdate);
      window.removeEventListener('sriwedari_wishlist_updated', handleUpdate);
    };
  }, []);

  const handleToggleWishlist = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    SriwedariDB.toggleWishlist(id);
    setWishlist(SriwedariDB.getWishlist());
  };

  const filtered = galleries.filter((g) => {
    const matchCat = selectedCat === 'all' || g.category === selectedCat;
    const matchSearch =
      !search ||
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase()) ||
      g.origin.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="font-serif text-lg font-bold text-primary flex items-center gap-1.5">
            <span>Katalog Galeri Seni</span>
          </h1>
          <p className="text-[11px] text-on-surface-variant">
            {filtered.length} arsip mahakarya tari Nusantara
          </p>
        </div>

        <Link
          href="/collection/costumes"
          className="px-3 py-1.5 rounded-xl bg-brand-green text-canvas text-xs font-semibold hover:bg-brand-green-dark transition flex items-center gap-1 shadow-sm shrink-0"
        >
          <span className="material-symbols-outlined text-sm">checkroom</span>
          <span>Busana</span>
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3.5 top-3 text-brand-gold text-lg">
          search
        </span>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari berdasarkan judul tarian, daerah asal, atau filosofi..."
          className="w-full h-11 pl-11 pr-4 bg-surface-container-low border border-divider rounded-2xl text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-brand-gold transition shadow-sm"
        />
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCat('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
            selectedCat === 'all'
              ? 'bg-brand-gold text-brand-green-dark shadow-sm'
              : 'bg-surface-container-low text-on-surface-variant border border-divider hover:border-brand-gold/50'
          }`}
        >
          Semua Karya ({galleries.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCat(cat.id === 'cat-1' ? 'tari-tradisional' : cat.id === 'cat-2' ? 'tari-kreasi' : cat.name)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              (selectedCat === 'tari-tradisional' && cat.id === 'cat-1') ||
              (selectedCat === 'tari-kreasi' && cat.id === 'cat-2')
                ? 'bg-brand-gold text-brand-green-dark shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant border border-divider hover:border-brand-gold/50'
            }`}
          >
            <span className="material-symbols-outlined text-sm">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Gallery Cards Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">
            search_off
          </span>
          <p className="text-sm font-medium">Tidak ada karya yang cocok dengan pencarian.</p>
          <button
            onClick={() => { setSearch(''); setSelectedCat('all'); }}
            className="mt-3 text-xs text-brand-green font-semibold underline"
          >
            Reset Penyaringan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {filtered.map((item) => {
            const isSaved = wishlist.includes(item.id);
            return (
              <Link
                key={item.id}
                href={`/collection/${item.id}`}
                className="group bg-surface-container-low rounded-2xl border border-divider overflow-hidden hover:shadow-card-warm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] relative overflow-hidden bg-black/10">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-brand-green-dark/80 backdrop-blur-sm text-brand-gold text-[9px] font-semibold">
                      {item.categoryName}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleToggleWishlist(e, item.id)}
                      className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm transition ${
                        isSaved ? 'bg-brand-gold text-brand-green-dark' : 'bg-black/40 text-white hover:text-brand-gold'
                      }`}
                      title={isSaved ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isSaved ? 'bookmark_added' : 'bookmark'}
                      </span>
                    </button>
                  </div>

                  <div className="p-2.5">
                    <span className="text-[9px] text-on-surface-variant block">{item.origin}</span>
                    <h3 className="font-serif text-xs font-bold text-primary group-hover:text-brand-green transition line-clamp-1 mt-0.5">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="px-2.5 pb-2.5 pt-1 border-t border-divider flex items-center justify-between text-[10px] text-on-surface-variant">
                  <span className="flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">visibility</span>
                    <span>{item.views}</span>
                  </span>
                  <span className="flex items-center gap-0.5 text-red-700 font-medium">
                    <span className="material-symbols-outlined text-[12px]">favorite</span>
                    <span>{item.likes}</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CollectionPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-on-surface-variant">Memuat galeri budaya...</div>}>
      <CollectionContent />
    </Suspense>
  );
}
