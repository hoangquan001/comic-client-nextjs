import type { Metadata } from 'next';
import FollowedContent from './followed-content';
import { getServerGridType } from '@/lib/utils/cookie';

export const metadata: Metadata = {
  title: 'Truyện theo dõi - MeTruyenMoi',
  description: 'Danh sách truyện tranh bạn đang theo dõi.',
  robots: 'noindex',
};

interface FollowedPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function FollowedPage({ searchParams }: FollowedPageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const gridType = await getServerGridType();
  return <FollowedContent page={page} gridType={gridType} />;
}
