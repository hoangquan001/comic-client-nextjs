import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ComicAPI } from '@/lib/api';
import { generateComicMetadata } from '@/lib/seo/metadata';
import type { Comic } from '@/types';
import ComicDetailContent from './comic-detail-content';
import { getServerGridType } from '@/lib/utils/cookie';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateBreadcrumbSchema, generateComicFAQSchema, generateComicSchema } from '@/lib/seo/json-ld';
interface ComicDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ComicDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const comic = await ComicAPI.getComic(slug, 1);
    if (!comic) return { title: 'Không tìm thấy truyện' };
    return generateComicMetadata(comic);
  } catch {
    return { title: 'Không tìm thấy truyện' };
  }
}

export default async function ComicDetailPage({ params }: ComicDetailPageProps) {
  const { slug } = await params;
  let comic: Comic;
  try {
    const comicData = await ComicAPI.getComic(slug, 9999);
    if (!comicData) notFound();
    comic = comicData;
  } catch {
    notFound();
  }

  if (comic.coverImage && !comic.coverImage.startsWith('https://')) {
    comic.coverImage = 'https://cdn1.anhtruyen.com/coverimg/' + comic.coverImage;
  }

  const gridType = await getServerGridType();

  return (
    <>
      <JsonLdScript
        data={[
          generateBreadcrumbSchema([
            { name: 'Trang chủ', url: '/' },
            { name: 'Truyện tranh', url: '/tim-truyen' },
            { name: comic.title, url: `/truyen-tranh/${comic.url}` },
          ]),
          generateComicSchema(comic),
          generateComicFAQSchema(comic),
        ]}
      />
      <ComicDetailContent comic={comic} gridType={gridType} />
    </>
  );
}
