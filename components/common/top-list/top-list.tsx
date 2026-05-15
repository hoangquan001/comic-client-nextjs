'use client';

import Link from 'next/link';
import type { Comic } from '@/types';
import { useTopComics } from '@/lib/hooks/use-comic-queries';
import { TopType } from '@/types';
import { useState } from 'react';
import { getComicDetailUrl } from '@/lib/utils/url';

export function TopList() {
  const [activeTab, setActiveTab] = useState<TopType>(TopType.Day);
  const { data: comics, isLoading } = useTopComics(activeTab);

  const tabs = [
    { type: TopType.Day, label: 'Ngày' },
    { type: TopType.Week, label: 'Tuần' },
    { type: TopType.Month, label: 'Tháng' },
  ];

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
      <div className="flex border-b border-neutral-200 dark:border-neutral-700">
        {tabs.map((tab) => (
          <button
            key={tab.type}
            onClick={() => setActiveTab(tab.type)}
            className={`flex-1 py-2 text-sm font-semibold text-center transition-colors ${
              activeTab === tab.type
                ? 'text-primary-100 border-b-2 border-primary-100'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-2">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-neutral-100 dark:bg-neutral-700 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <ul className="space-y-1">
            {comics?.slice(0, 10).map((comic, i) => (
              <li key={comic.id}>
                <Link
                  href={getComicDetailUrl(comic)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-neutral-50 dark:hover:bg-neutral-700 text-sm"
                >
                  <span className={`w-5 h-5 flex items-center justify-center rounded text-xs font-bold ${
                    i < 3 ? 'bg-primary-100 text-white' : 'bg-neutral-200 dark:bg-neutral-600'
                  }`}>
                    {i + 1}
                  </span>
                  <span className="truncate flex-1">{comic.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
