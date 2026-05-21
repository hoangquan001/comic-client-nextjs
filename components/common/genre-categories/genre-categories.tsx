'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { clientFetch } from '@/lib/api/client-fetch';
import type { Genre, IServiceResponse } from '@/types';
import { GENRES } from '@/lib/constants';

interface GenreCategoriesProps {
  routerLinkGenres?: boolean;
  statusGenres?: Record<string, number>;
  onClickGenre?: (genre: Genre) => void;
}

export default function GenreCategories({ routerLinkGenres = true, statusGenres = {}, onClickGenre }: GenreCategoriesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [genreHovered, setGenreHovered] = useState<Genre | null>(null);

  const genres = GENRES;

  const { countries, common } = useMemo(() => {
    const countryNames = ['Manga', 'Manhua', 'Manhwa'];
    const c: Genre[] = [];
    const g: Genre[] = [];
    genres.forEach((genre) => {
      if (countryNames.includes(genre.title)) c.push(genre);
      else g.push(genre);
    });
    return { countries: c, common: g };
  }, [genres]);

  const filteredCountries = useMemo(() => {
    if (!searchTerm.trim()) return countries;
    return countries.filter((g) => g.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [countries, searchTerm]);

  const filteredCommon = useMemo(() => {
    if (!searchTerm.trim()) return common;
    return common.filter((g) => g.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [common, searchTerm]);

  const hasResults = filteredCountries.length > 0 || filteredCommon.length > 0;

  function getGenreClass(genreId: number | string): string {
    const status = statusGenres[genreId];
    if (status === 1) return 'bg-primary-100/10 border-primary-100 dark:border-primary-100 text-primary-100 dark:text-primary-100 shadow-md';
    if (status === 2) return 'border-red-200 text-red-600 dark:text-red-400 cursor-not-allowed opacity-75';
    return 'bg-neutral-50 dark:bg-neutral-700 border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600 hover:border-primary-100 hover:text-primary-100 hover:shadow-md';
  }

  function renderChip(genre: Genre) {
    const cls = getGenreClass(genre.id);
    const content = (
      <>
        <span className="truncate max-w-24">{genre.title}</span>
        {statusGenres[genre.id] === 1 && (
          <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
        )}
        {statusGenres[genre.id] === 2 && (
          <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 12 6.41z" /></svg>
        )}
      </>
    );

    if (routerLinkGenres) {
      return (
        <Link key={genre.id} href={`/the-loai/${genre.slug}`} className={`relative inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-lg text-xs font-medium border cursor-pointer select-none hover:scale-105 active:scale-95 ${cls}`} title={genre.description || genre.title} onClick={() => onClickGenre?.(genre)} onMouseEnter={() => setGenreHovered(genre)}>
          {content}
        </Link>
      );
    }
    return (
      <button key={genre.id} className={`relative inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-lg text-xs font-medium border cursor-pointer select-none hover:scale-105 active:scale-95 ${cls}`} title={genre.description || genre.title} onClick={() => onClickGenre?.(genre)} onMouseEnter={() => setGenreHovered(genre)}>
        {content}
      </button>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-800 mt-2 overflow-y-auto w-full md:w-[30rem] lg:w-[42rem] xl:w-[44rem] 2xl:w-[50rem] max-h-96 lg:max-h-[32rem] rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 p-4 space-y-4 z-50 scrollbar-style-1">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-primary-100" viewBox="0 0 24 24" stroke="currentColor" fill="none"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4m0-4h.01" /></svg>
          <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Danh sách theo tên thể loại</h3>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="relative">
          <div className="relative flex items-center">
            <svg className="absolute left-3 w-4 h-4 text-neutral-400 dark:text-neutral-500 pointer-events-none" viewBox="0 0 24 24" stroke="currentColor" fill="none"><path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16m10 2-4.35-4.35" /></svg>
            <input className="w-full h-10 pl-10 pr-10 text-sm rounded-lg border bg-neutral-50 dark:bg-neutral-700 border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-light-text placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-100/50 focus:border-primary-100 focus:bg-white dark:focus:bg-neutral-600" type="search" placeholder="Tìm thể loại..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} autoComplete="off" spellCheck={false} />
            {searchTerm && (
              <button type="button" className="absolute right-2 p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600" onClick={() => setSearchTerm('')}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" fill="none"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="space-y-3">
        {filteredCountries.length > 0 && (
          <section>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-semibold text-neutral-800 dark:text-neutral-200 whitespace-nowrap">Theo các nước</h4>
              <div className="flex-1 h-px bg-gradient-to-r from-neutral-300 to-transparent dark:from-neutral-600" />
            </div>
            <div className="flex flex-wrap gap-2">{filteredCountries.map(renderChip)}</div>
          </section>
        )}
        {filteredCommon.length > 0 && (
          <section>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-semibold text-neutral-800 dark:text-neutral-200 whitespace-nowrap">Thể loại</h4>
              <div className="flex-1 h-px bg-gradient-to-r from-neutral-300 to-transparent dark:from-neutral-600" />
            </div>
            <div className="flex flex-wrap gap-2">{filteredCommon.map(renderChip)}</div>
          </section>
        )}
        {searchTerm && !hasResults && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg className="w-12 h-12 text-neutral-400 dark:text-neutral-500 mb-3" viewBox="0 0 24 24" stroke="currentColor" fill="none"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">Không tìm thấy thể loại nào phù hợp</p>
            <button className="text-xs text-primary-100 hover:text-primary-100 font-medium hover:underline" onClick={() => setSearchTerm('')}>Xóa bộ lọc</button>
          </div>
        )}
      </div>

      {genreHovered && (
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 transition-all duration-300">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-600 mb-3" />
          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 p-1 rounded-md bg-primary-100 dark:bg-primary-100/30">
              <svg className="w-4 h-4 text-primary-100 dark:text-primary-100" viewBox="0 0 24 24" stroke="currentColor" fill="none"><circle cx="12" cy="12" r="9" /><line x1="12" y1="8" x2="12.01" y2="8" /><polyline points="11 12 12 12 12 16 13 16" /></svg>
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-1">{genreHovered.title}</h5>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{genreHovered.description || 'Không có mô tả'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
