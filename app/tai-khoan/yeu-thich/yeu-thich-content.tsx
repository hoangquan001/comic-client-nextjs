'use client';

import { useState } from 'react';
import { useFollowedComics } from '@/lib/hooks/use-account-queries';
import { GridComic } from '@/components/common/grid-comic/grid-comic';
import { Spinner } from '@/components/common/spinner/spinner';
import { Empty } from '@/components/common/empty/empty';

export default function YeuThichPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useFollowedComics(page);

  const comics = (data as any)?.data ?? [];
  const totalPages = Math.ceil(((data as any)?.totalCount ?? 0) / 28);

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-light-text mb-6">Truyện yêu thích</h2>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : comics.length === 0 ? (
        <div className="py-16 text-center"><Empty /><p className="text-sm text-neutral-500 mt-4">Bạn chưa theo dõi truyện nào</p></div>
      ) : (
        <>
          <GridComic title="Truyện yêu thích" listComics={comics} />
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 text-sm font-medium disabled:opacity-50 border-none cursor-pointer">Trước</button>
              <span className="text-sm text-neutral-500">{page} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 text-sm font-medium disabled:opacity-50 border-none cursor-pointer">Sau</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
