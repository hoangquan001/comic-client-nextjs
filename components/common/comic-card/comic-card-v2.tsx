'use client';

import Link from 'next/link';
import type { Comic } from '@/types';
import { getComicDetailUrl } from '@/lib/utils/url';
import { dateAgo } from '@/lib/utils/date';
import { formatNumber } from '@/lib/utils/number';

interface ComicCardV2Props {
  comic?: Comic;
}

export function ComicCardV2({ comic }: ComicCardV2Props) {
  if (!comic) {
    return (
      <div className="flex gap-3 p-2 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse">
        <div className="w-12 h-16 bg-neutral-300 dark:bg-neutral-600 rounded shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-neutral-300 dark:bg-neutral-600 rounded w-3/4" />
          <div className="h-3 bg-neutral-300 dark:bg-neutral-600 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <Link
      href={getComicDetailUrl(comic)}
      className="flex gap-3 p-2 rounded hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
    >
      <img
        src={comic.coverImage || '/empty.png'}
        alt={comic.title}
        className="w-12 h-16 object-cover rounded shrink-0"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/empty.png';
        }}
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold line-clamp-1">{comic.title}</h3>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          {comic.chapters?.[0] && <span>Chapter {comic.chapters[0].slug}</span>}
          <span>{dateAgo(comic.updateAt)}</span>
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          <span>{formatNumber(comic.viewCount)} lượt</span>
        </div>
      </div>
    </Link>
  );
}
