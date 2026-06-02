import type { Metadata } from 'next';
import { ComicAPI } from '@/lib/api';
import type { ComicList } from '@/types';
import SearchContent from './search-content';
import { getServerGridType } from '@/lib/utils/cookie';
import { generateSearchMetadata } from '@/lib/seo/metadata';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateBreadcrumbSchema, generateComicListSchema, generateSearchSchema } from '@/lib/seo/json-ld';

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

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const sp = await searchParams;
  return generateSearchMetadata(sp.keyword);
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
    initialData = await ComicAPI.getAdvanceComics({
      page,
      sort,
      status,
      genres,
      nogenres,
      year,
      keyword,
    }) ?? null;
  } catch {}

  return (
    <>
      <JsonLdScript
        data={[
          generateBreadcrumbSchema([
            { name: 'Trang chủ', url: '/' },
            { name: 'Tìm truyện', url: '/tim-truyen' },
          ]),
          keyword
            ? generateSearchSchema(keyword, initialData?.comics.length)
            : generateComicListSchema(initialData?.comics || [], 'Tìm kiếm truyện tranh', 'Danh sách truyện tranh theo bộ lọc tìm kiếm'),
        ]}
      />
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
    </>
  );
}
