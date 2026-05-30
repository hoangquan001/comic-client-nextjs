import type { Metadata } from 'next';
import { generateHomeMetadata } from '@/lib/seo/metadata';
import HomeContent from './home-content';
import { ComicAPI } from '@/lib/api';

export function generateMetadata(): Metadata {
  return generateHomeMetadata();
}

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HomePage({ searchParams }: HomeProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;

  const comicsPromise = ComicAPI.getComics({ page });
  const recommendPromise = ComicAPI.getRecommendComics();
  const announcementsPromise = ComicAPI.getAnouncements();

  const [comics, recommendRes, announcementsRes] = await Promise.all([comicsPromise, recommendPromise, announcementsPromise]);


  return <HomeContent page={page} comics={comics} carousel={recommendRes} announcements={announcementsRes} />;
}
