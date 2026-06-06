import { GridComic } from '@/components/common/grid-comic/grid-comic';
import { Pagination } from '@/components/common/pagination/pagination';
import { Breadcrumb } from '@/components/common/breadcrumb/breadcrumb';
import { TopList } from '@/components/common/top-list/top-list';
import type { ComicList } from '@/types';
import { getServerGridType } from '@/lib/utils/cookie';
import { Flame } from 'lucide-react';

interface HotComicsContentProps {
  page: number;
  initialData: ComicList | null;
}

export default async function HotComicsContent({ page, initialData }: HotComicsContentProps) {

  const comics = initialData?.comics ?? []
  const totalpage = initialData?.totalpage ?? 1;
  const gridType = await getServerGridType();

  return (
    <div className="lg:container mx-auto w-full p-2">
      <Breadcrumb items={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Truyện tranh hot', href: '/truyen-hot' },
      ]} />

      <div className="mt-4 grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div id="listComic" className="xl:col-span-3">

          <GridComic
            title="Truyện tranh hot"
            listComics={comics}
            defaultGridType={gridType}
            iconTemplate={<Flame className="size-5 shrink-0 text-primary-100" />}
          />

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
