import type { Metadata } from 'next';
import { ComicAPI } from '@/lib/api';
import type { Comic } from '@/types';
import AuthorComicsContent from './author-comics-content';
import { getServerGridType } from '@/lib/utils/cookie';

interface Props {
  params: Promise<{ author: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { author } = await params;
  const decoded = decodeURIComponent(author);
  return {
    title: `Truyện của tác giả ${decoded} - MeTruyenMoi`,
    description: `Danh sách tất cả các bộ truyện tranh của tác giả ${decoded}`,
  };
}

export default async function AuthorComicsPage({ params }: Props) {
  const { author: encodedAuthor } = await params;
  const author = decodeURIComponent(encodedAuthor);
  const gridType = await getServerGridType();

  let initialData: Comic[] | null = null;
  try {
    initialData = await ComicAPI.getComicsByAuthor(author) ?? null;
  } catch {}

  return <AuthorComicsContent 
  author={author} 
  encodedAuthor={encodedAuthor} 
  initialData={initialData} 
  gridType={gridType} />;
}
