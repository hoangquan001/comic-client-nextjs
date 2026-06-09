'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchComic } from '@/lib/hooks/use-comic-queries';
import { formatNumber } from '@/lib/utils/number';
import { getComicDetailUrl } from '@/lib/utils/url';
import { useClickOutside } from '@/lib/hooks/use-click-outside';
import { Empty } from '@/components/common/empty/empty';
import type { Comic } from '@/types';

const DEBOUNCE_MS = 500;

export function SearchBox() {
  const [isSearching, setIsSearching] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: listSearch = [], isLoading } = useSearchComic(debouncedKeyword);

  useClickOutside(containerRef, () => {
    setIsSearching(false);
  });

  useEffect(() => {
    if (!keyword.trim()) {
      setDebouncedKeyword('');
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [keyword]);

  const handleSearchClick = useCallback(() => {
    setIsSearching(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value);

    },
    []
  );

  const handleFocus = useCallback(() => {
    setIsSearching(true);
  }, []);

  const clearSearch = useCallback(() => {
    setKeyword('');
    setDebouncedKeyword('');
    inputRef.current?.focus();
  }, []);

  const closePanel = useCallback(() => {
    setIsSearching(false);
  }, []);

  return (
    <>
      {/* Mobile search button */}
      <button
        type="button"
        title="Tim kiem"
        className="h-full flex bg-neutral-200 rounded-full cursor-pointer md:hidden dark:bg-neutral-700 items-center justify-center"
        onClick={handleSearchClick}
      >
        <svg
          className="h-7 w-7 text-primary-100 p-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      {/* Search frame */}
      <div
        ref={containerRef}
        className={`absolute top-0 right-0 left-0 h-16 md:relative md:flex justify-end md:h-8 md:w-[28rem] ${
          isSearching ? 'flex z-50' : 'hidden md:flex'
        }`}
      >
        <div className="relative w-full rounded-lg top-4 md:top-0">
          <input
            id="comicSearch"
            ref={inputRef}
            type="text"
            value={keyword}
            onChange={handleInputChange}
            onFocus={handleFocus}
            placeholder="Tìm kiếm..."
            className="w-2/4 rounded-lg pl-4 pr-8 py-2 outline-none border-[1px] dark:border-neutral-500 dark:bg-neutral-700 bg-neutral-200 focus:bg-white dark:focus:bg-neutral-600 text-black absolute right-0 h-8 dark:text-light-text transition-[width] focus:!w-full focus:border-primary-100 focus:border-2"
          />

          {/* Search icon in input */}
          <svg
            className={`h-4 w-4 text-primary-100 absolute right-3 top-4 transform -translate-y-1/2 transition-opacity duration-300 md:top-1/2 md:-translate-y-1/2 ${
              isSearching ? 'opacity-0' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          {/* Clear button */}
          {keyword.length > 0 && isSearching && (
            <svg
              onClick={clearSearch}
              className="clear-icon h-6 w-6 text-white absolute right-3 top-4 transform -translate-y-1/2 cursor-pointer md:top-1/2 md:-translate-y-1/2"
              viewBox="0 0 24 24"
              fill="#F86E4C"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          )}
        </div>

        {/* Dropdown panel */}
        {isSearching && (
          <div className="absolute rounded-xl z-20 flex mt-16 md:mt-10 flex-col bg-white dark:bg-neutral-800 px-4 py-3 shadow-xl w-64 transition-[width] right-0 !w-full">
            <div className="-mt-2">
              {isLoading ? (
                <SearchSkeleton />
              ) : (
                <>
                  {keyword !== '' && (
                    <div className="flex items-center my-4 dark:text-light-text">
                      <div className="font-bold text-xl flex-grow">
                        Kết quả
                      </div>
                      <svg
                        className="h-6 w-6 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        onClick={closePanel}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  )}
                  {!keyword && (
                    <div className="flex items-center">
                      <div className="text-md flex-grow mt-3 text-neutral-400">
                        Nhập từ khoá tìm kiếm
                      </div>
                    </div>
                  )}
                  {!isLoading && listSearch.length === 0 && keyword && (
                      <Empty />
                  )}
                  {listSearch.length > 0 && (
                    <div>
                      {listSearch.map((comic) => (
                        <SearchResultItem
                          key={comic.id}
                          comic={comic}
                          onClick={closePanel}
                        />
                      ))}
                    </div>
                  )}
                  {listSearch.length > 0 && (
                    <Link
                      href={`/tim-truyen?page=1&keyword=${encodeURIComponent(keyword)}`}
                      onClick={closePanel}
                      className="cursor-pointer flex items-center justify-end text-center mx-auto hover:underline dark:text-neutral-500 dark:hover:text-primary-100 hover:text-primary-100"
                    >
                      Xem thêm
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="13 17 18 12 13 7" />
                        <polyline points="6 17 11 12 6 7" />
                      </svg>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Backdrop overlay */}
        {isSearching && (
          <div
            className="fixed -z-10 top-0 bottom-0 right-0 left-0 bg-neutral-800 opacity-30"
            onClick={closePanel}
          />
        )}
      </div>
    </>
  );
}

function SearchSkeleton() {
  return (
    <section className="rounded-lg bg-neutral-100 dark:bg-neutral-700 my-2 hover:bg-neutral-100 animate-pulse">
      <div className="px-2 py-1">
        <div className="flex flex-row space-y-0 py-1 text-left">
          <div className="h-20 w-14 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
          <div className="relative flex px-2 lg:px-3 justify-between w-full">
            <div className="pr-3 my-auto w-full">
              <div className="flex justify-between">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4 mb-2" />
              </div>
              <div className="flex gap-2">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2 mb-2" />
              </div>
              <div className="flex gap-3 mt-1">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/6" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/6" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchResultItem({
  comic,
  onClick,
}: {
  comic: Comic;
  onClick: () => void;
}) {
  return (
    <section className="rounded-lg bg-neutral-100 dark:bg-neutral-700 mb-2 hover:bg-neutral-200 dark:hover:bg-neutral-600 dark:text-light-text">
      <Link
        href={getComicDetailUrl(comic)}
        onClick={onClick}
        title={comic.title}
      >
        <div className="px-2 py-1">
          <div className="flex flex-row space-y-0 py-1 text-left">
            <Image
              loading="lazy"
              className="h-20 w-14 rounded-lg object-cover my-auto"
              src={comic.coverImage || '/images/placeholder.webp'}
              alt={comic.title}
              width={56}
              height={80}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/placeholder.webp';
              }}
              unoptimized
            />
            <div className="relative flex px-2 lg:px-3 justify-between">
              <div className="pr-3 my-auto">
                <div className="flex justify-between">
                  <p className="text-lg font-bold line-clamp-1">
                    {comic.title}
                  </p>
                </div>
                <div className="text-[0.75rem] text-center comment-container flex gap-1 items-center">
                  {comic.status === 0 ? (
                    <>
                      <div className="h-2 w-2 rounded-full bg-sky-400 opacity-75" />
                      <div>Đang tiến hành</div>
                    </>
                  ) : (
                    <>
                      <div className="h-2 w-2 rounded-full bg-lime-500 opacity-75" />
                      <div>Da hoan thanh</div>
                    </>
                  )}
                </div>
                <div className="flex gap-3 mt-1">
                  <div className="text-sm text-center uppercase flex gap-1 items-center text-primary-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {formatNumber(comic.viewCount)}
                  </div>
                  <div className="text-sm text-center flex gap-1 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                    </svg>
                    {comic.rating}
                  </div>
                  <div className="text-sm text-center flex gap-1 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                      />
                    </svg>
                    {comic.rating}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
