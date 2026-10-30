'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SriwedariDB } from '@/lib/db';
import { OrderItem, TicketItem, CostumeItem, GalleryItem } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';

interface SearchResultItem {
  id: string;
  category: 'Pesanan' | 'Tiket' | 'Busana' | 'Koleksi' | 'Pintasan';
  title: string;
  subtitle: string;
  badge?: string;
  href: string;
  icon: string;
}

const ADMIN_SHORTCUTS: SearchResultItem[] = [
  { id: 'sc-pos', category: 'Pintasan', title: 'Buka Kasir Loket (POS)', subtitle: 'Transaksi langsung tiket dan sewa busana di tempat', href: '/admin/pos', icon: 'point_of_sale' },
  { id: 'sc-events', category: 'Pintasan', title: 'Kelola Jadwal Pentas (Events)', subtitle: 'Atur lakon Wayang Wong, kuota kursi, dan tarif zona', href: '/admin/events', icon: 'theater_comedy' },
  { id: 'sc-bookings', category: 'Pintasan', title: 'Pesanan Sewa & QC Retur', subtitle: 'Verifikasi slip transfer dan inspeksi kondisi busana', href: '/admin/bookings', icon: 'receipt_long' },
  { id: 'sc-collection', category: 'Pintasan', title: 'Arsip Koleksi Pusaka Seni', subtitle: 'Kurasi katalog karya seni, foto pusaka, dan ornamen', href: '/admin/collection', icon: 'photo_library' },
  { id: 'sc-coupons', category: 'Pintasan', title: 'Manajemen Kupon Diskon', subtitle: 'Buat dan atur kode promo pelestari budaya', href: '/admin/coupons', icon: 'loyalty' },
  { id: 'sc-audit', category: 'Pintasan', title: 'Audit Trail Keamanan', subtitle: 'Rekam jejak aktivitas operasional dan transaksi', href: '/admin/audit', icon: 'security' },
  { id: 'sc-users', category: 'Pintasan', title: 'Kelola Pengguna & Hak Akses', subtitle: 'Daftar penikmat seni dan staf kurator', href: '/admin/account', icon: 'manage_accounts' },
  { id: 'sc-settings', category: 'Pintasan', title: 'Pengaturan Sanggar & Reset DB', subtitle: 'Atur profil galeri dan pemeliharaan database', href: '/admin/settings', icon: 'settings' },
];

