'use client';

import React from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import CommandPalette from '@/components/admin/CommandPalette';
import { useAuth } from '@/lib/auth-context';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0d1e18] text-canvas flex overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-[#14382C]/90 backdrop-blur-md border-b border-brand-gold/20 px-6 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-300 hidden sm:inline">
              Sistem Operasional Aktif (Mode Kurator Keraton)
            </span>
            <CommandPalette />
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-white block">
                {user ? user.name : 'Kanjeng Raden Mas Kurator'}
              </span>
              <span className="text-[10px] text-brand-gold/80">Administrator Panggung</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-brand-gold text-brand-green-dark flex items-center justify-center font-bold text-xs">
              {user ? user.name.charAt(0) : 'A'}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0d1e18] text-canvas">
          <div className="max-w-6xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
