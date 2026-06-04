'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useHistoryStore } from '@/lib/stores/use-history-store';
import { ComicCard } from '@/components/common/comic-card';
import { AccountIcon, EmptyState, GlassCard, PageHeader } from '../_components/account-ui';

const ITEMS_PER_PAGE = 14;

export default function LichSuContent() {
  const { listHistory, initialize, removeHistory } = useHistoryStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const totalPages = Math.max(1, Math.ceil(listHistory.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedComics = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return listHistory.slice(start, start + ITEMS_PER_PAGE);
  }, [listHistory, safePage]);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, [listHistory.length]);

  function toggleSelect(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function confirmDelete() {
    if (selectedIds.size === 0) return;
    setShowConfirm(true);
  }

  function doDelete() {
    selectedIds.forEach((id) => removeHistory(id));
    toast.success(`Đã xóa ${selectedIds.size} truyện khỏi lịch sử đọc`);
    setSelectedIds(new Set());
    setShowConfirm(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader icon="clock" title="Lịch sử đọc" iconClassName="text-red-500" />

      {listHistory.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {selectedIds.size > 0 ? `Đã chọn ${selectedIds.size} truyện` : `Tổng ${listHistory.length} truyện`}
          </span>
          {selectedIds.size > 0 ? (
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setSelectedIds(new Set())} className="rounded-lg px-3 py-1.5 text-sm text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700">
                Bỏ chọn
              </button>
              <button type="button" onClick={confirmDelete} className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700">
                Xóa đã chọn ({selectedIds.size})
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setSelectedIds(new Set(paginatedComics.map((c) => c.id)))} className="rounded-lg px-3 py-1.5 text-sm text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700">
              Chọn tất cả
            </button>
          )}
        </div>
      )}

      {listHistory.length > 0 ? (
        <div className="space-y-6">
          <div className="mx-3 grid grid-cols-2 gap-[12px] xs:grid-cols-3 sm:grid-cols-4 lg:mx-0 lg:grid-cols-6">
            {paginatedComics.map((comic) => (
              <div key={comic.id} className="relative">
                {selectedIds.size > 0 && (
                  <button type="button" onClick={() => toggleSelect(comic.id)} className={`absolute left-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${selectedIds.has(comic.id) ? 'border-primary-100 bg-primary-100 text-white' : 'border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-800'}`}>
                    {selectedIds.has(comic.id) && <AccountIcon name="check" className="h-3 w-3" />}
                  </button>
                )}
                <ComicCard comic={comic} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav aria-label="Pagination navigation" className="flex items-center justify-center gap-2">
              <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-700">
                Trước
              </button>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">{safePage} / {totalPages}</span>
              <button type="button" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-700">
                Sau
              </button>
            </nav>
          )}
        </div>
      ) : (
        <GlassCard className="p-12">
          <EmptyState
            icon="clock"
            title="Chưa có lịch sử đọc"
            description="Bạn chưa đọc truyện nào. Hãy khám phá ngay!"
            actionHref="/"
            actionLabel="Khám phá truyện"
          />
        </GlassCard>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowConfirm(false)}>
          <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white/80 p-6 shadow-xl backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-800/80" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <h3 className="mb-4 text-lg font-bold text-neutral-900 dark:text-light-text">Xóa lịch sử đọc</h3>
            <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
              Bạn có chắc chắn muốn xóa <strong>{selectedIds.size}</strong> truyện khỏi lịch sử đọc?
            </p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowConfirm(false)} className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-700">
                Hủy
              </button>
              <button type="button" onClick={doDelete} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
