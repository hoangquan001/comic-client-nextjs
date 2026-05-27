import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateGenreMetadata } from '@/lib/seo/metadata';
import { publicFetch } from '@/lib/api/server-fetch';
import { GENRES } from '@/lib/constants/genres';
import type { ComicList, IServiceResponse } from '@/types';
import GenreDetailContent from './genre-detail-content';
import { getServerGridType } from '@/lib/utils/cookie';

interface GenreDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string; status?: string }>;
}

export async function generateMetadata({ params }: Pick<GenreDetailPageProps, 'params'>): Promise<Metadata> {
  const { slug } = await params;
  const genre = GENRES.find((g) => g.slug === slug);
  if (!genre) return { title: 'Thể loại không tồn tại' };
  return generateGenreMetadata(genre);
}

export default async function GenreDetailPage({ params, searchParams }: GenreDetailPageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  const genre = GENRES.find((g) => g.slug === slug);
  if (!genre) notFound();

  const page = Number(sp.page) || 1;
  const sort = Number(sp.sort) >= 0 ? Number(sp.sort) : 1;
  const status = Number(sp.status) >= 0 ? Number(sp.status) : -1;
  const gridType = await getServerGridType();
  let initialData: ComicList | null = null;
  try {
    const res = await publicFetch<IServiceResponse<ComicList>>(
      `/comics?page=${page}&step=35&genre=${genre.id}&sort=${sort}&status=${status}`
    );
    if ((res.status === 200 || res.status === 1) && res.data) initialData = res.data;
  } catch { }

  return (
    <GenreDetailContent
      slug={slug}
      genre={genre}
      page={page}
      sort={sort}
      status={status}
      gridType={gridType}
      initialData={initialData}

    />
  );
}
