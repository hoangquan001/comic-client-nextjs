'use client';

import Link from 'next/link';
import type { Comic } from '@/types';
import { getComicDetailUrl, getChapterDetailUrl } from '@/lib/utils/url';
import { dateAgo } from '@/lib/utils/date';
import { formatNumber } from '@/lib/utils/number';

interface ComicCardProps {
  comic?: Comic;
}

export function ComicCard({ comic }: ComicCardProps) {
  if (!comic) {
    return (
      <div className="card-v1-container">
        <div className="w-full h-full bg-neutral-200 dark:bg-neutral-700 animate-pulse flex items-center justify-center">
          <svg className="w-10 h-10 text-neutral-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 18">
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
          </svg>
        </div>
      </div>
    );
  }

  const statusName = comic.status === 1 ? 'Full' : 'Đang ra';
  const hasChapters = !!(comic.chapters?.length);
  const firstChapter = comic.chapters?.[0];

  return (
    <div className="card-v1-container group">
      {comic.type && (
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">HOT</span>
        </div>
      )}
      <span className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
        <span className="text-yellow-400">★</span>
        {comic.rating}
      </span>

      <Link
        href={getComicDetailUrl(comic)}
        title={comic.title}
        className="block relative overflow-hidden"
      >
        <img
          src={comic.coverImage || '/empty.png'}
          alt={comic.title}
          className="comic-card-image w-full aspect-[3/4] object-cover"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/empty.png';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
          <h3 className="comic-title text-white line-clamp-2 text-sm font-semibold">{comic.title}</h3>
          {hasChapters && (
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${comic.status === 1 ? 'bg-green-400' : 'bg-blue-400'}`} />
                <span className="text-xs">{statusName}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-300">
                <img src="/icons/view.svg" alt="views" className="w-3 h-3" />
                <span>{formatNumber(comic.viewCount)}</span>
              </div>
            </div>
          )}
        </div>
      </Link>

      {hasChapters && firstChapter && (
        <Link
          href={getChapterDetailUrl(comic, firstChapter)}
          className="card-footer block px-2 py-1.5 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          <p className="text-xs font-medium truncate">Chapter {firstChapter.slug}</p>
          <span className="text-xs text-gray-500">{dateAgo(comic.updateAt)}</span>
        </Link>
      )}
    </div>
  );
}
