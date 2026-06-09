'use client';

import { useFollowedComics, useFollow } from '@/lib/hooks/use-account-queries';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { GridComic, Pagination, Breadcrumb, Spinner, Empty } from '@/components/common';
import Link from 'next/link';
import { useState } from 'react';
import type { Comic } from '@/types';
import { Heart } from 'lucide-react';
interface FollowedContentProps {
  page: number;
  gridType: number;
  isAuthenticated: boolean;
}

export default function FollowedContent({ page, gridType, isAuthenticated }: FollowedContentProps) {
  const { data, isLoading } = useFollowedComics(page, 28, isAuthenticated);
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
    <div className="lg:container mx-auto w-full p-2">
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
          <GridComic
            title="Theo dõi"
            listComics={comics}
            defaultGridType={gridType}
            iconTemplate={<Heart className="size-5 shrink-0 text-primary-100" />}
            actionClick={handleUnfollow}
            actionTemplate={
              <span
                className="absolute top-1.5 left-1.5 z-10 bg-red-500 hover:bg-red-600 rounded-md text-white p-1 "
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </span>
            }
          >

          </GridComic>
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
