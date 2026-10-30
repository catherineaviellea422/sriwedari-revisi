import React from 'react';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog-data';

export default function BlogPage() {
  return (
    <div className="w-full bg-surface pb-12 flex flex-col">
      {/* Mobile Sticky Header */}
      <header className="h-14 bg-brand-green-dark border-b border-brand-gold/20 px-4 flex items-center justify-between sticky top-0 z-30 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-green border border-brand-gold/40 flex items-center justify-center text-brand-gold">
            <span className="material-symbols-outlined text-lg">temple_buddhist</span>
          </div>
          <div>
            <span className="font-serif text-sm font-bold gold-gradient-text tracking-wide block leading-none">
              GALERI SRIWEDARI
            </span>
            <span className="text-[9px] text-canvas/60">Warta &amp; Artikel Budaya</span>
          </div>
        </Link>
        <Link
          href="/dashboard"
          className="px-2.5 py-1 rounded-lg bg-brand-gold text-brand-green-dark text-xs font-bold hover:brightness-110 transition flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">home</span>
          <span>Beranda</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-4">
        {/* Banner Title */}
        <div className="p-4 rounded-2xl bg-brand-green-dark text-canvas border border-brand-gold/25 relative overflow-hidden shadow-sm">
          <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-brand-gold/15 blur-xl pointer-events-none" />
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-gold/20 text-brand-gold border border-brand-gold/30 mb-2">
            Katalog Wawasan Budaya
          </span>
          <h1 className="font-serif text-lg font-bold text-white leading-snug">
            Artikel &amp; Catatan Kurator Seni
          </h1>
          <p className="text-xs text-canvas/75 mt-1 leading-relaxed">
            Mendalami makna filosofis, pakem tari keraton, dan dokumentasi panggung Wayang Orang Sriwedari.
          </p>
        </div>

        {/* Blog Posts Mobile Stack */}
        <div className="space-y-3.5">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-surface-container-low rounded-2xl border border-divider overflow-hidden hover:shadow-card-warm transition-all block"
            >
              <div className="aspect-[16/9] relative overflow-hidden bg-black/10">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-brand-green-dark/85 backdrop-blur-sm text-brand-gold text-[10px] font-bold border border-brand-gold/30">
                  {post.category}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-[10px] text-on-surface-variant font-mono mb-1.5">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime} baca</span>
                </div>
                <h2 className="font-serif text-sm font-bold text-primary group-hover:text-brand-green transition leading-snug mb-1.5">
                  {post.title}
                </h2>
                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-3 pt-2.5 border-t border-divider flex items-center justify-between text-xs font-semibold text-brand-green">
                  <span>Baca Selengkapnya</span>
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
