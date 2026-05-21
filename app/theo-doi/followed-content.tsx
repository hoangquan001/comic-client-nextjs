'use client';

import { useFollowedComics, useFollow } from '@/lib/hooks/use-account-queries';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { GridComic } from '@/components/common/grid-comic/grid-comic';
import { Pagination } from '@/components/common/pagination/pagination';
import { Breadcrumb } from '@/components/common/breadcrumb/breadcrumb';
import { Spinner } from '@/components/common/spinner/spinner';
import { Empty } from '@/components/common/empty/empty';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Comic } from '@/types';
import { getComicDetailUrl, getChapterDetailUrl } from '@/lib/utils/url';
import { dateAgo } from '@/lib/utils/date';
import { formatNumber } from '@/lib/utils/number';

interface FollowedContentProps {
  page: number;
}

export default function FollowedContent({ page }: FollowedContentProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data, isLoading } = useFollowedComics(page);
  const followMutation = useFollow();

  const comics = data?.comics ?? [];
  const totalpage = data?.totalpage ?? 1;

  const [confirmComic, setConfirmComic] = useState<Comic | null>(null);

  const handleUnfollow = (comic: Comic) => {
    setConfirmComic(comic);
  };

  const confirmUnfollow = () => {
    if (!confirmComic) return;
    followMutation.mutate({ comicId: confirmComic.id, isFollow: false });
    setConfirmComic(null);
  };

  return (
    <div className="container mx-auto py-4">
      <Breadcrumb items={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Theo dõi', href: '/theo-doi' },
      ]} />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : !isAuthenticated ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Empty message="" />
          <p className="mt-4 text-center">
            Vui lòng{' '}
            <Link href="/auth/dang-nhap" className="text-primary-100 font-bold">đăng nhập</Link>{' '}
            để xem danh sách truyện đã theo dõi
          </p>
        </div>
      ) : comics.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Empty message="Bạn chưa theo dõi truyện nào" />
        </div>
      ) : (
        <div id="comics" className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="block-title flex items-center gap-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" />
                <path d="M12 20l-7 -7a4 4 0 0 1 6.5 -6a.9 .9 0 0 0 1 0a4 4 0 0 1 6.5 6l-7 7" />
              </svg>
              Theo dõi
            </h2>
            <Link
              href="/dong-bo-truyen"
              className="px-4 py-2 flex bg-primary-100 text-white hover:bg-primary-100/90 border rounded-lg items-center justify-center gap-1.5"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor">
                <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8z" />
                <path d="M12 18c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
              </svg>
              <span className="hidden lg:block">Đồng bộ</span>
            </Link>
          </div>

          <div className="grid gap-3 grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4 @4xl:grid-cols-5 @5xl:grid-cols-6 @6xl:grid-cols-7 mx-2">
            {comics.map((comic) => (
              <div key={comic.id} className="relative group">
                {/* ComicCard will be rendered inline for action overlay */}
                <ComicCardWithAction comic={comic} onUnfollow={handleUnfollow} />
              </div>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalpage={totalpage}
            rootLink="/theo-doi"
          />
        </div>
      )}

      {/* Confirm Modal */}
      {confirmComic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setConfirmComic(null)}>
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 max-w-sm mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2">Hủy theo dõi truyện</h3>
            <p className="text-sm opacity-80 mb-4">
              Bạn có chắc chắn muốn hủy theo dõi <strong>{confirmComic.title}</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmComic(null)} className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-sm">
                Hủy
              </button>
              <button onClick={confirmUnfollow} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm">
                Hủy theo dõi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ComicCardWithAction({ comic, onUnfollow }: { comic: Comic; onUnfollow: (comic: Comic) => void }) {
  const statusName = comic.status === 1 ? 'Full' : 'Đang ra';
  const hasChapters = !!(comic.chapters?.length);
  const firstChapter = comic.chapters?.[0];

  return (
    <div className="card-v1-container group relative">
      <button
        onClick={() => onUnfollow(comic)}
        className="absolute top-1.5 right-1.5 z-10 bg-red-500 hover:bg-red-600 rounded-md text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Hủy theo dõi"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      <span className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
        <span className="text-yellow-400">★</span>
        {comic.rating}
      </span>

      <Link href={getComicDetailUrl(comic)} title={comic.title} className="block relative overflow-hidden">
        <Image
          src={comic.coverImage || '/empty.png'}
          alt={comic.title}
          className="comic-card-image w-full aspect-[3/4] object-cover"
          loading="lazy"
          width={300}
          height={400}
          onError={(e) => { (e.target as HTMLImageElement).src = '/empty.png'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
          <h3 className="text-white line-clamp-2 text-sm font-semibold">{comic.title}</h3>
          {hasChapters && (
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${comic.status === 1 ? 'bg-green-400' : 'bg-blue-400'}`} />
                <span className="text-xs">{statusName}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-300">
                <span>{formatNumber(comic.viewCount)}</span>
              </div>
            </div>
          )}
        </div>
      </Link>

      {hasChapters && firstChapter && (
        <Link
          href={getChapterDetailUrl(comic, firstChapter)}
          className="card-footer block px-2 py-1.5 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
          <p className="text-xs font-medium truncate">Chapter {firstChapter.slug}</p>
          <span className="text-xs text-gray-500">{dateAgo(comic.updateAt)}</span>
        </Link>
      )}
    </div>
  );
}
