import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serverFetch } from '@/lib/api/server-fetch';
import { Spinner } from '@/components/common/spinner/spinner';
import type { Comic, IServiceResponse } from '@/types';
import CharacterListContent from './character-list-content';

interface CharacterPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CharacterPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await serverFetch<IServiceResponse<Comic>>(`/comic/${slug}`);
    if (res.status !== 200 || !res.data) return { title: 'Không tìm thấy' };
    return {
      title: `Danh Sách Nhân Vật - ${res.data.title} | MeTruyenMoi`,
      description: `Danh sách nhân vật truyện ${res.data.title}`,
    };
  } catch {
    return { title: 'Không tìm thấy' };
  }
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { slug } = await params;

  let comic: Comic;
  try {
    const res = await serverFetch<IServiceResponse<Comic>>(`/comic/${slug}?chaptercount=1`);
    if (res.status !== 200 || !res.data) notFound();
    comic = res.data;
  } catch {
    notFound();
  }

  return (
    <Suspense fallback={<Spinner />}>
      <CharacterListContent comicId={comic.id} comicTitle={comic.title} />
    </Suspense>
  );
}
