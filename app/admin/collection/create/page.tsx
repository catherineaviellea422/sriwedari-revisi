'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  Image as ImageIcon,
  Sparkles,
  Check,
  ArrowLeft,
  Trash2,
  FileText,
  Info,
  AlertCircle,
  Link2,
  RefreshCw,
} from 'lucide-react';
import { SriwedariDB } from '@/lib/db';
import { GalleryItem } from '@/lib/types';

export default function AdminCreateContentPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('tari-tradisional');
  const [origin, setOrigin] = useState('');
  const [description, setDescription] = useState('');

  // Image Source Mode: 'upload' (local file), 'preset' (katalog bawaan), 'url' (tautan web)
  const [sourceMode, setSourceMode] = useState<'upload' | 'preset' | 'url'>('upload');
  const [image, setImage] = useState('');
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('');

  // Upload Status
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const availablePresets = [
    { label: 'Tari Topeng Malangan', path: '/images/tari-topeng-malangan.png', desc: 'Topeng Kayu Malangan' },
    { label: 'Tari Kipas Pakarena', path: '/images/tari-kipas.png', desc: 'Sulawesi Selatan' },
    { label: 'Tari Gandrung Banyuwangi', path: '/images/tari-gandrung-banyuwangi.png', desc: 'Blambangan Banyuwangi' },
    { label: 'Tari Jawa Bedhaya', path: '/images/tari-jawa-stage.png', desc: 'Pentas Sakral Keraton' },
    { label: 'Tari Ramayana Teatrikal', path: '/images/tari-jawa-dramatic-stage.png', desc: 'Panggung Kolosal Sriwedari' },
    { label: 'Reog Ponorogo Warok', path: '/images/reog-ponorogo.png', desc: 'Dadak Merak Ponorogo' },
    { label: 'Tari Ketubun Pusaka', path: '/images/tari-ketubun-ritual-1.png', desc: 'Ritual Mistis Pedalaman' },
    { label: 'Tari Kecak Kolosal', path: '/images/tari-kecak.png', desc: 'Pentas Budaya Bali' },
  ];

  // Helper template kurator narasi sejarah
  const insertNarrativeTemplate = () => {
    const template = `[LATAR BELAKANG & SEJARAH WARISAN]
Karya seni tradisi adiluhung ini pertama kali berkembang pada masa kejayaan Keraton Mataram Islam dan dilestarikan secara turun-temurun oleh para abdi dalem bedhaya. Memiliki keterikatan historis yang kuat dengan upacara adat penobatan raja serta perayaan agung keraton.

[MAKNA SIMBOLIS RAGAM GERAK & BUSANA]
Setiap gerak jemari (ngrayung, nyempurit) melambangkan keharmonisan semesta dan ketundukan spiritual manusia kepada Sang Pencipta. Busana yang dikenakan memadukan kain kampuh motif parang barong pusaka, selendang cinde, dan perhiasan jamang kencana dengan makna kemuliaan budi pekerti luhur.

[FILOSOFI SPIRITUAL & NILAI LUHUR]
Tarian ini mengandung falsafah "Memayu Hayuning Bawana" — ajaran luhur untuk senantiasa memelihara kedamaian, keselarasan batin, dan keindahan budi pekerti di tengah dinamika peradaban zaman.`;

    if (description && !confirm('Gantikan teks narasi saat ini dengan kerangka kurator lengkap?')) {
      return;
    }
    setDescription(template);
  };

  // Upload handler ke /api/upload
  const handleUploadFile = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('prefix', 'karya');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal mengunggah berkas ke server');
      }

      setImage(data.url);
      return data.url;
    } catch (err: any) {
      setUploadError(err.message || 'Terjadi gangguan saat menyimpan berkas foto');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Process File Selection
  const onFileSelected = (file: File) => {
    setUploadError('');
    // Validasi tipe berkas
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
    if (!validMimes.includes(file.type)) {
      setUploadError('Format berkas tidak didukung. Mohon gunakan foto format JPG, PNG, atau WebP.');
      return;
    }

    // Validasi ukuran (maks 10 MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Ukuran foto terlalu besar. Maksimal ukuran berkas adalah 10 MB.');
      return;
    }

    setLocalFile(file);
    // Instant local preview via object URL
    const preview = URL.createObjectURL(file);
    setLocalPreviewUrl(preview);

    // Langsung unggah ke backend di latar belakang
    handleUploadFile(file);
  };

  // Drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  // Format File Size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Active Effective Image URL
  const effectiveImageUrl =
    sourceMode === 'upload'
      ? localPreviewUrl || image
      : sourceMode === 'preset'
      ? image || availablePresets[0].path
      : customUrl;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');

    let finalImageUrl = image;

    // Jika mode upload lokal, pastikan sudah diunggah
    if (sourceMode === 'upload') {
      if (!localFile && !image) {
        setUploadError('Silakan pilih berkas foto dari komputer Anda.');
        return;
      }
      if (localFile && (!image || image.startsWith('blob:'))) {
        // Upload jika belum selesai
        const uploaded = await handleUploadFile(localFile);
        if (!uploaded) return;
        finalImageUrl = uploaded;
      }
    } else if (sourceMode === 'preset') {
      finalImageUrl = image || availablePresets[0].path;
    } else if (sourceMode === 'url') {
      if (!customUrl.trim()) {
        setUploadError('Silakan masukkan tautan URL foto karya seni.');
        return;
      }
      finalImageUrl = customUrl.trim();
    }

    if (!finalImageUrl) {
      setUploadError('Foto karya seni wajib disertakan.');
      return;
    }

    setIsSubmitting(true);

    try {
      const categoryLabel =
        category === 'tari-tradisional'
          ? 'Tari Tradisional'
          : category === 'tari-kreasi'
          ? 'Tari Kreasi'
          : category === 'seni-teater'
          ? 'Seni Teater & Wayang'
          : 'Busana Pusaka';

      const newGallery: GalleryItem = {
        id: 'gal-' + Date.now(),
        title: title.trim(),
        category,
        categoryName: categoryLabel,
        type: 'foto',
        date: new Date().toISOString().split('T')[0],
        description: description.trim(),
        image: finalImageUrl,
        views: 0,
        likes: 0,
        isLiked: false,
        origin: origin.trim() || 'Surakarta, Jawa Tengah',
      };

      SriwedariDB.saveGallery(newGallery);
      router.push('/admin/collection');
    } catch (err: any) {
      setUploadError(err.message || 'Gagal menyimpan karya ke database galeri.');
      setIsSubmitting(false);
    }
  };

  const charCount = description.length;
  const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/collection"
          className="inline-flex items-center gap-1.5 text-xs text-brand-gold hover:underline font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Koleksi Galeri</span>
        </Link>
        <span className="text-[11px] text-canvas/60 font-mono">Formulir Kurasi Pusaka Seni</span>
      </div>

      {/* Main Form Container */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#14382C] border border-brand-gold/30 shadow-2xl space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></span>
            <span className="text-[10px] uppercase tracking-wider text-brand-gold font-bold">
              Arsip &amp; Dokumentasi Kebudayaan
            </span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold gold-gradient-text">
            Tambah Arsip Karya Seni Budaya
          </h1>
          <p className="text-xs text-canvas/70 mt-1 leading-relaxed">
            Dokumentasikan mahakarya seni tari, busana adat, dan artefak budaya Nusantara dengan kurasi foto lokal resolusi tinggi serta ulasan narasi filosofis yang mendalam.
          </p>
        </div>

        {uploadError && (
          <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <div className="leading-relaxed">{uploadError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* 1. Judul Karya */}
          <div>
            <label className="block text-canvas/90 font-semibold mb-1.5">
              Judul Karya Tari / Kesenian <span className="text-red-400">*</span>:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="misal: Tari Gambyong Pareanom, Tari Bedhaya Ketawang, Reog Ponorogo"
              className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-brand-gold/25 text-white placeholder-canvas/30 focus:outline-none focus:border-brand-gold transition text-xs"
            />
          </div>

          {/* 2. Rumpun & Daerah Asal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-canvas/90 font-semibold mb-1.5">Rumpun Kesenian:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-brand-gold/25 text-white focus:outline-none focus:border-brand-gold transition text-xs"
              >
                <option value="tari-tradisional">Tari Tradisional Klasik</option>
                <option value="tari-kreasi">Tari Kreasi Baru</option>
                <option value="seni-teater">Seni Teater &amp; Wayang Wong</option>
                <option value="busana-pusaka">Busana Pusaka Keraton</option>
              </select>
            </div>
            <div>
              <label className="block text-canvas/90 font-semibold mb-1.5">
                Daerah Asal Warisan <span className="text-red-400">*</span>:
              </label>
              <input
                type="text"
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="misal: Keraton Surakarta Hadiningrat"
                className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-brand-gold/25 text-white placeholder-canvas/30 focus:outline-none focus:border-brand-gold transition text-xs"
              />
            </div>
          </div>

          {/* 3. PEMILIHAN & PENGUNGGAHAN FOTO (Lokal Tanpa Batas) */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-canvas/90 font-semibold text-xs">
                  Foto Arsip Karya Seni <span className="text-red-400">*</span>:
                </label>
                <p className="text-[11px] text-canvas/60">
                  Unggah foto dari perangkat lokal Anda tanpa dibatasi preset. Mendukung format JPG, PNG, dan WebP (hingga 10 MB).
                </p>
              </div>

              {/* Source Mode Switcher Tabs */}
              <div className="flex bg-black/40 p-1 rounded-xl border border-brand-gold/20 self-start sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setSourceMode('upload')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1.5 ${
                    sourceMode === 'upload'
                      ? 'bg-brand-gold text-brand-green-dark shadow-sm'
                      : 'text-canvas/70 hover:text-white'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Unggah Berkas Lokal</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSourceMode('preset');
                    if (!image || image.startsWith('/uploads') || image.startsWith('blob:')) {
                      setImage(availablePresets[0].path);
                    }
                  }}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1.5 ${
                    sourceMode === 'preset'
                      ? 'bg-brand-gold text-brand-green-dark shadow-sm'
                      : 'text-canvas/70 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Preset Bawaan</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSourceMode('url')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1.5 ${
                    sourceMode === 'url'
                      ? 'bg-brand-gold text-brand-green-dark shadow-sm'
                      : 'text-canvas/70 hover:text-white'
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Tautan URL</span>
                </button>
              </div>
            </div>

            {/* Mode 1: Upload Berkas Lokal (Utama) */}
            {sourceMode === 'upload' && (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      onFileSelected(e.target.files[0]);
                    }
                  }}
                />

                {/* Dropzone area */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-6 md:p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                    dragActive
                      ? 'border-brand-gold bg-brand-gold/15 scale-[1.01]'
                      : localFile
                      ? 'border-emerald-500/50 bg-black/40 hover:bg-black/50'
                      : 'border-brand-gold/30 bg-black/30 hover:border-brand-gold/60 hover:bg-black/40'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-gold/20 border border-brand-gold/40 text-brand-gold flex items-center justify-center mb-3">
                    {isUploading ? (
                      <RefreshCw className="w-6 h-6 animate-spin text-brand-gold" />
                    ) : localFile ? (
                      <Check className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <UploadCloud className="w-6 h-6" />
                    )}
                  </div>

                  {localFile ? (
                    <div className="space-y-1">
                      <span className="font-semibold text-white text-xs block">
                        {localFile.name}
                      </span>
                      <span className="text-[10px] text-canvas/60 block">
                        Ukuran: {formatFileSize(localFile.size)} • Format: {localFile.type.split('/')[1]?.toUpperCase()}
                      </span>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-brand-gold underline hover:text-white">
                        Klik untuk mengganti foto lain dari komputer
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <span className="font-semibold text-white text-xs block">
                        Pilih foto dari komputer Anda atau seret berkas ke sini (Drag &amp; Drop)
                      </span>
                      <span className="text-[10px] text-canvas/60 block">
                        Resolusi tinggi disarankan • Mendukung JPG, PNG, WebP hingga 10 MB
                      </span>
                      <span className="inline-block mt-2 px-3 py-1 rounded-lg bg-brand-gold/20 text-brand-gold border border-brand-gold/40 text-[11px] font-semibold">
                        Jelajahi Berkas Komputer (Browse Files)
                      </span>
                    </div>
                  )}

                  {isUploading && (
                    <div className="mt-3 text-[11px] text-brand-gold flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Mengunggah foto ke penyimpanan server...</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mode 2: Preset Bawaan */}
            {sourceMode === 'preset' && (
              <div className="space-y-3">
                <select
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-brand-gold/25 text-white focus:outline-none focus:border-brand-gold transition text-xs"
                >
                  {availablePresets.map((img) => (
                    <option key={img.path} value={img.path}>
                      {img.label} — {img.desc} ({img.path})
                    </option>
                  ))}
                </select>

                {/* Quick Preset Thumbnails */}
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1">
                  {availablePresets.map((p) => {
                    const isSelected = image === p.path;
                    return (
                      <button
                        type="button"
                        key={p.path}
                        onClick={() => setImage(p.path)}
                        className={`aspect-square rounded-xl overflow-hidden border-2 transition relative group ${
                          isSelected
                            ? 'border-brand-gold scale-105 shadow-md shadow-brand-gold/30'
                            : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'
                        }`}
                        title={p.label}
                      >
                        <img src={p.path} alt={p.label} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-brand-gold/30 flex items-center justify-center">
                            <Check className="w-4 h-4 text-brand-green-dark bg-brand-gold rounded-full p-0.5" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mode 3: Tautan URL */}
            {sourceMode === 'url' && (
              <div className="space-y-2">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => {
                    setCustomUrl(e.target.value);
                    setImage(e.target.value);
                  }}
                  placeholder="https://example.com/foto-budaya-resolusi-tinggi.jpg"
                  className="w-full h-11 px-3.5 rounded-xl bg-black/40 border border-brand-gold/25 text-white placeholder-canvas/30 focus:outline-none focus:border-brand-gold transition text-xs"
                />
                <p className="text-[10px] text-canvas/50">
                  Gunakan URL publik yang dapat diakses langsung oleh browser tanpa otentikasi login khusus.
                </p>
              </div>
            )}

            {/* Live Visual Preview Container */}
            {effectiveImageUrl && (
              <div className="p-3.5 rounded-2xl bg-black/40 border border-brand-gold/25 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-36 h-28 rounded-xl overflow-hidden bg-black/60 border border-white/10 shrink-0 relative">
                  <img
                    src={effectiveImageUrl}
                    alt="Pratinjau Foto"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/tari-topeng-malangan.png';
                    }}
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-brand-gold font-mono">
                    Pratinjau
                  </span>
                </div>

                <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="font-semibold text-white text-xs">
                      {sourceMode === 'upload' && localFile
                        ? localFile.name
                        : sourceMode === 'preset'
                        ? availablePresets.find((p) => p.path === image)?.label || 'Preset Pilihan'
                        : 'Gambar Tautan URL'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-brand-gold/20 text-brand-gold border border-brand-gold/40">
                      {sourceMode === 'upload' ? 'Berkas Lokal' : sourceMode === 'preset' ? 'Arsip Bawaan' : 'Tautan Web'}
                    </span>
                  </div>

                  <p className="text-[11px] text-canvas/70 truncate font-mono">
                    Lokasi: {effectiveImageUrl}
                  </p>
                  <p className="text-[10px] text-emerald-400 flex items-center justify-center sm:justify-start gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Resolusi siap tayang di katalog budaya publik &amp; pameran admin.</span>
                  </p>
                </div>

                {sourceMode === 'upload' && localFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setLocalFile(null);
                      setLocalPreviewUrl('');
                      setImage('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-2 rounded-xl text-red-300 hover:text-white hover:bg-red-950/60 border border-red-500/20 transition self-center"
                    title="Batalkan & Hapus Foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 4. DESKRIPSI NARASI & FILOSOFI SEJARAH (Sangat Panjang & Detail) */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-canvas/90 font-semibold text-xs">
                  Deskripsi Narasi &amp; Filosofi Sejarah <span className="text-red-400">*</span>:
                </label>
                <p className="text-[11px] text-canvas/60">
                  Dapat diisi sangat panjang, multi-paragraf, dan memuat ulasan filosofis mendalam tanpa batasan karakter.
                </p>
              </div>

              {/* Kurator Template Helper Button */}
              <button
                type="button"
                onClick={insertNarrativeTemplate}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold border border-brand-gold/40 text-[11px] font-semibold transition shadow-sm"
                title="Sisipkan kerangka penulisan kuratorial baku"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sisipkan Kerangka Narasi Kurator</span>
              </button>
            </div>

            <div className="relative">
              <textarea
                rows={11}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan ulasan mendalam mengenai sejarah karya seni ini:&#10;&#10;1. Latar Belakang Sejarah & Masa Keraton...&#10;2. Makna Simbolis Ragam Gerak & Ornamen Busana...&#10;3. Filosofi Spiritual & Wejangan Luhur Tradisi...&#10;&#10;Semua paragraf dan baris baru akan tertata rapi saat ditampilkan di katalog publik."
                className="w-full p-4 rounded-2xl bg-black/40 border border-brand-gold/25 text-white placeholder-canvas/30 focus:outline-none focus:border-brand-gold transition text-xs sm:text-sm leading-relaxed resize-y font-sans min-h-[220px]"
              />

              {/* Live Counter Footer */}
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-canvas/50 px-1">
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-brand-gold/70" />
                  <span>Dukungan teks panjang aktif (format paragraf &amp; enter terjaga)</span>
                </span>
                <span className="font-mono text-brand-gold font-semibold">
                  {charCount.toLocaleString('id-ID')} karakter • {wordCount} kata
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-start gap-2 text-[10px] text-canvas/70">
              <Info className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                <strong className="text-white">Tip Kurator Budaya:</strong> Anda dapat menuliskan narasi sepanjang yang diperlukan. Di halaman pameran publik pengguna (<code className="text-brand-gold">/collection/[id]</code>), narasi ini ditampilkan dengan tipografi artikel warisan budaya yang nyaman dibaca oleh peneliti, budayawan, dan wisatawan.
              </span>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-1 h-12 bg-brand-gold hover:brightness-110 disabled:opacity-50 text-brand-green-dark font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Menyimpan ke Galeri...</span>
                </>
              ) : (
                <>
                  <span>Publikasikan Karya ke Galeri Budaya</span>
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                </>
              )}
            </button>
            <Link
              href="/admin/collection"
              className="px-6 h-12 bg-black/40 hover:bg-black/60 border border-brand-gold/20 text-canvas rounded-xl text-xs font-semibold flex items-center justify-center transition"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
