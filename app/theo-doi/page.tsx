import type { Metadata } from 'next';
import FollowedContent from './followed-content';

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
  return <FollowedContent page={page} />;
}
