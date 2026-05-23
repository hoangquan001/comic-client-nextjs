'use client';

import { useHotComics } from '@/lib/hooks/use-comic-queries';
import { GridComic } from '@/components/common/grid-comic/grid-comic';
import { Pagination } from '@/components/common/pagination/pagination';
import { Breadcrumb } from '@/components/common/breadcrumb/breadcrumb';
import { TopList } from '@/components/common/top-list/top-list';
import RecentCommentsPanel from '@/components/common/recent-comments/recent-comments-panel';
import { Spinner } from '@/components/common/spinner/spinner';
import type { ComicList } from '@/types';

interface HotComicsContentProps {
  page: number;
  initialData?: ComicList | null;
}

export default function HotComicsContent({ page, initialData }: HotComicsContentProps) {
  const { data, isLoading } = useHotComics(page);

  const comics = initialData?.comics ?? data?.comics ?? [];
  const totalpage = initialData?.totalpage ?? data?.totalpage ?? 1;
  const loading = !initialData && isLoading;

  return (
    <div className="container mx-auto py-4">
      <Breadcrumb items={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Truyện tranh hot', href: '/truyen-hot' },
      ]} />

      <div className="mt-4 grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div id="listComic" className="xl:col-span-3">
          {loading ? (
            <Spinner />
          ) : (
            <GridComic
              title="Truyện tranh hot"
              listComics={comics}
            />
          )}
          <Pagination
            currentPage={page}
            totalpage={totalpage}
            rootLink="/truyen-hot"
          />
        </div>
        <div className="xl:col-span-1">
          <TopList />
          <div className="mt-4">
            <RecentCommentsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
