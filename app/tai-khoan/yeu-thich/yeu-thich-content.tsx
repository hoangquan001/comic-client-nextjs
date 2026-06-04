'use client';

import { useState } from 'react';
import { useFollowedComics } from '@/lib/hooks/use-account-queries';
import { ComicCard } from '@/components/common/comic-card';
import { AccountIcon, EmptyState, GlassCard, LoadingState, PageHeader } from '../_components/account-ui';

export default function YeuThichContent() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch } = useFollowedComics(page, 18);
  const comics = data?.comics ?? [];
  const totalPages = data?.totalpage ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader icon="heart" title="Truyện yêu thích" description="Danh sách các truyện bạn đã lưu vào mục yêu thích" iconClassName="text-red-500" />

      {isLoading && <LoadingState text="Đang tải truyện yêu thích..." />}

      {!isLoading && isError && (
        <GlassCard className="p-12">
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <AccountIcon name="alert" className="h-24 w-24 text-red-300 dark:text-red-600 [stroke-width:1]" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-light-text">Có lỗi xảy ra</h3>
            <p className="mx-auto max-w-md leading-relaxed text-neutral-600 dark:text-neutral-400">{error?.message || 'Không thể tải danh sách truyện yêu thích'}</p>
            <button type="button" onClick={() => refetch()} className="mx-auto flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/50">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23,4 23,10 17,10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Thử lại
            </button>
          </div>
        </GlassCard>
      )}

      {!isLoading && !isError && comics.length === 0 && (
        <EmptyState
          icon="heart"
          title="Chưa có truyện yêu thích"
          description="Bạn chưa lưu truyện nào vào danh sách yêu thích. Hãy khám phá và lưu những truyện bạn thích nhé!"
          actionHref="/"
          actionLabel="Khám phá truyện"
        />
      )}

      {!isLoading && !isError && comics.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 transition-transform duration-200 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {comics.map((comic) => (
              <div key={comic.id} className="transition-transform duration-200 hover:scale-105">
                <ComicCard comic={comic} />
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <nav aria-label="Pagination navigation" className="flex items-center justify-center gap-2">
              <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1} className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-700">
                Trước
              </button>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">{page} / {totalPages}</span>
              <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page >= totalPages} className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-700">
                Sau
              </button>
            </nav>
          )}
        </div>
      )}
    </div>
  );
}
