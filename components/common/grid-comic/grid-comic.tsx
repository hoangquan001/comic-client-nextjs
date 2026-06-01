'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Cookies from 'js-cookie';
import type { Comic } from '@/types';
import { useSettingsStore } from '@/lib/stores/use-settings-store';
import { ComicCard, ComicCardV2 } from '../comic-card';

interface GridComicProps {
  title: string;
  listComics: Comic[];
  gridClass?: string;
  nPreview?: number;
  iconTemplate?: React.ReactNode;
  actionTemplate?: React.ReactNode;
  emptyTemplate?: React.ReactNode;
  defaultGridType?: number;
  actionClick?: (comic: Comic) => void;
  alwayType?: number;
}

const CLASS_SMALL =
  'grid gap-3 grid-cols-3 @lg:grid-cols-4 @2xl:grid-cols-5 @4xl:grid-cols-6 @5xl:grid-cols-7 @6xl:grid-cols-8 mx-2';
const CLASS_MEDIUM =
  'grid gap-3 grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4 @3xl:grid-cols-5 @5xl:grid-cols-6 @6xl:grid-cols-7 mx-2';

export function GridComic({
  title,
  listComics,
  gridClass,
  nPreview = 30,
  iconTemplate,
  actionTemplate,
  actionClick,
  emptyTemplate,
  defaultGridType = 0,
  alwayType
}: GridComicProps) {

  const cardSizeSetting = useSettingsStore(
    (state) => state.settings.cardComicSize
  );

  const gridTypeSetting = useSettingsStore(
    (state) => state.settings.gridType
  );

  const gridType = alwayType ?? defaultGridType ?? parseInt(gridTypeSetting as string, 0) ?? 0;
  const cardSize = cardSizeSetting === 'small' ? 'small' : 'medium';
  const [gridTypeState, setGridTypeState] = useState(gridType);

  const defaultGridClass =
    gridClass ||
    (cardSize === 'small' ? CLASS_SMALL : CLASS_MEDIUM);

  // Display placeholder loading cards when no comics
  const displayComics =
    listComics.length === 0 ? Array(nPreview).fill(undefined) : listComics;
  const setSettingValue = useSettingsStore((state) => state.setSettingValue);

  const handleChangeGridType = useCallback((type: number) => {
    setGridTypeState(type);
    setSettingValue("gridType", type);
  }, []);

  return (
    <div className="@container/main">
      {/* Header */}
      <div className="flex justify-between items-center gap-6 mb-3">
        <div className="flex items-center px-1 rounded-sm">
          {iconTemplate}
          <h2 className="block-title">{title}</h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Grid Type Switch */}
          <div className="relative p-0.5 flex items-center bg-neutral-100 dark:bg-neutral-700 rounded-md  border border-neutral-200 dark:border-neutral-600">
            {/* Switch Thumb */}
            <div
              className={`p-1 w-1/2 absolute inset-0 rounded-md  transition-transform duration-300 ease-in-out ${gridTypeState === 0
                ? 'translate-x-full '
                : 'translate-x-0 '
                }`}
            >
              <div
                className="rounded-md size-full bg-neutral-700 dark:bg-neutral-900"
              />
            </div>


            {/* List View Button */}
            <button
              disabled= {alwayType !== undefined}
              onClick={() => handleChangeGridType(1)}
              title="Xem dạng danh sách"
              aria-label="Chuyển sang chế độ xem danh sách"
              className={`relative flex items-center justify-center p-2 min-w-10 text-sm font-medium rounded-md border-none cursor-pointer z-10 transition-colors duration-200 ${gridTypeState === 1
                ? 'text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                stroke="currentColor"
                fill="none"
              >
                <rect x="3" y="4" width="18" height="4" rx="1" />
                <rect x="3" y="10" width="18" height="4" rx="1" />
                <rect x="3" y="16" width="18" height="4" rx="1" />
              </svg>
            </button>

            {/* Grid View Button */}
            <button
              onClick={() => handleChangeGridType(0)}
              title="Xem dạng lưới"
              aria-label="Chuyển sang chế độ xem lưới"
              className={`relative flex items-center justify-center p-2 min-w-10 text-sm font-medium rounded-md border-none cursor-pointer z-10 transition-colors duration-200 ${gridTypeState === 0
                ? 'text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                stroke="currentColor"
                fill="none"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      {gridTypeState === 0 ? (
        <div className={defaultGridClass}>
          {displayComics.map((comic, index) => (
            (actionTemplate ? (
              <div key={comic?.id ?? index} className="comic-card relative">
                <div onClick={() => actionClick?.(comic)} className="comic-card-action cursor-pointer">{actionTemplate}</div>
                <ComicCard comic={comic} eager={index < 2} />

              </div>)
              : (
                <ComicCard key={comic?.id ?? index} comic={comic} eager={index < 4} />
              )
            )
          ))}
        </div>
      ) : (
        <div className="grid gap-3 @xl:gap-4 grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-3">
          {displayComics.map((comic, index) => (
            <div key={comic?.id ?? index} className="relative lg:px-0">
              <ComicCardV2 comic={comic} />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {listComics.length === 0 && emptyTemplate ? (
        emptyTemplate
      ) : listComics.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Không có truyện nào</div>
      ) : null}
    </div>
  );
}
