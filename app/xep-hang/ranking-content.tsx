'use client';

import { useRouter } from 'next/navigation';
import { useComics } from '@/lib/hooks/use-comic-queries';
import { GridComic } from '@/components/common/grid-comic/grid-comic';
import { Pagination } from '@/components/common/pagination/pagination';
import { Breadcrumb } from '@/components/common/breadcrumb/breadcrumb';
import { Spinner } from '@/components/common/spinner/spinner';
import Selection from '@/components/common/selection/selection';
import { SortType, ComicStatus } from '@/types';
import type { ComicList } from '@/types';

const SORT_OPTIONS = [
  { value: SortType.TopAll, label: 'Top All' },
  { value: SortType.TopMonth, label: 'Top Tháng' },
  { value: SortType.TopWeek, label: 'Top Tuần' },
  { value: SortType.TopDay, label: 'Top Ngày' },
  { value: SortType.TopFollow, label: 'Theo dõi' },
  { value: SortType.TopComment, label: 'Bình luận' },
  { value: SortType.NewComic, label: 'Truyện mới' },
  { value: SortType.LastUpdate, label: 'Mới cập nhật' },
  { value: SortType.Chapter, label: 'Số chương' },
];

const STATUS_OPTIONS = [
  { value: ComicStatus.ALL, label: 'Tất cả' },
  { value: ComicStatus.ONGOING, label: 'Đang ra' },
  { value: ComicStatus.COMPLETED, label: 'Hoàn thành' },
];

interface RankingContentProps {
  page: number;
  sort: number;
  status: number;
  initialData?: ComicList | null;
}

export default function RankingContent({ page, sort, status, initialData }: RankingContentProps) {
  const router = useRouter();

  const { data, isLoading } = useComics({
    page: String(page),
    step: '35',
    genre: '-1',
    sort: String(sort),
    status: String(status),
  });

  const comics = initialData?.comics ?? data?.comics ?? [];
  const totalpage = initialData?.totalpage ?? data?.totalpage ?? 1;
  const loading = !initialData && isLoading;

  const updateQuery = (updates: Record<string, string | number>) => {
    const current: Record<string, string | number> = { sort, page };
    if (status >= 0) current.status = status;
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries({ ...current, ...updates })) {
      if (value === undefined || value === '' || value === -1) continue;
      params.set(key, String(value));
    }
    router.push(`/xep-hang?${params.toString()}#listComic`);
  };

  return (
    <div className="lg:container mx-auto py-2">
      <Breadcrumb items={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Xếp hạng', href: '/xep-hang' },
      ]} />

      <div className="mt-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-8 h-8 text-amber-500" fill="currentColor" viewBox="0 0 512 512">
            <polygon points="315.626,238.151 274.426,232.165 256,194.831 237.574,232.165 196.374,238.151 226.188,267.212 219.149,308.245 256,288.871 292.851,308.245 285.812,267.212" />
            <polygon points="176.72,238.151 135.52,232.165 117.094,194.831 98.67,232.165 57.469,238.151 87.282,267.212 80.244,308.245 117.094,288.871 153.946,308.245 146.907,267.212" />
            <polygon points="454.531,238.151 413.33,232.165 394.905,194.831 376.48,232.165 335.28,238.151 365.093,267.212 358.054,308.245 394.905,288.871 431.756,308.245 424.718,267.212" />
          </svg>
          <div>
            <h1 className="text-2xl font-bold">Bảng Xếp Hạng Truyện Tranh</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Khám phá những bộ truyện tranh được yêu thích nhất</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Sắp xếp:</label>
            <Selection
              value={sort}
              options={SORT_OPTIONS}
              onChange={(nextValue) => updateQuery({ sort: Number(nextValue), page: 1 })}
              className="px-3 py-1.5 rounded-lg bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 text-sm outline-none focus:ring focus:ring-blue-500/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Trạng thái:</label>
            <Selection
              value={status}
              options={STATUS_OPTIONS}
              onChange={(nextValue) => updateQuery({ status: Number(nextValue), page: 1 })}
              className="px-3 py-1.5 rounded-lg bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 text-sm outline-none focus:ring focus:ring-blue-500/30"
            />
          </div>
        </div>

        {/* Comics */}
        {loading ? (
          <Spinner />
        ) : (
          <GridComic listComics={comics} title="" />
        )}

        <Pagination
          currentPage={page}
          totalpage={totalpage}
          rootLink="/xep-hang"
        />
      </div>
    </div>
  );
}
