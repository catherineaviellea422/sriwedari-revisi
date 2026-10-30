import React from 'react';

/**
 * Responsive application shell for the visitor-facing area.
 *
 * - Mobile: native full-screen layout (no frame, no simulated device chrome).
 * - Tablet/Desktop: a centered, full-height app column with a quiet backdrop.
 *
 * The shell is locked to the viewport height so only the inner content area
 * scrolls (single scroll container), while the header and bottom navigation
 * stay anchored.
 */
export default function MobileAppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[100dvh] w-full bg-[#0b1a14] flex justify-center overflow-hidden selection:bg-brand-gold selection:text-brand-green-dark">
      <div className="relative w-full md:max-w-[480px] h-full flex flex-col bg-surface overflow-hidden md:border-x md:border-brand-gold/15 md:shadow-[0_0_80px_rgba(0,0,0,0.45)]">
        {children}
      </div>
    </div>
  );
}