export default function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Search logic
  const getResults = (): SearchResultItem[] => {
    if (!query.trim()) {
      return ADMIN_SHORTCUTS;
    }

    const q = query.toLowerCase().trim();
    const results: SearchResultItem[] = [];

    // Search shortcuts
    ADMIN_SHORTCUTS.forEach((sc) => {
      if (sc.title.toLowerCase().includes(q) || sc.subtitle.toLowerCase().includes(q)) {
        results.push(sc);
      }
    });

    // Search Orders
    try {
      const orders = SriwedariDB.getOrders();
      orders.forEach((o) => {
        if (
          o.id.toLowerCase().includes(q) ||
          o.userName.toLowerCase().includes(q) ||
          o.costumeName.toLowerCase().includes(q) ||
          o.userPhone.includes(q)
        ) {
          results.push({
            id: o.id,
            category: 'Pesanan',
            title: `${o.id} — ${o.userName}`,
            subtitle: `${o.costumeName} • ${formatRupiah(o.totalPrice)} • Status: ${o.status}`,
            badge: o.status,
            href: '/admin/bookings',
            icon: 'receipt_long',
          });
        }
      });
    } catch {}

    // Search Tickets
    try {
      const tickets = SriwedariDB.getTickets();
      tickets.forEach((t) => {
        if (
          t.bookingCode.toLowerCase().includes(q) ||
          t.userName.toLowerCase().includes(q) ||
          t.eventTitle.toLowerCase().includes(q)
        ) {
          results.push({
            id: t.id,
            category: 'Tiket',
            title: `Tiket ${t.bookingCode} — ${t.userName}`,
            subtitle: `${t.eventTitle} (Zona ${t.zone}, ${t.quantity} Kursi) • ${t.status}`,
            badge: `Zona ${t.zone}`,
            href: '/admin/events',
            icon: 'confirmation_number',
          });
        }
      });
    } catch {}

    // Search Costumes
    try {
      const costumes = SriwedariDB.getCostumes();
      costumes.forEach((c) => {
        if (c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)) {
          results.push({
            id: c.id,
            category: 'Busana',
            title: c.name,
            subtitle: `${c.category} • Sewa: ${formatRupiah(c.price)}/hari`,
            badge: `${c.stock} Set`,
            href: '/admin/collection',
            icon: 'checkroom',
          });
        }
      });
    } catch {}

    return results.slice(0, 8);
  };

  const results = getResults();

  const handleSelect = (item: SearchResultItem) => {
    setIsOpen(false);
    router.push(item.href);
  };

  const handleKeyNav = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    }
  };

  return (
    <>
      {/* Trigger Button displayed in Header */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 border border-brand-gold/30 text-xs text-canvas/70 hover:text-white transition shadow-sm"
        title="Buka Pencarian Cepat (Ctrl+K)"
      >
        <span className="material-symbols-outlined text-sm text-brand-gold">search</span>
        <span className="font-medium">Cari invoice, tiket, pusaka...</span>
        <kbd className="px-1.5 py-0.5 rounded bg-brand-gold/20 text-brand-gold border border-brand-gold/30 text-[10px] font-mono">
          Ctrl K
        </kbd>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="bg-[#14382C] border-2 border-brand-gold/50 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Input Header */}
            <div className="p-4 border-b border-brand-gold/20 flex items-center gap-3 bg-black/30">
              <span className="material-symbols-outlined text-brand-gold text-2xl">search</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyNav}
                placeholder="Ketik kode invoice, nama penyewa, tiket, atau lakon pentas..."
                className="w-full bg-transparent text-sm text-white placeholder:text-canvas/40 focus:outline-none"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-canvas text-[11px]"
              >
                ESC
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-96 overflow-y-auto p-2 divide-y divide-white/5">
              {results.length === 0 ? (
                <div className="py-10 text-center text-xs text-canvas/50">
                  Tidak ada data yang cocok dengan &ldquo;{query}&rdquo;
                </div>
              ) : (
                results.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id + index}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`p-3 rounded-2xl cursor-pointer flex items-center justify-between gap-3 transition ${
                        isSelected
                          ? 'bg-brand-gold/20 border border-brand-gold text-white'
                          : 'hover:bg-white/5 text-canvas/80'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-brand-gold text-brand-green-dark' : 'bg-black/30 text-brand-gold'
                        }`}>
                          <span className="material-symbols-outlined text-lg">{item.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-white truncate block">
                              {item.title}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/10 text-brand-gold border border-brand-gold/30">
                              {item.category}
                            </span>
                          </div>
                          <span className="text-[10px] text-canvas/60 truncate block mt-0.5">
                            {item.subtitle}
                          </span>
                        </div>
                      </div>

                      {item.badge && (
                        <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-brand-green text-brand-gold border border-brand-gold/30 font-semibold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer Key Hints */}
            <div className="px-4 py-2.5 bg-black/40 border-t border-brand-gold/20 flex items-center justify-between text-[10px] text-canvas/50">
              <div className="flex items-center gap-3">
                <span><kbd className="px-1 py-0.5 rounded bg-white/10 font-mono">↑↓</kbd> Navigasi</span>
                <span><kbd className="px-1 py-0.5 rounded bg-white/10 font-mono">↵</kbd> Pilih</span>
                <span><kbd className="px-1 py-0.5 rounded bg-white/10 font-mono">ESC</kbd> Tutup</span>
              </div>
              <span className="text-brand-gold">Palet Perintah Kurator Sriwedari</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
