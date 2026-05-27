'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAdvanceSearch } from '@/lib/hooks/use-comic-queries';
import { GridComic } from '@/components/common/grid-comic/grid-comic';
import { Pagination } from '@/components/common/pagination/pagination';
import { Breadcrumb } from '@/components/common/breadcrumb/breadcrumb';
import { TopList } from '@/components/common/top-list/top-list';
import RecentCommentsPanel from '@/components/common/recent-comments/recent-comments-panel';
import { Spinner } from '@/components/common/spinner/spinner';
import { Empty } from '@/components/common/empty/empty';
import Selection from '@/components/common/selection/selection';
import { GENRES } from '@/lib/constants/genres';
import { SortType } from '@/types';
import type { ComicList, Genre } from '@/types';
import { useClickOutside } from '@/lib/hooks/use-click-outside';
import dynamic from 'next/dynamic';
import Link from 'next/link';
const GenreCategories = dynamic(() => import('@/components/common/genre-categories/genre-categories'), { ssr: false });
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
  { value: -1, label: 'Tất cả' },
  { value: 0, label: 'Đang ra' },
  { value: 1, label: 'Hoàn thành' },
];

interface SearchContentProps {
  page: number;
  sort: number;
  status: number;
  genres: string;
  nogenres: string;
  year: number;
  keyword: string;
  initialData?: ComicList | null;
  gridType: number
}

function getInitialGenreState(genresParam: string, nogenresParam: string) {
  const state: Record<number, number> = {};
  genresParam.split(',').filter(Boolean).forEach((id) => { state[Number(id)] = 1; });
  nogenresParam.split(',').filter(Boolean).forEach((id) => { state[Number(id)] = 2; });
  return state;
}

