'use client';

import Link from 'next/link';
import type { Comic } from '@/types';
import { getComicDetailUrl, getChapterDetailUrl } from '@/lib/utils/url';
import { dateAgo } from '@/lib/utils/date';
import { formatNumber } from '@/lib/utils/number';
import Image from 'next/image';

interface ComicCardProps {
  comic?: Comic;
}

export function ComicCard({ comic }: ComicCardProps) {
  if (!comic) {
    return (
      <div className="card-v1-container">
        <div className="aspect-4/5 animate-pulse bg-neutral-300 dark:bg-neutral-700 relative w-full flex justify-center items-center">
          <svg className="w-10 h-10 text-neutral-200 dark:text-neutral-600" aria-hidden="true" fill="currentColor" viewBox="0 0 20 18">
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
          </svg>
        </div>
      </div>
    );
  }

  // const statusName = comic.status === 1 ? 'Full' : 'Đang ra';
  const hasChapters = !!(comic.chapters?.length);
  const firstChapter = comic.chapters?.[0];

  return (
    <div className="relative h-full flex flex-col rounded-t-lg rounded-b-md overflow-hidden group">
      {/* HOT tag */}
      {comic.type && (
        <div className="m-1 rounded-md absolute font-bold z-10 text-center top-0 right-0 bg-primary-200/80 flex items-center justify-center text-white">
          <p className="px-1 py-0 sm:px-1.5 sm:py-0.5 text-[0.7rem]">HOT</p>
          <p className="animate-ping absolute p-1 text-[0.6rem]">HOT</p>
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
        className="block aspect-4/5 relative transition-transform duration-300 hover:-translate-y-2"
      >
        <Image
          src={comic.coverImage || '/option2.png'}
          alt={comic.title}
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = '/option2.png'; }}
          fill
          sizes="
          (max-width: 640px) 50vw,
          (max-width: 1024px) 25vw,
          16vw
        "
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="w-full bg-gradient-to-t from-black to-black/20 absolute bottom-0 flex text-white text-xs p-1 w-full flex-col">
          {/* <h3 className="font-semibold line-clamp-2 text-sm text-white">{comic.title}</h3> */}
          {hasChapters && (
            <div className="flex justify-between w-full">
              <div className="flex gap-1 items-center text-neutral-200 fill-slate-200">
                <Image src="/icons/view.svg" alt="views" className="w-3 h-3" width={12} height={12} />
                <span className="font-normal text-[0.7rem] text-center uppercase">{formatNumber(comic.viewCount)}</span>
              </div>
              <div className="flex gap-1 items-center text-neutral-200 fill-slate-200">
                <span className="text-yellow-400 mr-1">★</span>
                <span className="font-normal text-[0.7rem] text-center uppercase">{formatNumber(comic.rating)}</span>
              </div>
              {/* <div className="flex rounded-sm bg-primary-100/50 items-center text-neutral-200 fill-slate-200">
                <span className="text-[0.6rem] p-[0.5px]  shadow-md px-2 uppercase text-white">{comic.genres?.[0]?.title}</span>
              </div> */}

            </div>
          )}
        </div>
      </Link>

      <div
        className="gap-2 p-1 text-sm dark:bg-neutral-800 hover:bg-gradient-to-t hover:from-primary-50/40 hover:to-white/80 dark:hover:from-dark-bg dark:hover:to-dark-bg/50"
      >
        <p className="font-semibold line-clamp-2">{comic.title}</p>
      </div>
      {/* Chapter footer */}
      {hasChapters && firstChapter && (

        <Link
          href={getChapterDetailUrl(comic, firstChapter)}
          className="justify-between px-1 flex text-xs h-full dark:bg-neutral-800 hover:bg-gradient-to-t hover:from-primary-50/40 hover:to-white/80 dark:hover:from-dark-bg dark:hover:to-dark-bg/50"
        >
          <p className="font-semibold text-nowrap">Chapter {firstChapter.slug}</p>
          <span className="text-end text-[0.7rem] inline text-neutral-700 dark:text-neutral-400 line-clamp-1 text-nowrap">{dateAgo(comic.updateAt)}</span>
        </Link>
      )}

    </div>
  );
}
