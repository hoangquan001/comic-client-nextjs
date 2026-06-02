import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateGenreMetadata } from '@/lib/seo/metadata';
import { ComicAPI } from '@/lib/api';
import { GENRES } from '@/lib/constants/genres';
import type { ComicList } from '@/types';
import GenreDetailContent from './genre-detail-content';
import { getServerGridType } from '@/lib/utils/cookie';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateBreadcrumbSchema, generateComicListSchema, generateGenreSchema } from '@/lib/seo/json-ld';

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
    initialData = await ComicAPI.getComics({ page, step: 35, genre: genre.id, sort, status }) ?? null;
  } catch { }

  return (
    <>
      <JsonLdScript
        data={[
          generateBreadcrumbSchema([
            { name: 'Trang chủ', url: '/' },
            { name: 'Thể loại', url: '/the-loai' },
            { name: genre.title, url: `/the-loai/${slug}` },
          ]),
          generateGenreSchema(genre, initialData?.comics),
          generateComicListSchema(initialData?.comics || [], `Truyện ${genre.title}`, genre.description || undefined),
        ]}
      />
      <GenreDetailContent
        slug={slug}
        genre={genre}
        page={page}
        sort={sort}
        status={status}
        gridType={gridType}
        initialData={initialData}

      />
    </>
  );
}
