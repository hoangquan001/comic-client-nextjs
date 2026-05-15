'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useMemo } from 'react';

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
  };

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="flex items-center gap-1 text-sm">
        <span className="text-gray-500 mr-2">
          Trang <span className="font-bold text-primary-100">{currentPage}</span> / {totalpage}
        </span>
        {currentPage > 1 && (
          <button
            onClick={() => navigateToPage(currentPage - 1)}
            className="px-3 py-1.5 border border-neutral-300 dark:border-neutral-600 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
            rel="prev"
          >
            <svg className="w-4 h-4 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="15,18 9,12 15,6" /></svg>
            Trước
          </button>
        )}
        <div className="flex items-center gap-1">
          {pages.map((page, i) =>
            page === '...' ? (
              <button
                key={`ellipsis-${i}`}
                onClick={() => setShowSearch(true)}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
                type="button"
                aria-label="Nhập số trang"
              >
                ...
              </button>
            ) : (
              <button
                key={page}
                onClick={() => navigateToPage(Number(page))}
                className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
                  String(currentPage) === page
                    ? 'bg-primary-100 text-white font-bold'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
                aria-current={String(currentPage) === page ? 'page' : undefined}
              >
                {page}
              </button>
            )
          )}
        </div>
        {currentPage < totalpage && (
          <button
            onClick={() => navigateToPage(currentPage + 1)}
            className="px-3 py-1.5 border border-neutral-300 dark:border-neutral-600 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
            rel="next"
          >
            Sau
            <svg className="w-4 h-4 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="9,18 15,12 9,6" /></svg>
          </button>
        )}
      </div>

      {showSearch && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Đến trang:</span>
          <input
            type="number"
            min={1}
            max={totalpage}
            placeholder={String(currentPage)}
            className="w-16 px-2 py-1 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-800 text-center"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigateToPage(Number((e.target as HTMLInputElement).value));
                setShowSearch(false);
              }
            }}
            autoFocus
          />
          <span className="text-gray-500">(1-{totalpage})</span>
          <button onClick={() => setShowSearch(false)} className="text-gray-500 hover:text-gray-700">
            Hủy
          </button>
        </div>
      )}
    </div>
  );
}
