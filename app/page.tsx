import type { Metadata } from 'next';
import { generateHomeMetadata } from '@/lib/seo/metadata';
import { publicFetch } from '@/lib/api/server-fetch';
import type { ComicList, Comic, IServiceResponse } from '@/types';
import HomeContent from './home-content';

export function generateMetadata(): Metadata {
  return generateHomeMetadata();
}

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HomePage({ searchParams }: HomeProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;

  const comicsPromise = publicFetch<IServiceResponse<ComicList>>(
    `/comics?page=${page}&step=30&genre=-1&sort=1&status=-1`
  );
  const recommendPromise = publicFetch<IServiceResponse<Comic[]>>(`/comic/recommend`)

  const [comicsRes, recommendRes] = await Promise.all([comicsPromise, recommendPromise]);
  
  const comicsData =
    comicsRes && ( comicsRes.status === 1) && comicsRes.data
      ? comicsRes.data
      : null;
  const carouselData =
    recommendRes && (recommendRes.status === 1) && recommendRes.data
      ? recommendRes.data
      : [];

  return <HomeContent page={page} initialComics={comicsData} initialCarousel={carouselData} />;
}
