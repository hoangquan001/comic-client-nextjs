
import Link from 'next/link';
import Image from 'next/image';
import type { Comic } from '@/types';
import { getComicDetailUrl } from '@/lib/utils/url';
import { dateAgo } from '@/lib/utils/date';
import { formatNumber } from '@/lib/utils/number';
import { fillDescription } from '@/lib/utils/description';

interface ComicCardV2Props {
  comic?: Comic;
}

export function ComicCardV2({ comic }: ComicCardV2Props) {
  if (!comic) {
    return (
      <div className="relative flex h-40 w-full animate-pulse overflow-hidden rounded-lg border border-neutral-200/80 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-50">
        <div className="flex h-full w-[120px] shrink-0 overflow-hidden p-2 sm:w-[132px]">
          <div className="h-full w-full rounded-md bg-neutral-200 dark:bg-neutral-700" />
        </div>
        <div className="flex w-full flex-col gap-2 py-2 pl-1 pr-4">
          <div className="h-5 w-3/4 rounded-md bg-neutral-200 dark:bg-neutral-700" />
          <div className="flex gap-1.5">
            <div className="h-4 w-16 rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="h-4 w-16 rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="h-4 w-16 rounded bg-neutral-200 dark:bg-neutral-700" />
          </div>
          <div className="h-16 w-full rounded-md bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </div>
    );
  }

  const isOngoing = comic.status === 0;
  const isCompleted = comic.status === 1;
  const statusText = isOngoing ? 'Đang ra' : 'Hoàn thành';
  const displayGenres = comic.genres?.slice(0, 3) || [];

  return (
    <div className="group relative flex h-40 w-full overflow-hidden rounded-lg border border-neutral-200/80 bg-white shadow-sm transition hover:border-primary-100/40 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:border-neutral-600">
      {/* Image */}
      <div className="flex h-full w-[120px] shrink-0 overflow-hidden p-2 sm:w-[132px]">
        <Link className='size-full' href={getComicDetailUrl(comic)} aria-label={`Xem truyện ${comic.title}`}>
          <Image
            loading="lazy"
            className="h-full w-full rounded-md object-cover shadow-sm transition duration-300 group-hover:scale-[1.02] group-hover:brightness-95"
            src={comic.coverImage || '/option2.png'}
            alt={`Ảnh bìa truyện ${comic.title}`}
            width={134}
            height={128}
            onError={(e) => { (e.target as HTMLImageElement).src = '/option2.png'; }}
          />
        </Link>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-col py-2 pl-1 pr-4">
        {/* Header: title + update time */}
        <div className="flex w-full items-start justify-between gap-3">
          <Link href={getComicDetailUrl(comic)} title={comic.title} className="min-w-0 font-bold text-sm text-neutral-800 transition hover:text-primary-100 dark:text-neutral-100">
            <h3 className="line-clamp-1 leading-snug">{comic.title}</h3>
          </Link>
          <p className="shrink-0 text-xs text-neutral-500 dark:text-neutral-400">{dateAgo(comic.updateAt)}</p>
        </div>

        {/* Genre tags */}
        <div className="mt-1.5 flex min-w-0 gap-1.5">
          {displayGenres.map((tag, i) => (
            <Link
              key={tag.id}
              href={`/the-loai/${tag.slug || ''}`}
              className="min-w-0"
              title={tag.title}
            >
              {i === 0 ? (
                <span className="block truncate rounded bg-primary-100 px-2 py-0 text-[0.68rem] font-bold uppercase leading-4 text-white shadow-sm">{tag.title}</span>
              ) : (
                <span className="block truncate rounded bg-neutral-100 px-2 py-0 text-[0.68rem] font-semibold uppercase leading-4 text-neutral-600 transition hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600">{tag.title}</span>
              )}
            </Link>
          ))}
        </div>

        {/* Stats + Status */}
        <div className="mt-1.5 flex flex-col-reverse gap-1 lg:flex-row lg:items-center lg:gap-3">
          <div className="flex items-center gap-2 text-center text-xs text-neutral-600 dark:text-neutral-300">
            {/* Rating */}
            <div className="flex gap-1 items-center text-amber-500 dark:text-amber-400" title={`Đánh giá: ${comic.rating}/5`}>
              <svg className="h-3.5 w-3.5" fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" viewBox="0 0 24 24"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>
              {comic.rating}
            </div>
            {/* Bookmark */}
            <div className="flex gap-1 items-center" title={`Lượt bookmark: ${comic.rating}`}>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
              {comic.rating}
            </div>
            {/* Views */}
            <div className="uppercase flex gap-1 items-center" title={`Lượt xem: ${formatNumber(comic.viewCount)}`}>
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8" /><circle cx="12" cy="12" r="3" /></svg>
              {formatNumber(comic.viewCount)}
            </div>
                      {/* Status */}
          <div className="flex items-center gap-2 text-center text-xs text-neutral-600 dark:text-neutral-300">
            {isOngoing && (
              <div className="flex gap-2 items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                <div>{statusText}</div>
              </div>
            )}
            {isCompleted && (
              <div className="flex gap-2 items-center">
                <svg className="opacity-75" xmlns="http://www.w3.org/2000/svg" height="6" width="6" viewBox="0 0 512 512"><path fill="#2debb2" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" /></svg>
                <div>{statusText}</div>
              </div>
            )}
          </div>
          </div>


        </div>

        <div className="mt-1 min-h-0 text-neutral-600 dark:text-neutral-300">
          <p className="line-clamp-4 text-xs leading-relaxed">{fillDescription(comic.description, comic, false)}</p>
        </div>
      </div>
    </div>
  );
}
