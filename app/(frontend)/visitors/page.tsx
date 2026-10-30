'use client';

import React, { useEffect, useState } from 'react';
import { SriwedariDB } from '@/lib/db';
import { EventItem } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { formatRupiah } from '@/lib/utils';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function VisitorsSchedulePage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  
  // Seat modal state
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedZone, setSelectedZone] = useState<'VIP' | 'REGULER' | 'BALKON'>('VIP');
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [userName, setUserName] = useState(user ? user.name : 'Oliv Satoro');
  const [userPhone, setUserPhone] = useState(user ? user.phone : '081234567890');
  const [bookedSuccess, setBookedSuccess] = useState<boolean>(false);

  useEffect(() => {
    setEvents(SriwedariDB.getEvents());
    const handleUpdate = () => setEvents(SriwedariDB.getEvents());
    window.addEventListener('sriwedari_db_updated', handleUpdate);
    return () => window.removeEventListener('sriwedari_db_updated', handleUpdate);
  }, []);

  const openSeatModal = (evt: EventItem) => {
    setSelectedEvent(evt);
    setBookedSeats(SriwedariDB.getBookedSeats(evt.id));
    setSelectedSeats([]);
    setBookedSuccess(false);
  };

  const toggleSeat = (seatId: string) => {
    if (bookedSeats.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length >= 4) {
        alert('Maksimal pemesanan 4 kursi per transaksi!');
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const zoneTariff = selectedEvent?.zonePrices
    ? selectedEvent.zonePrices[selectedZone]
    : selectedEvent?.price || 50000;
  const totalPrice = zoneTariff * (selectedSeats.length || 1);

  const [errorMessage, setErrorMessage] = useState('');

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    setErrorMessage('');

    if (selectedSeats.length === 0) {
      setErrorMessage('Silakan pilih minimal satu nomor kursi pada denah pementasan!');
      return;
    }

    const finalSeats = selectedSeats;

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          eventTitle: selectedEvent.title,
          userName,
          userPhone,
          quantity: finalSeats.length,
          seats: finalSeats,
          zone: selectedZone,
          totalPrice: zoneTariff * finalSeats.length,
          status: 'Aktif',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Terjadi benturan pemilihan kursi dengan penonton lain!');
        // Refresh booked seats from server
        const refreshRes = await fetch(`/api/tickets?eventId=${selectedEvent.id}`);
        const refreshData = await refreshRes.json();
        if (refreshData.bookedSeats) {
          setBookedSeats(refreshData.bookedSeats);
        }
        return;
      }

      // Re-sync local state from server
      await SriwedariDB.syncFromServer();
      setBookedSuccess(true);
    } catch {
      setErrorMessage('Koneksi server terputus. Silakan coba kembali.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="font-serif text-lg font-bold text-primary flex items-center gap-1.5">
            <span>Jadwal Pagelaran</span>
          </h1>
          <p className="text-[11px] text-on-surface-variant">
            Pentas Wayang Orang Sriwedari
          </p>
        </div>

        <Link
          href="/visitors/today"
          className="px-3 py-1.5 rounded-xl bg-brand-gold text-brand-green-dark text-xs font-bold hover:brightness-110 transition flex items-center gap-1 shadow-sm shrink-0"
        >
          <span className="material-symbols-outlined text-sm">today</span>
          <span>Hari Ini</span>
        </Link>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 gap-4">
        {events.map((evt) => {
          const sisaKuota = Math.max(0, evt.quota - (evt.booked || 0));
          return (
            <div
              key={evt.id}
              className="bg-surface-container-low rounded-3xl border border-divider overflow-hidden hover:shadow-card-warm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/9] relative overflow-hidden bg-black/10">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-brand-green-dark/85 backdrop-blur-sm text-brand-gold text-[11px] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">event</span>
                    <span>{evt.date}</span>
                  </div>
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm text-canvas text-[11px] font-semibold">
                    {evt.time}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-serif text-lg font-bold text-primary line-clamp-2">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-brand-green">pin_drop</span>
                    <span>{evt.location}</span>
                  </p>
                  <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="p-3 rounded-2xl bg-white border border-divider flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-on-surface-variant block">Sisa Kursi:</span>
                      <span className="font-bold text-primary">{sisaKuota} dari {evt.quota}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-on-surface-variant block">Mulai Dari:</span>
                      <span className="font-bold text-brand-green price">
                        {formatRupiah(evt.zonePrices?.BALKON || evt.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => openSeatModal(evt)}
                  className="w-full h-11 bg-brand-green hover:bg-brand-green-dark text-canvas font-semibold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">event_seat</span>
                  <span>Pilih Kursi &amp; Pesan Tiket</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Interactive Seat Selection */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-low border border-brand-gold/30 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative">
            <button
              aria-label="Tutup"
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface border border-divider flex items-center justify-center text-on-surface hover:bg-surface-container"
            >
              <X className="w-4 h-4" strokeWidth={2.25} aria-hidden="true" />
            </button>

            {bookedSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-3xl">check</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-primary">Tiket Berhasil Dipesan!</h3>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                  E-tiket pagelaran dengan kode booking telah tercatat dan dapat dilihat pada halaman profil Anda.
                </p>
                <div className="flex gap-2 justify-center pt-2">
                  <Link
                    href="/profile"
                    className="px-4 py-2 rounded-xl bg-brand-green text-canvas text-xs font-semibold"
                  >
                    Buka E-Tiket Saya
                  </Link>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="px-4 py-2 rounded-xl bg-surface border border-divider text-xs font-semibold"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green">Denah Kursi Wayang Orang</span>
                  <h3 className="font-serif text-lg font-bold text-primary">{selectedEvent.title}</h3>
                </div>

                {/* Stage Canvas */}
                <div className="p-3 bg-brand-green-dark text-canvas rounded-2xl text-center border border-brand-gold/30">
                  <span className="font-serif text-xs font-bold gold-gradient-text tracking-widest block">
                    — AREA PANGGUNG UTAMA &amp; KELIR WAYANG —
                  </span>
                  <span className="text-[10px] text-canvas/50">Gamelan Ageng &amp; Sinden</span>
                </div>

                {/* Zone Picker */}
                <div className="flex gap-2">
                  {(['VIP', 'REGULER', 'BALKON'] as const).map((z) => (
                    <button
                      key={z}
                      type="button"
                      onClick={() => setSelectedZone(z)}
                      className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold transition ${
                        selectedZone === z
                          ? 'bg-brand-gold text-brand-green-dark border-brand-gold font-bold shadow-sm'
                          : 'bg-white border-divider text-on-surface-variant'
                      }`}
                    >
                      {z} ({formatRupiah(selectedEvent.zonePrices?.[z] || selectedEvent.price)})
                    </button>
                  ))}
                </div>

                {/* Seat Matrix Visualizer */}
                <div className="p-4 rounded-2xl bg-white border border-divider">
                  <p className="text-[11px] text-on-surface-variant text-center mb-3">
                    Klik kursi untuk memilih (Maksimal 4 kursi):
                  </p>
                  <div className="grid grid-cols-6 gap-2 max-w-sm mx-auto">
                    {['A-01', 'A-02', 'A-03', 'A-04', 'A-05', 'A-06', 'B-01', 'B-02', 'B-03', 'B-04', 'B-05', 'B-06'].map((seat) => {
                      const isTaken = bookedSeats.includes(seat);
                      const isSelected = selectedSeats.includes(seat);
                      return (
                        <button
                          key={seat}
                          type="button"
                          disabled={isTaken}
                          onClick={() => toggleSeat(seat)}
                          className={`h-9 rounded-lg text-[10px] font-bold font-mono transition ${
                            isTaken
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                              : isSelected
                              ? 'bg-brand-green text-canvas border border-brand-green scale-105 shadow-sm'
                              : 'bg-surface-container border border-divider hover:border-brand-gold text-on-surface'
                          }`}
                        >
                          {seat}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-center gap-4 text-[10px] text-on-surface-variant mt-4 pt-3 border-t border-divider">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-surface-container border border-divider" /> Tersedia
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-brand-green" /> Dipilih ({selectedSeats.length})
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-gray-300" /> Terisi
                    </span>
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-on-surface-variant mb-1">Nama Pemesan:</label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl bg-white border border-divider"
                    />
                  </div>
                  <div>
                    <label className="block text-on-surface-variant mb-1">WhatsApp:</label>
                    <input
                      type="tel"
                      required
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      className="w-full h-9 px-3 rounded-xl bg-white border border-divider"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-container flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant">Total Tagihan ({selectedSeats.length || 1} Tiket):</span>
                  <span className="font-bold text-sm text-brand-green price">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-red-600">warning</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full h-11 bg-brand-gold text-brand-green-dark font-bold text-xs rounded-xl shadow-md hover:brightness-110 transition flex items-center justify-center gap-1.5"
                >
                  <span>Konfirmasi Reservasi Kursi</span>
                  <span className="material-symbols-outlined text-base">check</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
