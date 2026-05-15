'use client';

import { useSearchParams } from 'next/navigation';
import { useHotComics } from '@/lib/hooks/use-comic-queries';
import { GridComic } from '@/components/common/grid-comic/grid-comic';
import { Pagination } from '@/components/common/pagination/pagination';
import { Breadcrumb } from '@/components/common/breadcrumb/breadcrumb';
import { TopList } from '@/components/common/top-list/top-list';
import { Spinner } from '@/components/common/spinner/spinner';

export default function HotComicsContent() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  const { data, isLoading } = useHotComics(page);

  const comics = data?.comics ?? [];
  const totalpage = data?.totalpage ?? 1;

  return (
    <div className="container mx-auto px-3 py-4">
      <Breadcrumb items={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Truyện tranh hot', href: '/truyen-hot' },
      ]} />

      <div className="mt-4 grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div id="listComic" className="xl:col-span-3">
          {isLoading ? (
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
        </div>
      </div>
    </div>
  );
}
