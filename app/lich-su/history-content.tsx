'use client';

import { useEffect, useState } from 'react';
import { useHistoryStore } from '@/lib/stores/use-history-store';
import { useComicsByIds } from '@/lib/hooks/use-comic-queries';
import { Pagination } from '@/components/common/pagination/pagination';
import { Breadcrumb } from '@/components/common/breadcrumb/breadcrumb';
import { Spinner } from '@/components/common/spinner/spinner';
import { Empty } from '@/components/common/empty/empty';
import type { Comic } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { getComicDetailUrl, getChapterDetailUrl } from '@/lib/utils/url';
import { dateAgo } from '@/lib/utils/date';
import { formatNumber } from '@/lib/utils/number';
import { GridComic } from '@/components/common';

const COMICS_PER_PAGE = 14;

interface HistoryContentProps {
  page: number;
}

export default function HistoryContent({ page }: HistoryContentProps) {
  const { listHistory, initialize, removeHistory } = useHistoryStore();
  const [confirmComic, setConfirmComic] = useState<Comic | null>(null);

  useEffect(() => { initialize(); }, [initialize]);

  const totalpage = Math.max(1, Math.ceil(listHistory.length / COMICS_PER_PAGE));
  const pageIds = listHistory
    .slice((page - 1) * COMICS_PER_PAGE, page * COMICS_PER_PAGE)
    .map((c) => c.id);

  const { data: comics, isLoading } = useComicsByIds(pageIds);

  const handleRemove = (comic: Comic) => setConfirmComic(comic);
  const confirmRemove = () => {
    if (!confirmComic) return;
    removeHistory(confirmComic.id);
    setConfirmComic(null);
  };

  return (
    <div className="lg:container mx-auto py-2">
      <Breadcrumb items={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Lịch sử', href: '/lich-su' },
      ]} />
      <div className="mt-4">
        {isLoading ? (
          <Spinner />
        ) : comics && comics.length > 0 ? (
          <>
            <GridComic title="Lịch sử" listComics={comics} />
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

function HistoryComicCard({ comic }: { comic: Comic }) {
  const hasChapters = !!(comic.chapters?.length);
  const firstChapter = comic.chapters?.[0];
  return (
    <div className="card-v1-container">
      <span className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
        <span className="text-yellow-400">★</span>{comic.rating}
      </span>
      <Link href={getComicDetailUrl(comic)} title={comic.title} className="block relative overflow-hidden">
        <Image src={comic.coverImage || '/empty.png'} alt={comic.title} className="comic-card-image w-full aspect-[3/4] object-cover" loading="lazy" width={300} height={400} onError={(e) => { (e.target as HTMLImageElement).src = '/empty.png'; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
          <h3 className="text-white line-clamp-2 text-sm font-semibold">{comic.title}</h3>
          {hasChapters && (
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${comic.status === 1 ? 'bg-green-400' : 'bg-blue-400'}`} />
                <span className="text-xs">{comic.status === 1 ? 'Full' : 'Đang ra'}</span>
              </div>
              <span className="text-xs text-gray-300">{formatNumber(comic.viewCount)}</span>
            </div>
          )}
        </div>
      </Link>
      {hasChapters && firstChapter && (
        <Link href={getChapterDetailUrl(comic, firstChapter)} className="card-footer block px-2 py-1.5 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700">
          <p className="text-xs font-medium truncate">Chapter {firstChapter.slug}</p>
          <span className="text-xs text-gray-500">{dateAgo(comic.updateAt)}</span>
        </Link>
      )}
    </div>
  );
}
