'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Comic } from '@/types';
import { useTopComics } from '@/lib/hooks/use-comic-queries';
import { TopType } from '@/types';
import { useState } from 'react';
import { getComicDetailUrl } from '@/lib/utils/url';
import { formatNumber } from '@/lib/utils/number';

const RANK_CLASSES: Record<string, string> = {
  gold: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
  silver: 'bg-gradient-to-br from-neutral-300 to-neutral-500',
  bronze: 'bg-gradient-to-br from-orange-400 to-orange-600',
  default: 'bg-gradient-to-br from-neutral-400 to-neutral-600',
};

function getRankClass(rank: number): string {
  if (rank === 1) return RANK_CLASSES.gold;
  if (rank === 2) return RANK_CLASSES.silver;
  if (rank === 3) return RANK_CLASSES.bronze;
  return RANK_CLASSES.default;
}

export function TopList() {
  const [activeTab, setActiveTab] = useState<TopType>(TopType.Day);
  const { data: comics, isLoading } = useTopComics(activeTab);

  const tabs = [
    {
      type: TopType.Day,
      label: 'Ngày',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12,6 12,12 16,14" />
        </svg>
      ),
    },
    {
      type: TopType.Week,
      label: 'Tuần',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      type: TopType.Month,
      label: 'Tháng',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700  overflow-hidden">
      {/* Header with Tabs */}
      <div className="w-full flex items-center justify-center py-2 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-0.5 md:gap-1 bg-neutral-100 dark:bg-neutral-700 rounded-lg p-0.5 md:p-1">
          {tabs.map((tab) => (
            <button
              key={tab.type}
              onClick={() => setActiveTab(tab.type)}
              type="button"
              className={`flex items-center gap-2 px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm font-medium rounded-md border-none cursor-pointer transition-colors ${
                activeTab === tab.type
                  ? 'bg-white dark:bg-neutral-600 text-primary-200 '
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-transparent'
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-dark-bg grid grid-cols-4 gap-2 p-1 lg:grid-cols-8 xl:grid-cols-1">
        {isLoading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex flex-col xl:flex-row items-center gap-1 p-1 sm:gap-2 sm:p-2">
              <div className="w-16 h-20 md:w-12 md:h-16 rounded-lg bg-neutral-100 dark:bg-neutral-700 animate-pulse" />
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-neutral-100 dark:bg-neutral-700 rounded animate-pulse" />
                <div className="h-2 bg-neutral-100 dark:bg-neutral-700 rounded animate-pulse w-2/3" />
              </div>
            </div>
          ))
        ) : (
          comics?.slice(0, 10).map((comic: Comic, i: number) => (
            <div key={comic.id} className={`shrink h-full last:border-b-0 xl:border-b border-neutral-200 dark:border-neutral-700`}>
              <div className="relative flex flex-col xl:flex-row items-center gap-1 p-1 sm:gap-2 sm:p-2 md:gap-3 md:p-1.5 h-full">
                {/* Rank Badge */}
                <div className={`absolute -top-2 left-1/2 xl:top-0 xl:left-8 -translate-x-1/2 xl:translate-x-0 z-10 flex items-center justify-center w-5 h-5 rounded-full font-bold text-white text-xs md:text-xs xl:text-sm shadow-md ${getRankClass(i + 1)}`}>
                  <span className="font-bold">{i + 1}</span>
                </div>

                {/* Comic Image */}
                <div className="relative shrink-0">
                  <Link
                    href={getComicDetailUrl(comic)}
                    className="relative block overflow-hidden rounded-lg"
                    title={comic.title}
                  >
                    <Image
                      loading="lazy"
                      className="w-16 h-20 md:w-12 md:h-16 object-cover"
                      src={comic.coverImage || '/option2.png'}
                      alt={comic.title}
                      width={64}
                      height={80}
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                  </Link>
                </div>

                {/* Comic Info */}
                <div className="flex-1 min-w-0 space-y-2 xl:space-y-1">
                  <div className="space-y-1">
                    {/* Title */}
                    <h3 className="text-xs md:text-sm font-bold text-neutral-900 dark:text-light-text line-clamp-2 xl:line-clamp-1 text-center xl:text-left">
                      <Link
                        href={getComicDetailUrl(comic)}
                        className="hover:text-primary-100 no-underline text-inherit"
                        title={comic.title}
                      >
                        {comic.title}
                      </Link>
                    </h3>

                    {/* Chapter (Desktop only) */}
                    {comic.chapters && comic.chapters.length > 0 && (
                      <div className="hidden xl:flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                        <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14,2 14,8 20,8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10,9 9,9 8,9" />
                        </svg>
                        <Link
                          href={getComicDetailUrl(comic)}
                          className="hover:text-primary-100 hover:underline line-clamp-1 no-underline text-inherit"
                          title={comic.chapters[0].title}
                        >
                          Chapter {comic.chapters[0].slug}
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* View Count */}
                  <div className="flex items-center justify-center xl:justify-start">
                    <div className="flex items-center gap-1 text-xs text-primary-100 font-semibold">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span className="uppercase">{formatNumber(comic.viewCount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
