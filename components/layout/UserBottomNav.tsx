'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function UserBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Beranda', href: '/dashboard', icon: 'home' },
    { label: 'Galeri', href: '/collection', icon: 'photo_library' },
    { label: 'Kostum', href: '/collection/costumes', icon: 'checkroom' },
    { label: 'Jadwal', href: '/visitors', icon: 'calendar_month' },
    { label: 'Profil', href: '/profile', icon: 'person' },
  ];

  return (
    <nav className="w-full h-16 bg-brand-green-dark border-t border-brand-gold/20 flex items-stretch justify-around px-1 z-30 shrink-0 select-none pb-[env(safe-area-inset-bottom)]">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/dashboard' && pathname.startsWith(item.href) &&
            !navItems.some((o) => o.href !== item.href && o.href.startsWith(item.href) && pathname.startsWith(o.href)));

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center flex-1 gap-0.5 transition-colors ${
              isActive ? 'text-brand-gold' : 'text-canvas/55 hover:text-canvas'
            }`}
          >
            {isActive && (
              <span className="absolute top-0 w-8 h-[2px] rounded-full bg-brand-gold" />
            )}

            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
