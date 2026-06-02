import type { Metadata } from 'next';
import { ComicAPI } from '@/lib/api';
import type { ComicList } from '@/types';
import HotComicsContent from './hot-comics-content';
import { generateHotComicsMetadata } from '@/lib/seo/metadata';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateBreadcrumbSchema, generateComicListSchema } from '@/lib/seo/json-ld';

export function generateMetadata(): Metadata {
  return generateHotComicsMetadata();
}

interface HotPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HotComicsPage({ searchParams }: HotPageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;

  let initialData: ComicList | null = null;
  try {
    initialData = await ComicAPI.getHotComics(page) ?? null;
  } catch {}

  return (
    <>
      <JsonLdScript
        data={[
          generateBreadcrumbSchema([
            { name: 'Trang chủ', url: '/' },
            { name: 'Truyện hot', url: '/truyen-hot' },
          ]),
          generateComicListSchema(initialData?.comics || [], 'Truyện tranh hot', 'Danh sách truyện tranh hot nhất tại MeTruyenMoi'),
        ]}
      />
      <HotComicsContent page={page} initialData={initialData} />
    </>
  );
}
