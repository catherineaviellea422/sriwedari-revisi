'use client';

import React, { useState, useEffect } from 'react';
import { SriwedariDB } from '@/lib/db';
import { TicketItem, EventItem } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';

export default function AdminPosPage() {
  const [activeTab, setActiveTab] = useState<'pos' | 'scanner'>('pos');
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [allTickets, setAllTickets] = useState<TicketItem[]>([]);

  // POS State
  const [customerName, setCustomerName] = useState('Pengunjung Loket Walk-in');
  const [customerPhone, setCustomerPhone] = useState('081200000000');
  const [quantity, setQuantity] = useState<number>(1);
  const [zone, setZone] = useState<'VIP' | 'REGULER' | 'BALKON'>('VIP');
  const [lastIssuedTicket, setLastIssuedTicket] = useState<TicketItem | null>(null);

  // Scanner State
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; ticket?: TicketItem } | null>(null);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('sriwedari_db_updated', handleUpdate);
    return () => window.removeEventListener('sriwedari_db_updated', handleUpdate);
  }, []);

  const loadData = () => {
    const evts = SriwedariDB.getEvents();
    setEvents(evts);
    if (evts.length > 0 && !selectedEventId) {
      setSelectedEventId(evts[0].id);
    }
    setAllTickets(SriwedariDB.getTickets());
  };

  const selectedEvent = events.find(e => e.id === selectedEventId) || events[0];
  const pricePerTicket = selectedEvent?.zonePrices
    ? selectedEvent.zonePrices[zone]
    : zone === 'VIP' ? 50000 : zone === 'REGULER' ? 35000 : 25000;
  const totalPrice = pricePerTicket * quantity;

  const handleIssueTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    const generatedSeats = Array.from({ length: quantity }, (_, i) => `LOK-${Math.floor(10 + Math.random() * 89)}`);

    const newTicket = SriwedariDB.bookTicket({
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      userName: customerName,
      userPhone: customerPhone,
      quantity,
      seats: generatedSeats,
      zone,
      totalPrice,
      status: 'Aktif',
    });

    setLastIssuedTicket(newTicket);
    loadData();
  };

  const handleScanTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;
    const res = SriwedariDB.validateGateTicket(scanInput.trim());
    setScanResult(res);
    loadData();
  };

  const handleQuickTestScan = (code: string) => {
    setScanInput(code);
    const res = SriwedariDB.validateGateTicket(code);
    setScanResult(res);
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold gold-gradient-text">
          Kasir Loket On-The-Spot (POS) &amp; Gate Ticket Scanner
        </h1>
        <p className="text-xs text-canvas/70 mt-0.5">
          Pelayanan tiket walk-in langsung di lokasi dan validasi kode gerbang pementasan teater
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#14382C]/80 p-1.5 rounded-2xl border border-brand-gold/20 max-w-md">
        <button
          onClick={() => setActiveTab('pos')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'pos'
              ? 'bg-brand-gold text-brand-green-dark shadow-sm'
              : 'text-canvas/70 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-base">point_of_sale</span>
          <span>Kasir Loket (POS)</span>
        </button>
        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'scanner'
              ? 'bg-brand-gold text-brand-green-dark shadow-sm'
              : 'text-canvas/70 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-base">qr_code_scanner</span>
          <span>Gate Scanner</span>
        </button>
      </div>

      {/* Tab 1: POS Loket */}
      {activeTab === 'pos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <form onSubmit={handleIssueTicket} className="p-6 rounded-3xl bg-[#14382C]/80 border border-brand-gold/20 space-y-4 text-xs">
            <h2 className="font-serif text-base font-bold gold-gradient-text">Cetak Tiket Walk-in</h2>

            <div>
              <label className="block text-canvas/80 mb-1">Pilihan Pementasan:</label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
              >
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title} ({e.date})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-canvas/80 mb-1">Nama Pembeli:</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
              />
            </div>

            <div>
              <label className="block text-canvas/80 mb-1">Nomor WhatsApp:</label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-canvas/80 mb-1">Zona Kursi:</label>
                <select
                  value={zone}
                  onChange={(e) => setZone(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
                >
                  <option value="VIP">VIP (Rp 50.000)</option>
                  <option value="REGULER">Reguler (Rp 35.000)</option>
                  <option value="BALKON">Balkon (Rp 25.000)</option>
                </select>
              </div>

              <div>
                <label className="block text-canvas/80 mb-1">Jumlah Tiket:</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl bg-black/40 border border-brand-gold/20 text-white"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/30 border border-brand-gold/15 flex items-center justify-between">
              <span className="text-canvas/70">Total Bayar:</span>
              <span className="font-bold text-base text-emerald-400 price">{formatRupiah(totalPrice)}</span>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-brand-gold text-brand-green-dark font-bold text-xs rounded-xl shadow-md hover:brightness-110 transition flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>Terbitkan Tiket &amp; Cetak Struk</span>
            </button>
          </form>

          {/* Thermal Receipt Preview */}
          <div className="p-6 rounded-3xl bg-white text-gray-900 border border-brand-gold/40 shadow-xl font-mono text-xs space-y-3">
            <div className="text-center border-b border-dashed border-gray-300 pb-3">
              <h3 className="font-bold text-sm tracking-widest">WAYANG ORANG SRIWEDARI</h3>
              <p className="text-[10px] text-gray-500">Jl. Slamet Riyadi No. 275 Surakarta</p>
              <p className="text-[10px] text-gray-500">Struk Tiket Resmi Pementasan</p>
            </div>

            {lastIssuedTicket ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>KODE BOOKING:</span>
                  <span className="font-bold text-brand-green">{lastIssuedTicket.bookingCode}</span>
                </div>
                <div className="flex justify-between">
                  <span>PENONTON:</span>
                  <span>{lastIssuedTicket.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span>ZONA &amp; KURSI:</span>
                  <span>{lastIssuedTicket.zone} ({lastIssuedTicket.seats?.join(', ')})</span>
                </div>
                <div className="flex justify-between border-t border-dashed border-gray-300 pt-2 font-bold text-sm">
                  <span>TOTAL LOKET:</span>
                  <span>{formatRupiah(lastIssuedTicket.totalPrice)}</span>
                </div>
                <p className="text-[10px] text-center text-gray-400 pt-2">
                  Tunjukkan kode tiket ini kepada staf penjaga pintu gerbang pementasan.
                </p>
              </div>
            ) : (
              <div className="py-10 text-center text-gray-400">
                <span className="material-symbols-outlined text-3xl mb-1">receipt</span>
                <p className="text-[11px]">Belum ada struk yang dicetak. Isi form di samping untuk menerbitkan tiket.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Gate Scanner */}
      {activeTab === 'scanner' && (
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-[#14382C]/80 border border-brand-gold/20 space-y-5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-green border border-brand-gold/40 flex items-center justify-center text-brand-gold mx-auto shadow-md">
            <span className="material-symbols-outlined text-3xl">qr_code_scanner</span>
          </div>

          <div>
            <h2 className="font-serif text-lg font-bold gold-gradient-text">
              Pemindai E-Tiket Gerbang Masuk
            </h2>
            <p className="text-xs text-canvas/70 mt-1">
              Masukkan atau scan kode booking tiket (contoh: SWD-RAMA-9921)
            </p>
          </div>

          <form onSubmit={handleScanTicket} className="space-y-3">
            <input
              type="text"
              required
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value.toUpperCase())}
              placeholder="Ketik kode tiket..."
              className="w-full h-12 text-center text-base font-mono uppercase tracking-widest bg-black/40 border border-brand-gold/30 rounded-2xl text-white focus:outline-none focus:border-brand-gold"
            />

            <button
              type="submit"
              className="w-full h-11 bg-brand-gold text-brand-green-dark font-bold text-xs rounded-xl shadow-md hover:brightness-110 transition flex items-center justify-center gap-1.5"
            >
              <span>Validasi Tiket Masuk</span>
              <span className="material-symbols-outlined text-base">verified</span>
            </button>
          </form>

          {scanResult && (
            <div
              className={`p-4 rounded-2xl border text-xs text-left ${
                scanResult.success
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                  : 'bg-red-950/80 border-red-500/50 text-red-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                <span className="material-symbols-outlined text-base">
                  {scanResult.success ? 'check_circle' : 'cancel'}
                </span>
                <span>{scanResult.message}</span>
              </div>
              {scanResult.ticket && (
                <div className="mt-2 text-[11px] space-y-0.5 opacity-90 border-t border-white/10 pt-2">
                  <p>Nama: <strong>{scanResult.ticket.userName}</strong></p>
                  <p>Pagelaran: {scanResult.ticket.eventTitle}</p>
                  <p>Kursi: {scanResult.ticket.seats?.join(', ')} ({scanResult.ticket.zone})</p>
                </div>
              )}
            </div>
          )}

          {/* Quick-test list of active tickets for demo presentation */}
          <div className="pt-4 border-t border-brand-gold/20 text-left space-y-2">
            <span className="text-[11px] font-bold text-brand-gold uppercase tracking-wider block">
              Daftar Tiket Terbit (1-Klik Uji Scanner):
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {allTickets.slice(0, 6).map((t) => (
                <div
                  key={t.id}
                  className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs hover:border-brand-gold/40 transition"
                >
                  <div>
                    <span className="font-mono font-bold text-brand-gold mr-2">{t.bookingCode}</span>
                    <span className="text-white font-medium">{t.userName}</span>
                    <span className={`ml-2 text-[10px] px-2 py-0.5 rounded-full ${
                      t.status === 'Check-in' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-blue-950 text-blue-300'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickTestScan(t.bookingCode)}
                    className="px-2.5 py-1 rounded-lg bg-brand-gold/20 hover:bg-brand-gold text-brand-gold hover:text-brand-green-dark text-[10px] font-bold transition"
                  >
                    Uji Scan
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
