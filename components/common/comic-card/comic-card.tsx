
import Link from 'next/link';
import type { Comic } from '@/types';
import { getComicDetailUrl, getChapterDetailUrl } from '@/lib/utils/url';
import { dateAgo } from '@/lib/utils/date';
import { formatNumber } from '@/lib/utils/number';
import Image from 'next/image';

interface ComicCardProps {
  comic?: Comic;
  eager?: boolean;
}

export function ComicCard({ comic, eager = false }: ComicCardProps) {
  if (!comic) {
    return (
      <div className="relative flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200/80 bg-white md:shadow-sm transition dark:border-neutral-700 dark:bg-neutral-800">
        <div className="aspect-[4/5] animate-pulse bg-neutral-200 dark:bg-neutral-700 relative w-full flex justify-center items-center">
          <svg className="w-10 h-10 text-neutral-300 dark:text-neutral-600" aria-hidden="true" fill="currentColor" viewBox="0 0 20 18">
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
          </svg>
        </div>
        <div className="space-y-2 p-2">
          <div className="h-4 w-11/12 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </div>
    );
  }

  // const statusName = comic.status === 1 ? 'Full' : 'Đang ra';
  const hasChapters = !!(comic.chapters?.length);
  const firstChapter = comic.chapters?.[0];

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200/80 bg-white md:shadow-sm transition hover:border-primary-100/40 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600">
      {/* HOT tag */}
      {comic.type && (
        <div className="absolute right-2 top-2 z-10 rounded-md bg-primary-100/90 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase leading-4 text-white md:shadow-sm ring-1 ring-white/20">
          HOT
        </div>
      )}

      {/* Rating */}
      {/* <span className="m-1 rounded-md absolute font-bold z-10 text-center top-0 left-0 min-w-7 text-white bg-black/60 px-1 py-0 sm:px-1.5 sm:py-0.5 text-[0.7rem] hidden sm:flex items-center justify-center">
        <span className="text-yellow-400 mr-1">★</span>
        {comic.rating}
      </span> */}

      {/* Image + overlay */}
      <Link
        href={getComicDetailUrl(comic)}
        title={comic.title}
        className="relative block aspect-[4/5] overflow-hidden bg-neutral-100 dark:bg-neutral-900"
      >
        <Image
          src={comic.coverImage || '/images/placeholder.webp'}
          alt={comic.title}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : undefined}
          quality={40}
          className="object-cover transition duration-300 group-hover:scale-[1.03] group-hover:brightness-95"
          onError={(e) => {
            e.currentTarget.src = "/images/placeholder.webp";
          }} 
          fill
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent opacity-90" />
        <div className="absolute inset-x-0 bottom-0 flex w-full flex-col px-2 pb-2 pt-6 text-xs text-white">
          {/* <h3 className="font-semibold line-clamp-2 text-sm text-white">{comic.title}</h3> */}
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1 text-neutral-200">
              <Image src="/icons/view.svg" alt="views" className="w-3 h-3" width={12} height={12} unoptimized/>
              <span className="truncate text-[0.7rem] font-medium uppercase leading-none">{formatNumber(comic.viewCount)}</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-200">
              <span className="text-yellow-400">★</span>
              <span className="text-[0.7rem] font-medium uppercase leading-none">{formatNumber(comic.rating)}</span>
            </div>
            {/* <div className="flex rounded-sm bg-primary-100/50 items-center text-neutral-200 fill-slate-200">
                <span className="text-[0.6rem] p-[0.5px]  shadow-md px-2 uppercase text-white">{comic.genres?.[0]?.title}</span>
              </div> */}

          </div>
        </div>
      </Link>

      <div className="px-2 text-sm">
        <Link href={getComicDetailUrl(comic)} title={comic.title} className="flex py-1 items-center">
          <p className="line-clamp-2 font-semibold leading-snug text-neutral-800 transition group-hover:text-primary-100 dark:text-neutral-100">{comic.title}</p>
        </Link>
      </div>
      {/* Chapter footer */}
      {hasChapters && firstChapter && (

        <Link
          href={getChapterDetailUrl(comic, firstChapter)}
          className="mt-auto flex items-center justify-between gap-2 border-t border-neutral-100 px-2 py-1 text-xs text-neutral-600 transition hover:bg-neutral-50 hover:text-primary-100 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700/60"
        >
          <p className="min-w-0 truncate font-semibold">Chapter {firstChapter.slug}</p>
          <span className="shrink-0 text-end text-[0.7rem]">{dateAgo(comic.updateAt)}</span>
        </Link>
      )}

    </div>
  );
}
