import type { Metadata } from 'next';
import FollowedContent from './followed-content';
import { getServerGridType, isAuthenticated } from '@/lib/utils/cookie';
import { generateNoIndexMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateNoIndexMetadata('Truyện theo dõi', '/theo-doi');

interface FollowedPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function FollowedPage({ searchParams }: FollowedPageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const gridType = await getServerGridType();
  const isAuth = await isAuthenticated();
  return <FollowedContent page={page} gridType={gridType} isAuthenticated={isAuth} />;
}
