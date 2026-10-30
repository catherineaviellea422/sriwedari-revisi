'use client';

import React, { useEffect, useState } from 'react';
import { SriwedariDB } from '@/lib/db';
import { EventItem } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';
import { X } from 'lucide-react';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [search, setSearch] = useState('');
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formLocation, setFormLocation] = useState('Gedung Wayang Orang Sriwedari Surakarta');
  const [formPrice, setFormPrice] = useState(75000);
  const [formQuota, setFormQuota] = useState(150);
  const [formBooked, setFormBooked] = useState(0);
  const [formVip, setFormVip] = useState(150000);
  const [formReguler, setFormReguler] = useState(75000);
  const [formBalkon, setFormBalkon] = useState(50000);
  const [formImage, setFormImage] = useState('/images/tari-jawa-dramatic-stage.png');
  const [formDescription, setFormDescription] = useState('');

  useEffect(() => {
    loadEvents();
    const handleUpdate = () => loadEvents();
    window.addEventListener('sriwedari_db_updated', handleUpdate);
    return () => window.removeEventListener('sriwedari_db_updated', handleUpdate);
  }, []);

  const loadEvents = () => {
    setEvents(SriwedariDB.getEvents());
  };

  const openCreateModal = () => {
    setIsCreating(true);
    setEditingEvent(null);
    setFormTitle('');
    setFormDate(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
    setFormTime('19:30 - 22:30 WIB');
    setFormLocation('Gedung Wayang Orang Sriwedari Surakarta');
    setFormPrice(75000);
    setFormQuota(150);
    setFormBooked(0);
    setFormVip(150000);
    setFormReguler(75000);
    setFormBalkon(50000);
    setFormImage('/images/tari-jawa-dramatic-stage.png');
    setFormDescription('Pagelaran wayang orang adiluhung dengan tata panggung dramatis, gamelan ageng live, dan para penari pakem keraton.');
  };

  const openEditModal = (evt: EventItem) => {
    setEditingEvent(evt);
    setIsCreating(false);
    setFormTitle(evt.title);
    setFormDate(evt.date);
    setFormTime(evt.time);
    setFormLocation(evt.location);
    setFormPrice(evt.price);
    setFormQuota(evt.quota);
    setFormBooked(evt.booked || 0);
    setFormVip(evt.zonePrices?.VIP || 150000);
    setFormReguler(evt.zonePrices?.REGULER || evt.price || 75000);
    setFormBalkon(evt.zonePrices?.BALKON || 50000);
    setFormImage(evt.image || '/images/tari-jawa-dramatic-stage.png');
    setFormDescription(evt.description || '');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const eventPayload: EventItem = {
      id: editingEvent ? editingEvent.id : 'evt-' + Date.now(),
      title: formTitle.trim(),
      date: formDate,
      time: formTime,
      location: formLocation,
      price: formPrice,
      quota: formQuota,
      booked: formBooked,
      image: formImage,
      description: formDescription,
      zonePrices: {
        VIP: formVip,
        REGULER: formReguler,
        BALKON: formBalkon,
      },
    };

    SriwedariDB.saveEvent(eventPayload);
    setIsCreating(false);
    setEditingEvent(null);
    loadEvents();
  };

  const handleDelete = (id: string) => {
    SriwedariDB.deleteEvent(id);
    setDeleteConfirmId(null);
    loadEvents();
  };

  const totalSeats = events.reduce((acc, e) => acc + e.quota, 0);
  const totalBooked = events.reduce((acc, e) => acc + (e.booked || 0), 0);
  const occupancyPercent = totalSeats > 0 ? Math.round((totalBooked / totalSeats) * 100) : 0;

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold gold-gradient-text">
            Manajemen Jadwal Pementasan &amp; Loket Teater
          </h1>
          <p className="text-xs text-canvas/70 mt-0.5">
            Atur lakon Wayang Wong Sriwedari, kapasitas kuota kursi per zona, dan tarif tiket masuk
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-brand-gold hover:bg-yellow-500 text-brand-green-dark font-bold text-xs shadow-md transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          <span>Tambah Jadwal Baru</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#14382C]/80 border border-brand-gold/20">
          <span className="text-[10px] text-canvas/60 block uppercase">Jadwal Aktif</span>
          <span className="font-serif text-2xl font-bold text-white">{events.length} Pementasan</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#14382C]/80 border border-brand-gold/20">
          <span className="text-[10px] text-canvas/60 block uppercase">Total Kuota Kursi</span>
          <span className="font-serif text-2xl font-bold text-brand-gold">{totalSeats} Kursi</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#14382C]/80 border border-brand-gold/20">
          <span className="text-[10px] text-canvas/60 block uppercase">Kursi Terpesan</span>
          <span className="font-serif text-2xl font-bold text-emerald-400">{totalBooked} Penonton</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#14382C]/80 border border-brand-gold/20">
          <span className="text-[10px] text-canvas/60 block uppercase">Tingkat Okupansi</span>
          <span className="font-serif text-2xl font-bold text-purple-400">{occupancyPercent}%</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-canvas/40 text-lg">
          search
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari judul lakon pementasan atau lokasi gedung..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#14382C]/60 border border-brand-gold/20 text-xs text-white placeholder:text-canvas/40 focus:outline-none focus:border-brand-gold"
        />
      </div>

      {/* Events Table */}
      <div className="rounded-3xl bg-[#14382C]/80 border border-brand-gold/20 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-black/40 text-canvas/60 uppercase text-[10px] tracking-wider border-b border-brand-gold/20">
            <tr>
              <th className="py-3.5 px-4">Lakon &amp; Tanggal</th>
              <th className="py-3.5 px-4">Waktu &amp; Lokasi</th>
              <th className="py-3.5 px-4">Tarif Zona (VIP / Reg / Balkon)</th>
              <th className="py-3.5 px-4">Okupansi Kuota</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-canvas/50">
                  Tidak ada jadwal pementasan yang cocok.
                </td>
              </tr>
            ) : (
              filtered.map((evt) => {
                const occupancy = evt.quota > 0 ? Math.round(((evt.booked || 0) / evt.quota) * 100) : 0;
                return (
                  <tr key={evt.id} className="hover:bg-white/5 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={evt.image}
                          alt={evt.title}
                          className="w-12 h-12 rounded-xl object-cover border border-brand-gold/30 shrink-0"
                        />
                        <div>
                          <span className="font-serif font-bold text-white block text-sm">{evt.title}</span>
                          <span className="text-[10px] text-brand-gold">{evt.date}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-white font-medium block">{evt.time}</span>
                      <span className="text-[10px] text-canvas/60">{evt.location}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 text-[11px]">
                        <span className="text-brand-gold block">VIP: {formatRupiah(evt.zonePrices?.VIP || 150000)}</span>
                        <span className="text-canvas/80 block">Reg: {formatRupiah(evt.zonePrices?.REGULER || evt.price)}</span>
                        <span className="text-canvas/50 block">Balkon: {formatRupiah(evt.zonePrices?.BALKON || 50000)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-32 space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-white font-medium">{evt.booked || 0} / {evt.quota}</span>
                          <span className="text-brand-gold font-bold">{occupancy}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${Math.min(100, occupancy)}%` }}
                            className="h-full bg-brand-gold rounded-full"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(evt)}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-brand-gold text-xs font-semibold transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(evt.id)}
                          className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-semibold border border-red-500/20 transition"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      {(isCreating || editingEvent) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#14382C] border border-brand-gold/40 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative text-canvas my-8">
            <button
              aria-label="Tutup"
              onClick={() => {
                setIsCreating(false);
                setEditingEvent(null);
              }}
              className="flex items-center justify-center absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 text-canvas hover:text-white"
            >
              <X className="w-4 h-4" strokeWidth={2.25} aria-hidden="true" />
            </button>

            <div>
              <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider block">
                {isCreating ? 'Tambah Jadwal Pentas Baru' : 'Perbarui Jadwal Pementasan'}
              </span>
              <h3 className="font-serif text-lg font-bold text-white">
                {isCreating ? 'Formulir Lakon Wayang Wong' : `Ubah Jadwal: ${editingEvent?.title}`}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-canvas/80 mb-1 font-medium">Judul Lakon Pementasan:</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: Lakon Wayang Wong: Ramayana Tambak"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-brand-gold/30 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-canvas/80 mb-1 font-medium">Tanggal Pentas:</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-brand-gold/30 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-canvas/80 mb-1 font-medium">Jam Pelaksanaan:</label>
                  <input
                    type="text"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="19:30 - 22:30 WIB"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-brand-gold/30 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-canvas/80 mb-1 font-medium">Lokasi / Gedung:</label>
                <input
                  type="text"
                  required
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-brand-gold/30 text-white focus:outline-none"
                />
              </div>

              {/* Quota & Prices */}
              <div className="p-3.5 rounded-2xl bg-black/30 border border-brand-gold/20 space-y-3">
                <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider block">
                  Kuota &amp; Tarif Tiket Masuk Berdasarkan Zona
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-canvas/70 text-[10px] mb-1">Total Kuota Kursi:</label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={formQuota}
                      onChange={(e) => setFormQuota(parseInt(e.target.value) || 0)}
                      className="w-full px-2.5 py-2 rounded-lg bg-black/40 border border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-canvas/70 text-[10px] mb-1">Tarif VIP (Rp):</label>
                    <input
                      type="number"
                      required
                      step={5000}
                      value={formVip}
                      onChange={(e) => setFormVip(parseInt(e.target.value) || 0)}
                      className="w-full px-2.5 py-2 rounded-lg bg-black/40 border border-white/20 text-brand-gold font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-canvas/70 text-[10px] mb-1">Tarif Reguler (Rp):</label>
                    <input
                      type="number"
                      required
                      step={5000}
                      value={formReguler}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setFormReguler(val);
                        setFormPrice(val);
                      }}
                      className="w-full px-2.5 py-2 rounded-lg bg-black/40 border border-white/20 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-canvas/70 text-[10px] mb-1">Tarif Balkon (Rp):</label>
                    <input
                      type="number"
                      required
                      step={5000}
                      value={formBalkon}
                      onChange={(e) => setFormBalkon(parseInt(e.target.value) || 0)}
                      className="w-full px-2.5 py-2 rounded-lg bg-black/40 border border-white/20 text-white font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Image Picker */}
              <div>
                <label className="block text-canvas/80 mb-1 font-medium">Gambar Teater Panggung:</label>
                <select
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-brand-gold/30 text-white focus:outline-none"
                >
                  <option value="/images/tari-jawa-dramatic-stage.png">Panggung Wayang Orang Sriwedari (Utama)</option>
                  <option value="/images/wayang-orang.png">Wayang Orang Klasik Keraton</option>
                  <option value="/images/tari-kecak.png">Tari Kolosal Panggung Luar</option>
                  <option value="/images/tari-topeng-malangan.png">Seni Tari Topeng</option>
                  <option value="/images/tari-gandrung-banyuwangi.png">Tari Gandrung</option>
                  <option value="/images/tari-bedhaya-ketawang.png">Tari Bedhaya Ketawang Sakral</option>
                </select>
              </div>

              <div>
                <label className="block text-canvas/80 mb-1 font-medium">Sinopsis &amp; Deskripsi Lakon:</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Kisah adiluhung pertempuran Rama Wijaya dan Rahwana..."
                  className="w-full p-3 rounded-xl bg-black/40 border border-brand-gold/30 text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 h-11 bg-brand-gold hover:bg-yellow-500 text-brand-green-dark font-bold text-xs rounded-xl shadow-md transition"
                >
                  {isCreating ? 'Simpan Jadwal Pentas' : 'Perbarui Jadwal Pentas'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingEvent(null);
                  }}
                  className="px-5 h-11 bg-black/40 border border-brand-gold/20 text-canvas rounded-xl text-xs"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14382C] border border-red-500/40 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative text-canvas">
            <h3 className="font-serif text-base font-bold text-white">
              Hapus Jadwal Pementasan?
            </h3>
            <p className="text-xs text-canvas/70 leading-relaxed">
              Tindakan ini akan menghapus jadwal pementasan dari sistem reservasi dan loket gerbang.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow"
              >
                Ya, Hapus Jadwal
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-xs text-canvas hover:text-white"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
