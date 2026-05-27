import type { Metadata } from 'next';
import { publicFetch } from '@/lib/api/server-fetch';
import type { ComicList, IServiceResponse } from '@/types';
import SearchContent from './search-content';
import { getServerGridType } from '@/lib/utils/cookie';

export const metadata: Metadata = {
  title: 'Tìm truyện tranh - MeTruyenMoi',
  description: 'Tìm kiếm truyện tranh theo thể loại, trạng thái, năm phát hành.',
};

interface SearchPageProps {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    status?: string;
    genres?: string;
    nogenres?: string;
    year?: string;
    keyword?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const sort = Number(sp.sort) >= 0 ? Number(sp.sort) : 1;
  const status = Number(sp.status) >= 0 ? Number(sp.status) : -1;
  const genres = sp.genres || '';
  const nogenres = sp.nogenres || '';
  const year = Number(sp.year) || -1;
  const keyword = sp.keyword || '';
  const gridType = await getServerGridType();
  let initialData: ComicList | null = null;
  try {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('step', '30');
    params.set('sort', String(sort));
    params.set('status', String(status));
    if (genres) params.set('genres', genres);
    if (nogenres) params.set('nogenres', nogenres);
    if (year > 0) params.set('year', String(year));
    if (keyword) params.set('keyword', keyword);

    const res = await publicFetch<IServiceResponse<ComicList>>(
      `/comic/advance?${params.toString()}`
    );
    if ((res.status === 200 || res.status === 1) && res.data) initialData = res.data;
  } catch {}

  return (
    <SearchContent
      page={page}
      sort={sort}
      status={status}
      genres={genres}
      nogenres={nogenres}
      year={year}
      keyword={keyword}
      initialData={initialData}
      gridType={gridType}
    />
  );
}
