'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SriwedariDB } from '@/lib/db';
import { GalleryItem } from '@/lib/types';

export default function AdminCreateContentPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('tari-tradisional');
  const [categoryName, setCategoryName] = useState('Tari Tradisional');
  const [origin, setOrigin] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('/images/tari-topeng-malangan.png');

  const availableImages = [
    { label: 'Tari Topeng Malangan', path: '/images/tari-topeng-malangan.png' },
    { label: 'Tari Kipas Pakarena', path: '/images/tari-kipas.png' },
    { label: 'Tari Gandrung Banyuwangi', path: '/images/tari-gandrung-banyuwangi.png' },
    { label: 'Tari Jawa Bedhaya', path: '/images/tari-jawa-stage.png' },
    { label: 'Tari Ramayana Teatrikal', path: '/images/tari-jawa-dramatic-stage.png' },
    { label: 'Reog Ponorogo Warok', path: '/images/reog-ponorogo.png' },
    { label: 'Tari Ketubun Pusaka', path: '/images/tari-ketubun-ritual-1.png' },
    { label: 'Tari Kecak Kolosal', path: '/images/tari-kecak.png' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGallery: GalleryItem = {
      id: 'gal-' + Date.now(),
      title,
      category,
      categoryName: category === 'tari-tradisional' ? 'Tari Tradisional' : category === 'tari-kreasi' ? 'Tari Kreasi' : 'Busana Pusaka',
      type: 'foto',
      date: new Date().toISOString().split('T')[0],
      description,
      image,
      views: 0,
      likes: 0,
      isLiked: false,
      origin: origin || 'Surakarta, Jawa Tengah',
    };

    SriwedariDB.saveGallery(newGallery);
    router.push('/admin/collection');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/collection"
          className="inline-flex items-center gap-1.5 text-xs text-brand-gold hover:underline"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Kembali ke Koleksi</span>
        </Link>
        <span className="text-xs text-canvas/60">Formulir Kurasi Pusaka</span>
      </div>

      <div className="p-6 md:p-8 rounded-3xl bg-[#14382C] border border-brand-gold/30 shadow-xl space-y-5">
        <div>
          <h1 className="font-serif text-2xl font-bold gold-gradient-text">
            Tambah Arsip Karya Seni Budaya
          </h1>
          <p className="text-xs text-canvas/70 mt-0.5">
            Karya baru yang disimpan akan langsung tampil secara reaktif di katalog pengguna dan admin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-canvas/80 mb-1">Judul Karya Tari / Kesenian:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="misal: Tari Gambyong Pareanom"
              className="w-full h-10 px-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-canvas/80 mb-1">Rumpun Kesenian:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
              >
                <option value="tari-tradisional">Tari Tradisional</option>
                <option value="tari-kreasi">Tari Kreasi</option>
                <option value="busana-pusaka">Busana Pusaka</option>
              </select>
            </div>
            <div>
              <label className="block text-canvas/80 mb-1">Daerah Asal Warisan:</label>
              <input
                type="text"
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="misal: Keraton Surakarta"
                className="w-full h-10 px-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-canvas/80 mb-1">Pilih Arsip Foto Lokal:</label>
            <select
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
            >
              {availableImages.map((img) => (
                <option key={img.path} value={img.path}>
                  {img.label} ({img.path})
                </option>
              ))}
            </select>
          </div>

          {/* Preview Image */}
          <div className="p-3 rounded-2xl bg-black/30 border border-brand-gold/20 flex items-center gap-4">
            <img src={image} alt="Preview" className="w-20 h-20 rounded-xl object-cover" />
            <div className="text-[11px] text-canvas/70">
              <span className="font-semibold text-white block mb-0.5">Pratinjau Foto Arsip</span>
              <span>Resolusi tinggi lokal tanpa tautan eksternal (100% bebas 404).</span>
            </div>
          </div>

          <div>
            <label className="block text-canvas/80 mb-1">Deskripsi Narasi &amp; Filosofi Sejarah:</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan asal usul tarian, makna filosofis gerak, dan ornamen busana adat..."
              className="w-full p-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              className="flex-1 h-11 bg-brand-gold text-brand-green-dark font-bold text-xs rounded-xl shadow-md hover:brightness-110 transition flex items-center justify-center gap-1.5"
            >
              <span>Publikasikan Karya ke Galeri</span>
              <span className="material-symbols-outlined text-base">check</span>
            </button>
            <Link
              href="/admin/collection"
              className="px-5 h-11 bg-black/40 border border-brand-gold/20 text-canvas rounded-xl text-xs flex items-center justify-center"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
