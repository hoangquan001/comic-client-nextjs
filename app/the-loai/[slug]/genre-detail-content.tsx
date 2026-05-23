'use client';

import { useRouter } from 'next/navigation';
import { useComics } from '@/lib/hooks/use-comic-queries';
import { GridComic } from '@/components/common/grid-comic/grid-comic';
import { Pagination } from '@/components/common/pagination/pagination';
import { Spinner } from '@/components/common/spinner/spinner';
import Selection from '@/components/common/selection/selection';
import { GENRES } from '@/lib/constants/genres';
import { SortType, ComicStatus } from '@/types';
import type { ComicList } from '@/types';
import Link from 'next/link';

const SORT_OPTIONS = [
  { value: SortType.LastUpdate, label: 'Mới cập nhật' },
  { value: SortType.TopAll, label: 'Top All' },
  { value: SortType.TopMonth, label: 'Top Tháng' },
  { value: SortType.TopWeek, label: 'Top Tuần' },
  { value: SortType.TopDay, label: 'Top Ngày' },
  { value: SortType.TopFollow, label: 'Theo dõi' },
  { value: SortType.TopComment, label: 'Bình luận' },
  { value: SortType.NewComic, label: 'Truyện mới' },
];

const STATUS_OPTIONS = [
  { value: ComicStatus.ALL, label: 'Tất cả' },
  { value: ComicStatus.ONGOING, label: 'Đang ra' },
  { value: ComicStatus.COMPLETED, label: 'Hoàn thành' },
];

interface GenreDetailContentProps {
  slug: string;
  genre: { id: number; title: string; slug?: string; description?: string | null };
  page: number;
  sort: number;
  status: number;
  initialData?: ComicList | null;
}

export default function GenreDetailContent({ slug, genre, page, sort, status, initialData }: GenreDetailContentProps) {
  const router = useRouter();

  const { data, isLoading } = useComics({
    page: String(page),
    step: '35',
    genre: String(genre.id),
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
      if (value === undefined || value === -1) continue;
      params.set(key, String(value));
    }
    router.push(`/the-loai/${slug}?${params.toString()}#listComic`);
  };

  const description = genre.description || `Khám phá kho tàng truyện tranh thể loại ${genre.title} với những câu chuyện hấp dẫn, đa dạng và phong phú.`;

  return (
    <div className="lg:container mx-auto py-2">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-5 text-neutral-500">
        <Link href="/" className="hover:text-primary-100">Trang chủ</Link>
        <span>/</span>
        <Link href="/the-loai" className="hover:text-primary-100">Thể loại</Link>
        <span>/</span>
        <span className="text-neutral-800 dark:text-neutral-200 font-medium">{genre.title}</span>
      </nav>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Comics Section */}
        <div className="xl:col-span-9">
          {/* Genre Header */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold inline-flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M5 10H7C9 10 10 9 10 7V5C10 3 9 2 7 2H5C3 2 2 3 2 5V7C2 9 3 10 5 10Z" />
                <path d="M17 10H19C21 10 22 9 22 7V5C22 3 21 2 19 2H17C15 2 14 3 14 5V7C14 9 15 10 17 10Z" />
                <path d="M17 22H19C21 22 22 21 22 19V17C22 15 21 14 19 14H17C15 14 14 15 14 17V19C14 21 15 22 17 22Z" />
                <path d="M5 22H7C9 22 10 21 10 19V17C10 15 9 14 7 14H5C3 14 2 15 2 17V19C2 21 3 22 5 22Z" />
              </svg>
              Thể loại {genre.title}
              <span className="text-lg font-normal opacity-70">({totalpage * 35} truyện)</span>
            </h1>
            <p className="text-sm opacity-70 mt-1">{description}</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Sắp xếp:</label>
              <Selection
                value={sort}
                options={SORT_OPTIONS}
                onChange={(nextValue) => updateQuery({ sort: Number(nextValue), page: 1 })}
                className="px-3 py-1.5 rounded-lg bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 text-sm outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Trạng thái:</label>
              <Selection
                value={status}
                options={STATUS_OPTIONS}
                onChange={(nextValue) => updateQuery({ status: Number(nextValue), page: 1 })}
                className="px-3 py-1.5 rounded-lg bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 text-sm outline-none"
              />
            </div>
          </div>

          {/* Comics Grid */}
          {loading ? (
            <Spinner />
          ) : (
            <GridComic listComics={comics} title="" />
          )}

          <Pagination
            currentPage={page}
            totalpage={totalpage}
            rootLink={`/the-loai/${slug}`}
          />
        </div>

        {/* Genre Sidebar */}
        <div className="xl:col-span-3">
          <div className="rounded-2xl p-4 bg-white/80 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
            <h2 className="text-lg uppercase font-bold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Danh sách thể loại
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-2 gap-2">
              {GENRES.map((g) => (
                <Link
                  key={g.id}
                  href={`/the-loai/${g.slug}`}
                  title={g.title}
                  className={`px-3 py-2 rounded-md text-sm font-medium no-underline transition-colors ${
                    g.slug === slug
                      ? 'bg-primary-100 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-200 hover:text-white hover:bg-primary-100'
                  }`}
                >
                  {g.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
