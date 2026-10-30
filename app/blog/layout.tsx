import React from 'react';
import MobileAppShell from '@/components/layout/MobileAppShell';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileAppShell>
      <div className="flex-1 overflow-y-auto w-full">
        {children}
      </div>
    </MobileAppShell>
  );
}

