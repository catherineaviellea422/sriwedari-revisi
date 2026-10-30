'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SriwedariDB } from '@/lib/db';
import { GalleryItem, CategoryItem, CostumeItem } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';

export default function AdminCollectionPage() {
  const [activeTab, setActiveTab] = useState<'galleries' | 'costumes' | 'categories'>('galleries');
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [costumes, setCostumes] = useState<CostumeItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('sriwedari_db_updated', handleUpdate);
    return () => window.removeEventListener('sriwedari_db_updated', handleUpdate);
  }, []);

  const loadData = () => {
    setGalleries(SriwedariDB.getGalleries());
    setCostumes(SriwedariDB.getCostumes());
    setCategories(SriwedariDB.getCategories());
  };

  const handleDeleteGallery = (id: string) => {
    if (confirm('Yakin ingin menghapus karya seni ini dari katalog?')) {
      SriwedariDB.deleteGallery(id);
      loadData();
    }
  };

  const handleDeleteCostume = (id: string) => {
    if (confirm('Yakin ingin menghapus busana ini dari katalog sewa?')) {
      SriwedariDB.deleteCostume(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold gold-gradient-text">
            Koleksi Galeri Seni, Busana &amp; Kategori
          </h1>
          <p className="text-xs text-canvas/70 mt-0.5">
            Manajemen arsip kebudayaan Nusantara, inventaris busana tari keraton, dan rumpun seni
          </p>
        </div>

        <Link
          href="/admin/collection/create"
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-brand-gold text-brand-green-dark font-semibold text-xs hover:brightness-110 transition flex items-center gap-1.5 shadow-md"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span>Tambah Konten Baru</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#14382C]/80 p-1.5 rounded-2xl border border-brand-gold/20">
        <button
          onClick={() => setActiveTab('galleries')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'galleries'
              ? 'bg-brand-gold text-brand-green-dark shadow-sm'
              : 'text-canvas/70 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-base">photo_library</span>
          <span>Arsip Galeri Tari ({galleries.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('costumes')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'costumes'
              ? 'bg-brand-gold text-brand-green-dark shadow-sm'
              : 'text-canvas/70 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-base">checkroom</span>
          <span>Busana Sewa ({costumes.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'categories'
              ? 'bg-brand-gold text-brand-green-dark shadow-sm'
              : 'text-canvas/70 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-base">category</span>
          <span>Kategori Seni ({categories.length})</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3.5 top-3 text-brand-gold/70 text-lg">
          search
        </span>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari berdasarkan judul, nama busana, atau kategori..."
          className="w-full h-11 pl-11 pr-4 bg-[#14382C]/90 border border-brand-gold/20 rounded-2xl text-xs text-white placeholder-canvas/40 focus:outline-none focus:border-brand-gold"
        />
      </div>

      {/* Tab 1: Galleries */}
      {activeTab === 'galleries' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {galleries
            .filter((g) => g.title.toLowerCase().includes(search.toLowerCase()) || g.origin.toLowerCase().includes(search.toLowerCase()))
            .map((item) => (
              <div
                key={item.id}
                className="bg-[#14382C]/80 rounded-2xl border border-brand-gold/20 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] relative">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/70 text-brand-gold text-[10px] font-semibold">
                      {item.categoryName}
                    </span>
                    <button
                      onClick={() => handleDeleteGallery(item.id)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-950/80 border border-red-500/40 text-red-200 flex items-center justify-center text-sm"
                      title="Hapus Karya"
                    >
                      <span className="material-symbols-outlined text-xs">delete</span>
                    </button>
                  </div>
                  <div className="p-4 space-y-1">
                    <span className="text-[10px] text-canvas/50">{item.origin}</span>
                    <h3 className="font-serif text-sm font-bold text-white line-clamp-1">{item.title}</h3>
                    <p className="text-[11px] text-canvas/70 line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>
                </div>
                <div className="p-4 pt-2 border-t border-brand-gold/15 flex items-center justify-between text-[11px] text-canvas/60">
                  <span>{item.views} views</span>
                  <span className="text-red-400 font-medium">{item.likes} likes</span>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Tab 2: Costumes */}
      {activeTab === 'costumes' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {costumes
            .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
            .map((item) => (
              <div
                key={item.id}
                className="bg-[#14382C]/80 rounded-2xl border border-brand-gold/20 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/70 text-brand-gold text-[10px] font-semibold">
                      Stok: {item.stock} set
                    </span>
                    <button
                      onClick={() => handleDeleteCostume(item.id)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-950/80 border border-red-500/40 text-red-200 flex items-center justify-center text-sm"
                      title="Hapus Busana"
                    >
                      <span className="material-symbols-outlined text-xs">delete</span>
                    </button>
                  </div>
                  <div className="p-4 space-y-1">
                    <span className="text-[10px] text-canvas/50">{item.category}</span>
                    <h3 className="font-serif text-sm font-bold text-white line-clamp-1">{item.name}</h3>
                    <p className="text-[11px] text-canvas/70 line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>
                </div>
                <div className="p-4 pt-2 border-t border-brand-gold/15 flex items-center justify-between">
                  <span className="font-bold text-sm text-emerald-400 price">{formatRupiah(item.price)}/hari</span>
                  <span className="text-[10px] text-canvas/60 font-mono">{item.sizes.join(', ')}</span>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Tab 3: Categories */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-5 rounded-2xl bg-[#14382C]/80 border border-brand-gold/20 flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-green text-brand-gold flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-base font-bold text-white">{cat.name}</h3>
                <p className="text-xs text-canvas/70 mt-1">{cat.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
