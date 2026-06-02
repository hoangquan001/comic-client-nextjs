import type { Metadata } from 'next';
import { generateNoIndexMetadata } from '@/lib/seo/metadata';
import HistoryContent from './history-content';
import { getServerGridType } from '@/lib/utils/cookie';

export function generateMetadata(): Metadata {
  return generateNoIndexMetadata('Lịch sử đọc truyện', '/lich-su');
}

interface HistoryPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const gridType = await getServerGridType();
  return <HistoryContent page={page} gridType={gridType} />;
}