export default function SearchContent({
  page: initialPage,
  sort: initialSort,
  status: initialStatus,
  genres: genresParam,
  nogenres: nogenresParam,
  year: yearParam,
  keyword: keywordParam,
  initialData,
  gridType
}: SearchContentProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => setShowGenre(false));

  const [showGenre, setShowGenre] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [keyword, setKeyword] = useState(keywordParam);
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [selectedYear, setSelectedYear] = useState(yearParam > 0 ? yearParam : new Date().getFullYear());
  const [genreState, setGenreState] = useState<Record<number, number>>(
    () => getInitialGenreState(genresParam, nogenresParam)
  );

  const { data, isLoading } = useAdvanceSearch({
    page: initialPage,
    step: 30,
    sort: initialSort,
    status: initialStatus,
    genres: genresParam || undefined,
    nogenres: nogenresParam || undefined,
    year: yearParam > 0 ? yearParam : undefined,
    keyword: keywordParam || undefined,
  });

  const comics = initialData?.comics ?? data?.comics ?? [];
  const totalpage = initialData?.totalpage ?? data?.totalpage ?? 1;
  const totalResult = totalpage > 0 ? ((totalpage - 1) * 30 + comics.length) : 0;
  const loading = !initialData && isLoading;

  const performSearch = useCallback(() => {
    const genres: string[] = [];
    const nogenres: string[] = [];
    Object.entries(genreState).forEach(([key, value]) => {
      if (value === 1) genres.push(key);
      if (value === 2) nogenres.push(key);
    });

    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (selectedSort !== SortType.LastUpdate) params.set('sort', String(selectedSort));
    if (selectedStatus !== -1) params.set('status', String(selectedStatus));
    if (genres.length) params.set('genres', genres.join(','));
    if (nogenres.length) params.set('nogenres', nogenres.join(','));
    if (selectedYear > 0) params.set('year', String(selectedYear));
    params.set('page', '1');

    router.push(`/tim-truyen?${params.toString()}#listComic`);
  }, [keyword, selectedSort, selectedStatus, genreState, selectedYear, router]);

  const getHref = () => {
    const genres: string[] = [];
    const nogenres: string[] = [];
    Object.entries(genreState).forEach(([key, value]) => {
      if (value === 1) genres.push(key);
      if (value === 2) nogenres.push(key);
    });

    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (selectedSort !== SortType.LastUpdate) params.set('sort', String(selectedSort));
    if (selectedStatus !== -1) params.set('status', String(selectedStatus));
    if (genres.length) params.set('genres', genres.join(','));
    if (nogenres.length) params.set('nogenres', nogenres.join(','));
    if (selectedYear > 0) params.set('year', String(selectedYear));
    params.set('page', '1');

    return(`/tim-truyen?${params.toString()}#listComic`);
  };

  const toggleGenre = (genre?: Genre) => {
    if (!genre) return;
    const genreId = genre.id;
    setGenreState((prev) => {
      const current = prev[genreId] || 0;
      return { ...prev, [genreId]: (current + 1) % 3 };
    });
  };

  const activeGenreKeys = Object.entries(genreState).filter(([, v]) => v > 0);

  return (
    <div className="lg:container mx-auto w-full p-2">
      <Breadcrumb items={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Tìm truyện', href: '/tim-truyen' },
      ]} />

      <div className="mt-4">
        {/* Search Bar */}
        <div className="grid gap-2 md:grid-cols-[1fr_12rem]">
          <form
            className="flex items-center relative"
            onSubmit={(e) => { e.preventDefault(); performSearch(); }}
          >
            <div className="absolute left-3 p-2">
              <svg className="w-5 h-5 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16m10 2-4.35-4.35" />
              </svg>
            </div>
            <input
              className="bg-neutral-200 dark:bg-neutral-700 w-full h-10 rounded-lg pl-12 pr-4 focus:outline-primary-100 outline-none"
              type="search"
              placeholder="Nhập tên truyện..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </form>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`rounded-lg flex items-center justify-center gap-2 text-white font-medium ${showFilters ? 'bg-primary-100/80' : 'bg-primary-100 hover:bg-primary-100/90'}`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            {showFilters ? 'Ẩn bộ lọc' : 'Thêm bộ lọc'}
          </button>
        </div>

        {/* Active Filter Tags */}
        {(selectedSort !== SortType.LastUpdate || selectedStatus !== -1 || activeGenreKeys.length > 0 || yearParam > 0) && (
          <div className="flex flex-wrap gap-2 py-2">
            {selectedSort !== SortType.LastUpdate && (
              <span className="px-2 border border-primary-100 text-primary-100 rounded-full text-sm flex items-center gap-1">
                {SORT_OPTIONS.find((o) => o.value === selectedSort)?.label}
                <button onClick={() => { setSelectedSort(SortType.LastUpdate); }} className="hover:text-red-500">x</button>
              </span>
            )}
            {selectedStatus !== -1 && (
              <span className="px-2 border border-primary-100 text-primary-100 rounded-full text-sm flex items-center gap-1">
                {STATUS_OPTIONS.find((o) => o.value === selectedStatus)?.label}
                <button onClick={() => { setSelectedStatus(-1); }} className="hover:text-red-500">x</button>
              </span>
            )}
            {activeGenreKeys.map(([id, val]) => {
              const genre = GENRES.find((g) => g.id === Number(id));
              return (
                <span
                  key={id}
                  className={`px-2 rounded-full text-sm flex items-center gap-1 ${val === 2
                    ? 'text-red-500 line-through outline-1 outline-dashed outline-red-500'
                    : 'border border-primary-100 text-primary-100'
                    }`}
                >
                  {genre?.title}
                  <button onClick={() => toggleGenre(genre)} className="hover:text-red-500">x</button>
                </span>
              );
            })}
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 my-4 p-4 rounded-xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
            <div className="space-y-1">
              <label className="text-xs text-neutral-500">Sắp xếp theo</label>
              <Selection
                ariaLabel="Sắp xếp kết quả tìm kiếm"
                value={selectedSort}
                options={SORT_OPTIONS}
                onChange={(nextValue) => setSelectedSort(Number(nextValue))}
                className="w-full px-2 py-1.5 rounded-md bg-neutral-100 dark:bg-neutral-700 text-sm outline-none"
              />
            </div>
            <div ref={containerRef} className="relative">
              <label className="text-xs text-neutral-500">Thể loại</label>
              <button onClick={() => setShowGenre(true)} type="button" className="w-full grid grid-cols-[1fr_1rem] px-2 py-1 rounded-md transition-[background-color,outline-color] outline-1 outline-transparent focus:outline-primary font-medium bg-neutral-100 dark:bg-neutral-700 hover:outline hover:outline-primary-100">
                <span className="truncate text-left font-semibold">Thể loại</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 my-auto text-neutral-500"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 9l4-4l4 4m0 6l-4 4l-4-4"></path></svg>
              </button>
              {showGenre &&
                <div className="absolute left-0 z-40 text-black dark:text-light-text">
                  <GenreCategories routerLinkGenres={false} statusGenres={genreState} onClickGenre={toggleGenre}></GenreCategories>
                </div>}

            </div>
            <div className="space-y-1">
              <label className="text-xs text-neutral-500">Trạng thái</label>
              <Selection
                ariaLabel="Lọc trạng thái kết quả tìm kiếm"
                value={selectedStatus}
                options={STATUS_OPTIONS}
                onChange={(nextValue) => setSelectedStatus(Number(nextValue))}
                className="w-full px-2 py-1.5 rounded-md bg-neutral-100 dark:bg-neutral-700 text-sm outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-neutral-500">Năm phát hành</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={selectedYear > 0 ? selectedYear : ''}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  placeholder="Năm"
                  className="flex-1 px-2 py-1.5 rounded-md bg-neutral-100 dark:bg-neutral-700 text-sm outline-none"
                  min={1900}
                  max={4000}
                />
                <button onClick={() => setSelectedYear((y) => y - 1)} className="text-neutral-500 hover:text-primary-100">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14" /></svg>
                </button>
                <button onClick={() => setSelectedYear((y) => y + 1)} className="text-neutral-500 hover:text-primary-100">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 5v14m-7-7h14" /></svg>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Search Button */}
        <div className="flex justify-start my-3">
          <Link
            href={getHref()}
            className="cursor-pointer bg-primary-100 hover:bg-primary-100/90 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="10" cy="10" r="7" />
              <line x1="21" y1="21" x2="15" y2="15" />
            </svg>
            Tìm kiếm
          </Link>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          <div id="listComic" className="xl:col-span-3">
            {loading ? (
              <Spinner />
            ) : comics.length > 0 ? (
              <>
                <GridComic listComics={comics} title={`(${totalResult}) kết quả`} defaultGridType={gridType} />
                <Pagination currentPage={initialPage} totalpage={totalpage} rootLink="/tim-truyen" />
              </>
            ) : (
              <div className="flex justify-center py-20">
                <Empty message="Không tìm thấy truyện" />
              </div>
            )}
          </div>
          <div className="xl:col-span-1">
            <TopList />
            <div className="mt-4">
              <RecentCommentsPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
