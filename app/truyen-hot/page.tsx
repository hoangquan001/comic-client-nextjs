import type { Metadata } from 'next';
import { ComicAPI } from '@/lib/api';
import type { ComicList } from '@/types';
import HotComicsContent from './hot-comics-content';

export const metadata: Metadata = {
  title: 'Truyện tranh hot - MeTruyenMoi',
  description: 'Danh sách truyện tranh hot nhất tại MeTruyenMoi.',
};

interface HotPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HotComicsPage({ searchParams }: HotPageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;

  let initialData: ComicList | null = null;
  try {
    initialData = await ComicAPI.getHotComics(page) ?? null;
  } catch {}

  return <HotComicsContent page={page} initialData={initialData} />;
}
