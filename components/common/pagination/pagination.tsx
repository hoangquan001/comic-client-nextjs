'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';

interface PaginationProps {
  currentPage: number;
  totalpage: number;
  rootLink?: string;
  onChange?: (page: number) => void;
}

export function Pagination({ currentPage, totalpage, rootLink, onChange }: PaginationProps) {

  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSearch, setShowSearch] = useState(false);

  const pages = useMemo(() => {
    if (totalpage <= 5) {
      return Array.from({ length: totalpage }, (_, i) => String(i + 1));
    }
    if (currentPage <= 3) {
      return ['1', '2', '3', '4', '5', '...', String(totalpage)];
    }
    if (currentPage >= totalpage - 2) {
      return ['1', '...', ...Array.from({ length: 5 }, (_, i) => String(totalpage - 4 + i))];
    }
    return ['1', '...', String(currentPage - 1), String(currentPage), String(currentPage + 1), '...', String(totalpage)];
  }, [currentPage, totalpage]);

  const navigateToPage = (page: number) => {
    const clamped = Math.max(1, Math.min(totalpage, page));
    if (clamped === currentPage) return;

    if (rootLink) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(clamped));
      router.push(`${rootLink}?${params.toString()}`);
    }
    onChange?.(clamped);
    setShowSearch(false);
  };

  useEffect(() => {
    if (showSearch) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setShowSearch(false);
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showSearch]);

  return (
    <nav className="bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 overflow-hidden mt-6 mb-2">
      <div className="flex flex-col gap-3 px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        {/* Page Info Section */}
        <div className="items-center order-2 sm:order-1 hidden sm:flex">
          <div className="flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
            <svg className="w-4 h-4 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10,9 9,9 8,9" />
            </svg>
            <span className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Trang <span className="font-bold text-primary-100">{currentPage}</span> / <span className="font-semibold text-neutral-900 dark:text-light-text">{totalpage}</span>
            </span>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2 order-1 flex-wrap justify-center sm:order-2 sm:flex-nowrap sm:justify-start">
          {/* Previous Button */}
          {currentPage > 1 && (
            <button
              onClick={() => navigateToPage(currentPage - 1)}
              className="flex items-center gap-2 px-2 py-2 sm:px-3 sm:py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-all duration-200 border-none cursor-pointer"
              title="Trang trước"
              rel="prev"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15,18 9,12 15,6" />
              </svg>
              <span className="hidden sm:inline font-medium">Trước</span>
            </button>
          )}

          {/* Page Numbers */}
          <div className="flex items-center gap-0.5 sm:gap-1 flex-wrap justify-center sm:flex-nowrap sm:justify-start">
            {pages.map((page, i) =>
              page === '...' ? (
                <button
                  key={`ellipsis-${i}`}
                  onClick={() => setShowSearch(true)}
                  className="flex items-center justify-center px-1 text-xs min-w-8 h-8 sm:px-2 sm:text-xs md:min-w-10 md:h-10 md:px-3 md:py-2 md:text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-all duration-200 border-none cursor-pointer cursor-pointer hover:bg-primary-100/10 dark:hover:bg-primary-100/20"
                  type="button"
                  title="Nhấp để tìm kiếm trang"
                  aria-label="Mở ô tìm kiếm trang"
                >
                  <svg className="w-4 h-4 text-neutral-400 dark:text-neutral-500" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </button>
              ) : (
                <button
                  key={page}
                  onClick={() => navigateToPage(Number(page))}
                  className={`flex items-center justify-center px-1 text-xs min-w-8 h-8 sm:px-2 sm:text-xs md:min-w-10 md:h-10 md:px-3 md:py-2 md:text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-all duration-200 border-none cursor-pointer ${
                    String(currentPage) === page
                      ? 'bg-primary-100 text-white hover:bg-primary-200 hover:text-white font-semibold'
                      : ''
                  }`}
                  aria-current={String(currentPage) === page ? 'page' : undefined}
                  title={`Trang ${page}`}
                >
                  {page}
                </button>
              )
            )}
          </div>

          {/* Next Button */}
          {currentPage < totalpage && (
            <button
              onClick={() => navigateToPage(currentPage + 1)}
              className="flex items-center gap-2 px-2 py-2 sm:px-3 sm:py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-100 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-all duration-200 border-none cursor-pointer"
              title="Trang sau"
              rel="next"
            >
              <span className="hidden sm:inline font-medium">Sau</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Search Modal Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-700 p-4 m-2 sm:p-6 sm:m-4 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
              <svg className="w-5 h-5 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <span className="text-lg font-bold text-neutral-900 dark:text-light-text">Tìm kiếm trang</span>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="pageSearch" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Nhập số trang:
                </label>
                <input
                  id="pageSearch"
                  type="number"
                  min={1}
                  max={totalpage}
                  placeholder={String(currentPage)}
                  className="w-full px-4 py-3 text-center text-lg font-semibold text-neutral-900 dark:text-light-text bg-neutral-50 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-200"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigateToPage(Number((e.target as HTMLInputElement).value));
                    }
                  }}
                  autoFocus
                />
                <span className="text-xs text-neutral-500 dark:text-neutral-400 text-center block">1 - {totalpage}</span>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <button
                  onClick={() => {
                    const input = document.getElementById('pageSearch') as HTMLInputElement;
                    if (input) {
                      navigateToPage(Number(input.value));
                    }
                  }}
                  className="w-full justify-center sm:flex-1 flex items-center gap-2 px-4 py-3 bg-primary-100 hover:bg-primary-200 text-white font-medium rounded-lg transition-all duration-200 border-none cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9,18 15,12 9,6" />
                  </svg>
                  <span>Đi đến</span>
                </button>
                <button
                  onClick={() => setShowSearch(false)}
                  className="w-full justify-center sm:w-auto flex items-center gap-2 px-4 py-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-all duration-200 border-none cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  <span>Hủy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
