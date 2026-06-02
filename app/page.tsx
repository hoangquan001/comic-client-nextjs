import type { Metadata } from 'next';
import { generateHomeMetadata } from '@/lib/seo/metadata';
import HomeContent from './home-content';
import { ComicAPI } from '@/lib/api';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateBreadcrumbSchema, generateComicListSchema } from '@/lib/seo/json-ld';

export function generateMetadata(): Metadata {
  return generateHomeMetadata();
}

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HomePage({ searchParams }: HomeProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;

  const comicsPromise = ComicAPI.getComics({ page }).catch(() => undefined);
  const recommendPromise = ComicAPI.getRecommendComics().catch(() => undefined);
  const announcementsPromise = ComicAPI.getAnouncements().catch(() => undefined);

  const [comics, recommendRes, announcementsRes] = await Promise.all([comicsPromise, recommendPromise, announcementsPromise]);


  return (
    <>
      <JsonLdScript
        data={[
          generateBreadcrumbSchema([{ name: 'Trang chủ', url: '/' }]),
          generateComicListSchema(comics?.comics || [], 'Truyện tranh mới cập nhật', 'Danh sách truyện tranh mới cập nhật tại MeTruyenMoi'),
          generateComicListSchema(recommendRes || [], 'Truyện tranh đề xuất', 'Các bộ truyện tranh được đề xuất tại MeTruyenMoi'),
        ]}
      />
      <HomeContent page={page} comics={comics} carousel={recommendRes} announcements={announcementsRes} />
    </>
  );
}
