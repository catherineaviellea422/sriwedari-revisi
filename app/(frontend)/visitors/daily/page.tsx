import React from 'react';
import Link from 'next/link';

export default function VisitorsDailySchedulePage() {
  const dailySchedule = [
    { time: '08:00 - 15:00', title: 'Wisata Budaya & Eksplorasi Galeri Pusaka Sriwedari', loc: 'Gedung Pameran Utama', status: 'Buka Bebas' },
    { time: '15:30 - 17:30', title: 'Latihan Tari Klasik Surakarta & Gamelan Ageng (Terbuka untuk Umum)', loc: 'Pendopo Ageng Sasana Mulya', status: 'Sesi Latihan' },
    { time: '19:00 - 19:45', title: 'Pembukaan Loket Gerbang & Penukaran E-Tiket Kursi Panggung', loc: 'Loket Gerbang Timur & Barat', status: 'Loket Buka' },
    { time: '20:00 - 22:30', title: 'Pagelaran Wayang Orang Sriwedari (Lakon Utama)', loc: 'Gedung Wayang Orang (GWO)', status: 'Pementasan Utama' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/visitors"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-green hover:underline"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Kembali ke Jadwal Lakon</span>
        </Link>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-green/10 text-brand-green border border-brand-green/20">
          Rangkaian Harian (Daily Agenda)
        </span>
      </div>

      <div>
        <h1 className="font-serif text-lg font-bold text-primary">
          Rangkaian Acara Budaya Harian (Daily Schedule)
        </h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Jadwal kunjungan galeri, latihan tari terbuka sanggar, dan pementasan wayang orang setiap hari
        </p>
      </div>

      <div className="space-y-3">
        {dailySchedule.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-surface-container-low border border-divider shadow-sm flex flex-col gap-2.5"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">schedule</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-mono text-xs font-bold text-brand-green block">{item.time} WIB</span>
                <h3 className="font-serif text-sm font-bold text-primary mt-0.5 leading-snug">{item.title}</h3>
                <span className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-xs">location_on</span>
                  <span className="truncate">{item.loc}</span>
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-divider/60 flex items-center justify-between">
              <span className="text-[10px] text-on-surface-variant">Status Akses:</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white border border-divider text-on-surface-variant shadow-xs">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-brand-green text-canvas flex flex-col gap-3 shadow-card-warm">
        <div>
          <h3 className="font-serif text-base font-bold gold-gradient-text leading-snug">Ingin Menonton Pementasan Malam Ini?</h3>
          <p className="text-xs text-canvas/80 mt-0.5">Pesan kursi terbaik Anda dari denah interaktif Wayang Orang Sriwedari.</p>
        </div>
        <Link
          href="/visitors"
          className="w-full py-2.5 rounded-xl bg-brand-gold text-brand-green-dark font-bold text-xs hover:brightness-110 transition shadow-md flex items-center justify-center gap-1.5"
        >
          <span>Pilih Kursi &amp; Tiket</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
