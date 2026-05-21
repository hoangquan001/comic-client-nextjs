import type { Metadata } from 'next';
import { publicFetch } from '@/lib/api/server-fetch';
import type { Comic, IServiceResponse } from '@/types';
import AuthorComicsContent from './author-comics-content';

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

  let initialData: Comic[] | null = null;
  try {
    const res = await publicFetch<IServiceResponse<Comic[]>>(
      `/comicsbyauthor?author=${encodeURIComponent(author)}&size=20`
    );
    if ((res.status === 200 || res.status === 1) && res.data) initialData = res.data;
  } catch {}

  return <AuthorComicsContent author={author} encodedAuthor={encodedAuthor} initialData={initialData} />;
}
