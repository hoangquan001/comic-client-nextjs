'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GENRES } from '@/lib/constants/genres';

export default function GenreIndexPage() {
  const [q, setQ] = useState('');

  const filtered = q
    ? GENRES.filter(
        (g) =>
          g.title.toLowerCase().includes(q.toLowerCase()) ||
          g.description?.toLowerCase().includes(q.toLowerCase())
      )
    : GENRES;

  return (
    <section className="lg:container mx-auto px-3 py-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold">Danh mục thể loại</h1>
          <p className="text-sm opacity-80">Khám phá truyện theo sở thích. Dùng ô tìm kiếm để lọc nhanh.</p>
        </div>
        <div className="hidden md:block w-64">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm thể loại..."
            className="w-full px-3 py-2 rounded-lg bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 outline-none focus:ring focus:ring-blue-500/30"
          />
        </div>
      </div>

      <div className="md:hidden mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm thể loại..."
          className="w-full px-3 py-2 rounded-lg bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 outline-none focus:ring focus:ring-blue-500/30"
        />
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((g) => (
          <Link
            key={g.id}
            href={`/the-loai/${g.slug}`}
            className="group bg-white/80 dark:bg-zinc-900/60 rounded-lg p-4 border border-zinc-200/60 dark:border-zinc-800 hover:border-blue-500 transition"
          >
            <div className="font-semibold group-hover:text-blue-600">{g.title}</div>
            <div className="text-xs opacity-70 mt-1">{g.description || `Thể loại truyện ${g.title}`}</div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 opacity-60">
          <p>Không tìm thấy thể loại phù hợp.</p>
        </div>
      )}
    </section>
  );
}
