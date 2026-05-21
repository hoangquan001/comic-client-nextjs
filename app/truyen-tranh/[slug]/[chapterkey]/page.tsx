import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { publicFetch } from '@/lib/api/server-fetch';
import { generateChapterMetadata } from '@/lib/seo/metadata';
import { generateChapterSchema, generateBreadcrumbSchema } from '@/lib/seo/json-ld';
import type { Comic, ChapterPage, IServiceResponse } from '@/types';
import ChapterReaderContent from './chapter-reader-content';

interface ChapterPageProps {
  params: Promise<{ slug: string; chapterkey: string }>;
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { slug, chapterkey } = await params;
  try {
    const res = await publicFetch<IServiceResponse<ChapterPage>>(
      `/comic/${slug}/chapter/${chapterkey}`
    );
    if ((res.status !== 200 && res.status !== 1) || !res.data) return { title: 'Không tìm thấy chương' };
    return generateChapterMetadata(res.data.comic, res.data);
  } catch {
    return { title: 'Không tìm thấy chương' };
  }
}

export default async function ChapterReaderPage({ params }: ChapterPageProps) {
  const { slug, chapterkey } = await params;
  let chapterData: ChapterPage;
  try {
    const res = await publicFetch<IServiceResponse<ChapterPage>>(
      `/comic/${slug}/chapter/${chapterkey}`
    );
    if ((res.status !== 200 && res.status !== 1) || !res.data) notFound();
    chapterData = res.data;
  } catch {
    notFound();
  }

  const comic = chapterData.comic;

  if (comic.coverImage && !comic.coverImage.startsWith('https://')) {
    comic.coverImage = 'https://cdn1.anhtruyen.com/coverimg/' + comic.coverImage;
  }

  const chapterSchema = generateChapterSchema(comic, chapterData);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Trang chủ', url: 'https://metruyenmoi.org' },
    { name: comic.title, url: `https://metruyenmoi.org/truyen-tranh/${comic.url}` },
    { name: `Chương ${chapterData.slug}`, url: `https://metruyenmoi.org/truyen-tranh/${comic.url}/chuong-${chapterData.slug}` },
  ]);

  return (
    <>
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([chapterSchema, breadcrumbSchema]) }}
      /> */}
      <ChapterReaderContent chapterData={chapterData} />
    </>
  );
}
