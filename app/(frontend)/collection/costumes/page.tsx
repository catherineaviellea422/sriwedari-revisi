'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SriwedariDB } from '@/lib/db';
import { CostumeItem } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';

export default function CostumesCatalogPage() {
  const [costumes, setCostumes] = useState<CostumeItem[]>([]);

  useEffect(() => {
    setCostumes(SriwedariDB.getCostumes());
    const handleUpdate = () => setCostumes(SriwedariDB.getCostumes());
    window.addEventListener('sriwedari_db_updated', handleUpdate);
    return () => window.removeEventListener('sriwedari_db_updated', handleUpdate);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="font-serif text-lg font-bold text-primary">
            Katalog Busana Adat
          </h1>
          <p className="text-[11px] text-on-surface-variant">
            Koleksi busana asli sanggar Sriwedari Surakarta
          </p>
        </div>

        <Link
          href="/bookings"
          className="px-3 py-1.5 rounded-xl bg-brand-gold text-brand-green-dark text-xs font-bold hover:brightness-110 transition flex items-center gap-1 shadow-sm shrink-0"
        >
          <span className="material-symbols-outlined text-sm">receipt_long</span>
          <span>Form Sewa</span>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-3.5">
        {costumes.map((costume) => (
          <div
            key={costume.id}
            className="group bg-surface-container-low rounded-2xl border border-divider overflow-hidden hover:shadow-card-warm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[4/3] relative overflow-hidden bg-black/10">
                <img
                  src={costume.image}
                  alt={costume.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-brand-green-dark/80 backdrop-blur-sm text-brand-gold text-[10px] font-semibold">
                  {costume.category}
                </span>
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-emerald-300 text-[10px] font-semibold">
                  Stok: {costume.stock} set
                </span>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  <span className="material-symbols-outlined text-sm">star</span>
                  <span className="font-bold">{costume.rating}</span>
                  <span className="text-[10px] text-on-surface-variant">({costume.reviewCount || 24} ulasan)</span>
                </div>

                <h3 className="font-serif text-base font-bold text-primary group-hover:text-brand-green transition line-clamp-1">
                  {costume.name}
                </h3>
                <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
                  {costume.description}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {costume.sizes.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-white border border-divider text-[10px] font-medium text-on-surface-variant">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 pt-2 border-t border-divider flex items-center justify-between">
              <div>
                <span className="text-[10px] text-on-surface-variant block">Tarif Sewa:</span>
                <span className="font-bold text-sm text-brand-green price">
                  {formatRupiah(costume.price)}
                </span>
                <span className="text-[10px] text-on-surface-variant">/hari</span>
              </div>

              <Link
                href={`/bookings?costumeId=${costume.id}`}
                className="px-3.5 py-2 rounded-xl bg-brand-green hover:bg-brand-green-dark text-canvas font-semibold text-xs shadow-sm transition flex items-center gap-1"
              >
                <span>Sewa Busana</span>
                <span className="material-symbols-outlined text-sm">shopping_bag</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
