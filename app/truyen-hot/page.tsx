import type { Metadata } from 'next';
import { publicFetch } from '@/lib/api/server-fetch';
import type { ComicList, IServiceResponse } from '@/types';
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
    const res = await publicFetch<IServiceResponse<ComicList>>(
      `/hotcomics?page=${page}&step=30`
    );
    if (res.status === 1 && res.data) initialData = res.data;
  } catch {}

  return <HotComicsContent page={page} initialData={initialData} />;
}
