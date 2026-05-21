import type { Metadata } from 'next';
import { publicFetch } from '@/lib/api/server-fetch';
import type { ComicList, IServiceResponse } from '@/types';
import RankingContent from './ranking-content';

export const metadata: Metadata = {
  title: 'Xếp hạng truyện tranh - MeTruyenMoi',
  description: 'Bảng xếp hạng truyện tranh hot nhất tại MeTruyenMoi.',
};

interface RankingPageProps {
  searchParams: Promise<{ page?: string; sort?: string; status?: string }>;
}

export default async function RankingPage({ searchParams }: RankingPageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const sort = Number(sp.sort) || 0;
  const status = Number(sp.status) >= 0 ? Number(sp.status) : -1;

  let initialData: ComicList | null = null;
  try {
    const res = await publicFetch<IServiceResponse<ComicList>>(
      `/comics?page=${page}&step=35&genre=-1&sort=${sort}&status=${status}`
    );
    if ((res.status === 200 || res.status === 1) && res.data) initialData = res.data;
  } catch {}

  return <RankingContent page={page} sort={sort} status={status} initialData={initialData} />;
}
