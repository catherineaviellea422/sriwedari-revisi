'use client';

import React from 'react';
import { TicketItem } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';
import { X } from 'lucide-react';

interface TicketModalProps {
  ticket: TicketItem | null;
  onClose: () => void;
}

export default function TicketBoardingPassModal({ ticket, onClose }: TicketModalProps) {
  if (!ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl my-8">
        {/* Close Button */}
        <button
          aria-label="Tutup"
          onClick={onClose}
          className="absolute -top-3 -right-3 z-20 w-9 h-9 rounded-full bg-brand-gold text-brand-green-dark flex items-center justify-center shadow-xl hover:scale-105 transition"
          title="Tutup Modal"
        >
          <X className="w-4 h-4" strokeWidth={2.25} aria-hidden="true" />
        </button>

        {/* Printable Ticket Card */}
        <div id="printable-ticket" className="bg-[#FAF5E9] text-stone-900 rounded-3xl overflow-hidden shadow-2xl border-2 border-brand-gold/60 font-sans">
          {/* Header Keraton */}
          <div className="bg-brand-green text-canvas p-6 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 opacity-10 text-brand-gold">
              <span className="material-symbols-outlined text-9xl">temple_buddhist</span>
            </div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-gold text-brand-green-dark flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-2xl">theater_comedy</span>
                </div>
                <div>
                  <span className="text-[10px] tracking-widest text-brand-gold uppercase font-bold block">
                    Gedung Wayang Orang Sriwedari Surakarta
                  </span>
                  <h2 className="font-serif text-lg sm:text-xl font-bold gold-gradient-text">
                    PAS MASUK PAGELARAN BUDAYA
                  </h2>
                </div>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-brand-gold text-brand-green-dark uppercase tracking-wider">
                  Zona {ticket.zone}
                </span>
              </div>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6 space-y-5">
            {/* Event Title */}
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Lakon Pementasan</span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-green-dark">
                {ticket.eventTitle}
              </h3>
            </div>

            {/* Grid Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/80 border border-stone-200 text-xs">
              <div>
                <span className="text-stone-400 text-[10px] uppercase block">Pemesan</span>
                <span className="font-bold text-stone-800 block truncate">{ticket.userName}</span>
              </div>
              <div>
                <span className="text-stone-400 text-[10px] uppercase block">Nomor Kursi</span>
                <span className="font-bold text-brand-green text-sm block">
                  {ticket.seats && ticket.seats.length > 0 ? ticket.seats.join(', ') : 'A-01'}
                </span>
              </div>
              <div>
                <span className="text-stone-400 text-[10px] uppercase block">Jumlah</span>
                <span className="font-bold text-stone-800 block">{ticket.quantity} Kursi</span>
              </div>
              <div>
                <span className="text-stone-400 text-[10px] uppercase block">Status</span>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                  ticket.status === 'Check-in' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {ticket.status === 'Check-in' ? 'Sudah Masuk' : 'Sah / Valid'}
                </span>
              </div>
            </div>

            {/* Barcode & Booking Code Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#14382C] text-canvas border border-brand-gold/30">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] text-brand-gold font-semibold uppercase tracking-wider block">
                  Kode Boarding Pass Pintu Masuk
                </span>
                <span className="font-mono text-2xl font-black text-brand-gold tracking-widest block">
                  {ticket.bookingCode}
                </span>
                <span className="text-[10px] text-canvas/60 block">ID Tiket: {ticket.id} • Tunjukkan kode ini di loket gerbang</span>
              </div>

              {/* Visual Simulated QR / Barcode */}
              <div className="bg-white p-2.5 rounded-xl text-stone-900 flex flex-col items-center justify-center shrink-0 shadow">
                <div className="w-20 h-20 bg-stone-900 p-1 flex items-center justify-center rounded">
                  <div className="grid grid-cols-4 gap-1 w-full h-full bg-white p-1">
                    <div className="bg-stone-900 rounded-sm"></div>
                    <div className="bg-stone-900 rounded-sm"></div>
                    <div className="bg-stone-200"></div>
                    <div className="bg-stone-900 rounded-sm"></div>
                    <div className="bg-stone-200"></div>
                    <div className="bg-stone-900 rounded-sm"></div>
                    <div className="bg-stone-900 rounded-sm"></div>
                    <div className="bg-stone-200"></div>
                    <div className="bg-stone-900 rounded-sm"></div>
                    <div className="bg-stone-200"></div>
                    <div className="bg-stone-900 rounded-sm"></div>
                    <div className="bg-stone-900 rounded-sm"></div>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold mt-1 tracking-tighter">SCAN GATE</span>
              </div>
            </div>

            {/* Terms & Conditions */}
            <ul className="text-[10px] text-stone-500 leading-relaxed border-t border-dashed border-stone-300 pt-3 list-disc pl-4 space-y-0.5 marker:text-stone-400">
              <li>Pintu teater dibuka 30 menit sebelum pementasan dimulai. Harap tertib dan mematuhi etika busana keraton.</li>
              <li>Tiket digital ini sah sebagai bukti masuk resmi Wayang Orang Sriwedari Surakarta.</li>
            </ul>
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between gap-3">
            <div className="text-xs">
              <span className="text-stone-500 block">Total Pembayaran:</span>
              <span className="font-bold text-brand-green text-sm price">{formatRupiah(ticket.totalPrice)}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-200 text-xs font-semibold transition"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2 rounded-xl bg-brand-green hover:bg-brand-green-dark text-canvas text-xs font-bold transition flex items-center gap-1.5 shadow-md"
              >
                <span className="material-symbols-outlined text-base">print</span>
                <span>Cetak / Unduh PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
