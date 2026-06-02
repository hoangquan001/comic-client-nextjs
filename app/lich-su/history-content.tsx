'use client';

import { useEffect, useState } from 'react';
import { useHistoryStore } from '@/lib/stores/use-history-store';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { Pagination } from '@/components/common/pagination/pagination';
import { Breadcrumb } from '@/components/common/breadcrumb/breadcrumb';
import { Spinner } from '@/components/common/spinner/spinner';
import { Empty } from '@/components/common/empty/empty';
import type { Comic } from '@/types';
import { GridComic } from '@/components/common';

const COMICS_PER_PAGE = 14;

interface HistoryContentProps {
  page: number;
  gridType: number
}

export default function HistoryContent({ page, gridType }: HistoryContentProps) {
  const {
    listHistory,
    remoteHistory,
    initialize,
    loadRemoteHistory,
    removeHistory,
    initialized,
    remoteInitialized,
    remoteTotalpage,
    syncStatus,
  } = useHistoryStore();
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const [confirmComic, setConfirmComic] = useState<Comic | null>(null);
  const isRemoteHistory = userId !== null && remoteInitialized;
  const sourceHistory = isRemoteHistory ? remoteHistory : listHistory;
  const comics = isRemoteHistory
    ? sourceHistory
    : sourceHistory.slice((page - 1) * COMICS_PER_PAGE, page * COMICS_PER_PAGE);
  useEffect(() => { initialize(); }, [initialize]);
  useEffect(() => {
    if (userId === null) return;
    void loadRemoteHistory(userId, page);
  }, [loadRemoteHistory, page, userId]);

  const totalpage = isRemoteHistory
    ? Math.max(1, remoteTotalpage)
    : Math.max(1, Math.ceil(sourceHistory.length / COMICS_PER_PAGE));
  // const pageIds = listHistory
  //   .slice((page - 1) * COMICS_PER_PAGE, page * COMICS_PER_PAGE)
  //   .map((c) => c.id);

  // const { data: comics, isLoading } = useComicsByIds(pageIds);

  const handleRemove = (comic: Comic) => setConfirmComic(comic);
  const confirmRemove = () => {
    if (!confirmComic) return;
    removeHistory(confirmComic.id, userId !== null && remoteInitialized);
    setConfirmComic(null);
  };

  return (
    <div className="lg:container mx-auto w-full p-2">
      <Breadcrumb items={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Lịch sử', href: '/lich-su' },
      ]} />
      <div className="mt-4">
        {!initialized || (userId !== null && !remoteInitialized && syncStatus === 'syncing') ? (
          <Spinner />
        ) : comics && comics.length > 0 ? (
          <>
            <GridComic alwayType={gridType} title="Lịch sử" listComics={comics}
            actionClick={handleRemove}
            actionTemplate={
              <span
                className="absolute top-1.5 left-1.5 z-10 bg-red-500 hover:bg-red-600 rounded-md text-white p-1 "
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </span>
            }
            />
            <Pagination currentPage={page} totalpage={totalpage} rootLink="/lich-su" />
          </>
        ) : (
          <div className="flex justify-center py-20"><Empty message="Không có truyện đã xem" /></div>
        )}
      </div>
      {confirmComic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setConfirmComic(null)}>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 max-w-sm mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2">Xóa lịch sử</h3>
            <p className="text-sm opacity-80 mb-4">Bạn có chắc chắn muốn xóa <strong>{confirmComic.title}</strong> khỏi danh sách truyện đã xem?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmComic(null)} className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-sm">Hủy</button>
              <button onClick={confirmRemove} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
