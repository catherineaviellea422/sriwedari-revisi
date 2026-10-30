import React from 'react';
import MobileAppShell from '@/components/layout/MobileAppShell';
import UserNavbar from '@/components/layout/UserNavbar';
import UserBottomNav from '@/components/layout/UserBottomNav';

export default function FrontendUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MobileAppShell>
      {/* App header: sidebar trigger, brand, gamelan player and profile */}
      <UserNavbar />

      {/* Single scroll container for page content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-5 pb-8 w-full scroll-smooth">
        {children}
      </main>

      {/* Bottom navigation bar */}
      <UserBottomNav />
    </MobileAppShell>
  );
}
