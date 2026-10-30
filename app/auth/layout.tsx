import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-green-dark text-canvas flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decorative Radials */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-green/40 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-gold/15 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />
      
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
