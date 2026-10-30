'use client';

import React, { useEffect, useState } from 'react';
import { SriwedariDB } from '@/lib/db';
import { AuditLogItem } from '@/lib/types';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [actionFilter, setActionFilter] = useState<string>('all');

  useEffect(() => {
    loadLogs();
    const handleUpdate = () => loadLogs();
    window.addEventListener('sriwedari_db_updated', handleUpdate);
    return () => window.removeEventListener('sriwedari_db_updated', handleUpdate);
  }, []);

  const loadLogs = () => {
    setLogs(SriwedariDB.getAuditLogs());
  };

  const handleExportCsv = () => {
    const csvContent = SriwedariDB.exportAuditLogsCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sriwedari-audit-trail-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = logs.filter((l) => actionFilter === 'all' || l.action === actionFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold gold-gradient-text">
            Audit Trail &amp; Rekam Jejak Keamanan Sistem
          </h1>
          <p className="text-xs text-canvas/70 mt-0.5">
            Log otomatis untuk pelacakan transaksi, pemeriksaan QC busana, check-in tiket, dan perubahan basis data
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-brand-gold text-brand-green-dark font-semibold text-xs hover:brightness-110 transition flex items-center gap-1.5 shadow-md"
        >
          <span className="material-symbols-outlined text-base">download</span>
          <span>Ekspor Audit Log (.CSV)</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'VERIFY_PAYMENT', 'QC_RETURN', 'GATE_CHECKIN', 'CREATE_ORDER', 'BOOK_TICKET', 'RESET_DB'].map((act) => (
          <button
            key={act}
            type="button"
            onClick={() => setActionFilter(act)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              actionFilter === act
                ? 'bg-brand-gold text-brand-green-dark shadow-sm'
                : 'bg-[#14382C]/80 text-canvas/70 border border-brand-gold/20 hover:text-white'
            }`}
          >
            {act === 'all' ? `Semua Log (${logs.length})` : act}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-[#14382C]/80 border border-brand-gold/20 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-black/40 text-canvas/60 uppercase text-[10px] tracking-wider border-b border-brand-gold/20">
            <tr>
              <th className="py-3 px-4">Waktu</th>
              <th className="py-3 px-4">Aksi Sistem</th>
              <th className="py-3 px-4">Aktor / Peran</th>
              <th className="py-3 px-4">Rincian Aktivitas</th>
              <th className="py-3 px-4">IP &amp; Tingkat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((log) => (
              <tr key={log.id} className="hover:bg-white/5 transition">
                <td className="py-3 px-4 font-mono text-[11px] text-canvas/60">{log.timestamp}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
                    {log.action}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-white block">{log.actorName}</span>
                  <span className="text-[10px] text-canvas/50">{log.actorRole}</span>
                </td>
                <td className="py-3 px-4 text-canvas/80 max-w-sm">{log.details}</td>
                <td className="py-3 px-4">
                  <span className="text-[10px] text-canvas/50 block font-mono">{log.ipAddress}</span>
                  <span
                    className={`inline-block mt-0.5 px-2 py-0.2 rounded text-[9px] font-bold uppercase ${
                      log.severity === 'warning'
                        ? 'bg-amber-500/20 text-amber-300'
                        : log.severity === 'critical'
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {log.severity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
