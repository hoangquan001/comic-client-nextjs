import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { publicFetch } from '@/lib/api/server-fetch';
import type { Comic, IServiceResponse } from '@/types';
import CharacterListContent from './character-list-content';

interface CharacterPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CharacterPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await publicFetch<IServiceResponse<Comic>>(`/comic/${slug}?chaptercount=1`);
    if ((res.status !== 200 && res.status !== 1) || !res.data) return { title: 'Không tìm thấy' };
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
    const res = await publicFetch<IServiceResponse<Comic>>(`/comic/${slug}?chaptercount=1`);
    if ((res.status !== 200 && res.status !== 1) || !res.data) notFound();
    comic = res.data;
  } catch {
    notFound();
  }

  return <CharacterListContent comicId={comic.id} comicTitle={comic.title} />;
}
