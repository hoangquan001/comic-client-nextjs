import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serverFetch } from '@/lib/api/server-fetch';
import { generateComicMetadata } from '@/lib/seo/metadata';
import { generateComicSchema, generateBreadcrumbSchema } from '@/lib/seo/json-ld';
import { Spinner } from '@/components/common/spinner/spinner';
import type { Comic, IServiceResponse } from '@/types';
import ComicDetailContent from './comic-detail-content';

interface ComicDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ComicDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await serverFetch<IServiceResponse<Comic>>(`/comic/${slug}`);
    if (res.status !== 200 || !res.data) return { title: 'Không tìm thấy truyện' };
    return generateComicMetadata(res.data);
  } catch {
    return { title: 'Không tìm thấy truyện' };
  }
}

export default async function ComicDetailPage({ params }: ComicDetailPageProps) {
  const { slug } = await params;

  let comic: Comic;
  try {
    const res = await serverFetch<IServiceResponse<Comic>>(`/comic/${slug}?chaptercount=1`);
    if (res.status !== 200 || !res.data) notFound();
    comic = res.data;
  } catch {
    notFound();
  }

  if (comic.coverImage && !comic.coverImage.startsWith('https://')) {
    comic.coverImage = 'https://cdn1.anhtruyen.com/coverimg/' + comic.coverImage;
  }

  const comicSchema = generateComicSchema(comic);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Trang chủ', url: 'https://metruyenmoi.org' },
    { name: 'Truyện tranh', url: 'https://metruyenmoi.org/tim-truyen' },
    { name: comic.title, url: `https://metruyenmoi.org/truyen-tranh/${comic.url}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([comicSchema, breadcrumbSchema]) }}
      />
      <Suspense fallback={<div className="flex justify-center py-20"><Spinner /></div>}>
        <ComicDetailContent comic={comic} />
      </Suspense>
    </>
  );
}
