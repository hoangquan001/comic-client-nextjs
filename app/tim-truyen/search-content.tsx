'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAdvanceSearch } from '@/lib/hooks/use-comic-queries';
import { GridComic } from '@/components/common/grid-comic/grid-comic';
import { Pagination } from '@/components/common/pagination/pagination';
import { Breadcrumb } from '@/components/common/breadcrumb/breadcrumb';
import { TopList } from '@/components/common/top-list/top-list';
import { Spinner } from '@/components/common/spinner/spinner';
import { Empty } from '@/components/common/empty/empty';
import { GENRES } from '@/lib/constants/genres';
import { SortType, ComicStatus } from '@/types';

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

export default function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get('page')) || 1;
  const sort = Number(searchParams.get('sort')) >= 0 ? Number(searchParams.get('sort')) : SortType.LastUpdate;
  const status = Number(searchParams.get('status')) >= 0 ? Number(searchParams.get('status')) : -1;
  const genresParam = searchParams.get('genres') || '';
  const nogenresParam = searchParams.get('nogenres') || '';
  const yearParam = Number(searchParams.get('year')) || -1;
  const keywordParam = searchParams.get('keyword') || '';

  const [showFilters, setShowFilters] = useState(false);
  const [keyword, setKeyword] = useState(keywordParam);
  const [selectedSort, setSelectedSort] = useState(sort);
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [selectedYear, setSelectedYear] = useState(yearParam > 0 ? yearParam : new Date().getFullYear());
  const [genreState, setGenreState] = useState<Record<number, number>>({});

  // Init genre state from URL
  useEffect(() => {
    const state: Record<number, number> = {};
    genresParam.split(',').filter(Boolean).forEach((id) => { state[Number(id)] = 1; });
    nogenresParam.split(',').filter(Boolean).forEach((id) => { state[Number(id)] = 2; });
    setGenreState(state);
  }, []);

  const { data, isLoading } = useAdvanceSearch({
    page,
    step: 30,
    sort: selectedSort,
    status: selectedStatus,
    genres: genresParam || undefined,
    nogenres: nogenresParam || undefined,
    year: yearParam > 0 ? yearParam : undefined,
    keyword: keywordParam || undefined,
  });

  const comics = data?.comics ?? [];
  const totalpage = data?.totalpage ?? 1;
  const totalResult = totalpage > 0 ? ((totalpage - 1) * 30 + comics.length) : 0;

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

  const toggleGenre = (genreId: number) => {
    setGenreState((prev) => {
      const current = prev[genreId] || 0;
      return { ...prev, [genreId]: (current + 1) % 3 };
    });
  };

  const activeGenreKeys = Object.entries(genreState).filter(([, v]) => v > 0);

  return (
    <div className="container mx-auto px-3 py-4">
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
                  className={`px-2 rounded-full text-sm flex items-center gap-1 ${
                    val === 2
                      ? 'text-red-500 line-through outline-1 outline-dashed outline-red-500'
                      : 'border border-primary-100 text-primary-100'
                  }`}
                >
                  {genre?.title}
                  <button onClick={() => toggleGenre(Number(id))} className="hover:text-red-500">x</button>
                </span>
              );
            })}
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 my-4 p-4 rounded-xl bg-white/80 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800">
            <div className="space-y-1">
              <label className="text-xs text-neutral-500">Sắp xếp theo</label>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(Number(e.target.value))}
                className="w-full px-2 py-1.5 rounded-md bg-neutral-100 dark:bg-neutral-700 text-sm outline-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-neutral-500">Trạng thái</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(Number(e.target.value))}
                className="w-full px-2 py-1.5 rounded-md bg-neutral-100 dark:bg-neutral-700 text-sm outline-none"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
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
            <div className="space-y-1">
              <label className="text-xs text-neutral-500">Thể loại</label>
              <div className="flex flex-wrap gap-1 max-h-48 overflow-y-auto">
                {GENRES.map((genre) => {
                  const state = genreState[genre.id] || 0;
                  return (
                    <button
                      key={genre.id}
                      onClick={() => toggleGenre(genre.id)}
                      className={`px-2 py-1 rounded text-xs ${
                        state === 1
                          ? 'bg-primary-100 text-white'
                          : state === 2
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-500 line-through'
                          : 'bg-neutral-100 dark:bg-neutral-700'
                      }`}
                    >
                      {genre.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Search Button */}
        <div className="flex justify-start my-3">
          <button
            onClick={performSearch}
            className="bg-primary-100 hover:bg-primary-100/90 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="10" cy="10" r="7" />
              <line x1="21" y1="21" x2="15" y2="15" />
            </svg>
            Tìm kiếm
          </button>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          <div id="listComic" className="xl:col-span-3">
            {isLoading ? (
              <Spinner />
            ) : comics.length > 0 ? (
              <>
                <GridComic listComics={comics} title={`(${totalResult}) kết quả`} />
                <Pagination currentPage={page} totalpage={totalpage} rootLink="/tim-truyen" />
              </>
            ) : (
              <div className="flex justify-center py-20">
                <Empty message="Không tìm thấy truyện" />
              </div>
            )}
          </div>
          <div className="xl:col-span-1">
            <TopList />
          </div>
        </div>
      </div>
    </div>
  );
}
