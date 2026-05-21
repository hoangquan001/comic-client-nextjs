'use client';

import Link from 'next/link';
import Image from 'next/image';
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
      <div className="relative w-full flex bg-neutral-50 border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800 rounded-xl h-36 overflow-hidden dark:text-neutral-50 animate-pulse">
        <div className="h-full w-[134px] p-2 overflow-hidden flex">
          <div className="bg-neutral-200 dark:bg-neutral-700 w-full h-full rounded-lg" />
        </div>
        <div className="flex flex-col pl-2 pr-4 py-1.5 w-full gap-2">
          <div className="bg-neutral-200 dark:bg-neutral-700 h-5 rounded-lg w-3/4" />
          <div className="flex gap-1">
            <div className="bg-neutral-200 dark:bg-neutral-700 h-4 w-16 rounded-md" />
            <div className="bg-neutral-200 dark:bg-neutral-700 h-4 w-16 rounded-md" />
            <div className="bg-neutral-200 dark:bg-neutral-700 h-4 w-16 rounded-md" />
          </div>
          <div className="bg-neutral-200 dark:bg-neutral-700 h-16 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  const isOngoing = comic.status === 0;
  const isCompleted = comic.status === 1;
  const statusText = isOngoing ? 'Đang tiến hành' : 'Hoàn thành';
  const displayGenres = comic.genres?.slice(0, 3) || [];

  return (
    <div className="relative w-full flex bg-neutral-50 border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800 rounded-xl h-36 overflow-hidden dark:text-neutral-50">
      {/* Image */}
      <div className="h-full w-[134px] p-2 overflow-hidden flex">
        <Link className='size-full' href={getComicDetailUrl(comic)} aria-label={`Xem truyện ${comic.title}`}>
          <Image
            loading="lazy"
            className="shadow-lg object-cover h-full w-full rounded-lg hover:brightness-90 transition-all"
            src={comic.coverImage || '/option2.png'}
            alt={`Ảnh bìa truyện ${comic.title}`}
            width={134}
            height={128}
            onError={(e) => { (e.target as HTMLImageElement).src = '/option2.png'; }}
          />
        </Link>
      </div>

      {/* Content */}
      <div className="flex flex-col pl-2 pr-4 py-1.5 w-full min-w-0">
        {/* Header: title + update time */}
        <div className="w-full flex justify-between">
          <Link href={getComicDetailUrl(comic)} title={comic.title} className="font-bold uppercase text-sm text-neutral-800 dark:text-neutral-100 hover:text-primary-100">
            <h3 className="line-clamp-1">{comic.title}</h3>
          </Link>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 shrink-0 ml-2">{dateAgo(comic.updateAt)}</p>
        </div>

        {/* Genre tags */}
        <div className="flex space-x-1 mt-1">
          {displayGenres.map((tag, i) => (
            <Link
              key={tag.id}
              href={`/the-loai/${tag.slug || ''}`}
              className="text-pretty"
              title={tag.title}
            >
              {i === 0 ? (
                <span className="text-nowrap bg-primary-100 cursor-pointer text-xs font-bold rounded-md shadow-md px-2 uppercase text-white">{tag.title}</span>
              ) : (
                <span className="text-nowrap bg-neutral-100 dark:bg-neutral-700 dark:text-neutral-200 cursor-pointer font-semibold rounded-md  px-2 uppercase text-neutral-700 text-[0.7rem] hover:bg-neutral-200 dark:hover:bg-neutral-600 hover:shadow-md">{tag.title}</span>
              )}
            </Link>
          ))}
        </div>

        {/* Stats + Status */}
        <div className="flex flex-col-reverse lg:flex-row gap-1 lg:gap-3 mt-1">
          <div className="text-sm text-center flex gap-2 items-center text-neutral-600 dark:text-neutral-300">
            {/* Rating */}
            <div className="flex gap-1 items-center text-amber-500 dark:text-amber-400" title={`Đánh giá: ${comic.rating}/5`}>
              <svg className="w-4 h-4" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" viewBox="0 0 24 24"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>
              {comic.rating}
            </div>
            {/* Bookmark */}
            <div className="flex gap-1 items-center" title={`Lượt bookmark: ${comic.rating}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
              {comic.rating}
            </div>
            {/* Views */}
            <div className="uppercase flex gap-1 items-center" title={`Lượt xem: ${formatNumber(comic.viewCount)}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8" /><circle cx="12" cy="12" r="3" /></svg>
              {formatNumber(comic.viewCount)}
            </div>
          </div>

          {/* Status */}
          <div className="text-sm text-center flex gap-2 items-center">
            {isOngoing && (
              <div className="flex gap-2 items-center">
                <div className="animate-ping h-1 w-1 rounded-full bg-sky-400 opacity-75" />
                <div className="text-sm">{statusText}</div>
              </div>
            )}
            {isCompleted && (
              <div className="flex gap-2 items-center">
                <svg className="opacity-75" xmlns="http://www.w3.org/2000/svg" height="6" width="6" viewBox="0 0 512 512"><path fill="#2debb2" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" /></svg>
                <div className="text-sm">{statusText}</div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {comic.description && (
          <div className="mt-1 text-neutral-800 dark:text-neutral-300 text-xs">
            <p className="line-clamp-3 text-sm leading-relaxed">{comic.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
