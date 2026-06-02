import type { Metadata } from 'next';
import { ComicAPI } from '@/lib/api';
import type { ComicList } from '@/types';
import RankingContent from './ranking-content';
import { getServerGridType } from '@/lib/utils/cookie';
import { generateRankingMetadata } from '@/lib/seo/metadata';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateBreadcrumbSchema, generateComicListSchema } from '@/lib/seo/json-ld';

export function generateMetadata(): Metadata {
  return generateRankingMetadata();
}

interface RankingPageProps {
  searchParams: Promise<{ page?: string; sort?: string; status?: string }>;
}

export default async function RankingPage({ searchParams }: RankingPageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const sort = Number(sp.sort) || 0;
  const status = Number(sp.status) >= 0 ? Number(sp.status) : -1;
  const gridType = await getServerGridType();
  let initialData: ComicList | null = null;
  try {
    initialData = await ComicAPI.getComics({ page, step: 35, sort, status }) ?? null;
  } catch {}

  return (
    <>
      <JsonLdScript
        data={[
          generateBreadcrumbSchema([
            { name: 'Trang chủ', url: '/' },
            { name: 'Xếp hạng', url: '/xep-hang' },
          ]),
          generateComicListSchema(initialData?.comics || [], 'Xếp hạng truyện tranh', 'Bảng xếp hạng truyện tranh tại MeTruyenMoi'),
        ]}
      />
      <RankingContent page={page} sort={sort} status={status} initialData={initialData} gridType={gridType} />
    </>
  );
}
