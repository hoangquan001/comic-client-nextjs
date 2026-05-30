import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ComicAPI } from '@/lib/api';
import { generateComicMetadata } from '@/lib/seo/metadata';
import type { Comic } from '@/types';
import ComicDetailContent from './comic-detail-content';
import { getServerGridType } from '@/lib/utils/cookie';
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
      <ComicDetailContent comic={comic} gridType={gridType} />
  );
}
