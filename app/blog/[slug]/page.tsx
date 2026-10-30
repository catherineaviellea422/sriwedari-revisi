import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_POSTS } from '@/lib/blog-data';

export default function BlogPostDetail({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="w-full bg-surface pb-12 flex flex-col">
      {/* Mobile Sticky Header */}
      <header className="h-14 bg-brand-green-dark border-b border-brand-gold/20 px-4 flex items-center justify-between sticky top-0 z-30 shrink-0">
        <Link
          href="/blog"
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-gold hover:text-white transition"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Warta Budaya</span>
        </Link>
        <Link
          href="/dashboard"
          className="px-2.5 py-1 rounded-lg bg-brand-gold text-brand-green-dark text-xs font-bold hover:brightness-110 transition flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">home</span>
          <span>Beranda</span>
        </Link>
      </header>

      {/* Article Body */}
      <article className="p-4 space-y-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-green/10 text-brand-green border border-brand-green/20">
            {post.category}
          </span>
          <h1 className="font-serif text-lg font-bold text-primary mt-2 mb-2 leading-snug">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-[10px] text-on-surface-variant font-mono pb-3 border-b border-divider">
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime} baca</span>
            <span>•</span>
            <span className="text-brand-green font-medium">Tim Kurator</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-2xl overflow-hidden shadow-sm border border-divider aspect-[16/10] relative">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Content */}
        <div className="text-xs text-on-surface leading-relaxed space-y-3 font-sans">
          <p className="text-xs text-on-surface-variant font-serif italic border-l-2 border-brand-gold pl-3 py-1 bg-surface-container-low rounded-r-xl">
            "{post.excerpt}"
          </p>
          <p>
            Kesenian tari klasik dan pertunjukan teater wayang orang di Surakarta tidak sekadar dipandang sebagai hiburan semata (*ontonan*), melainkan memiliki kedudukan luhur sebagai tuntunan budi pekerti (*tuntunan*) dan tatanan kosmos sosial (*tatanan*).
          </p>
          <p>
            Setiap busana adat yang dikenakan oleh para penari dirancang dengan perhitungan pakem keraton yang sangat teliti. Mulai dari pemilihan motif batik parang rusak barong yang melambangkan kewibawaan ksatria utama, hingga mahkota dan gelung ornamen prada emas yang mencerminkan kesucian niat dalam mempersembahkan cipta rasa karsa.
          </p>
          <p>
            Melalui Galeri Sriwedari digital ini, seluruh masyarakat pecinta seni tari dapat menelaah arsip, menyewa busana asli pementasan untuk kegiatan pentas seni, serta memesan tiket pertunjukan wayang orang secara langsung.
          </p>
        </div>

        {/* Footer CTA */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-divider space-y-2.5 shadow-sm">
          <div>
            <h4 className="font-serif font-bold text-primary text-xs">
              Ingin menyewa busana ini?
            </h4>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Tersedia untuk pementasan sanggar, festival, dan pemotretan budaya.
            </p>
          </div>
          <Link
            href="/bookings"
            className="w-full py-2.5 rounded-xl bg-brand-green text-canvas font-bold text-xs hover:bg-brand-green-dark transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Reservasi Sewa Busana</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </article>
    </div>
  );
}
