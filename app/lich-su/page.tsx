import type { Metadata } from 'next';
import { generateStaticMetadata } from '@/lib/seo/metadata';
import HistoryContent from './history-content';
import { getServerGridType } from '@/lib/utils/cookie';

export function generateMetadata(): Metadata {
  return generateStaticMetadata('Lịch sử', 'Lịch sử đọc truyện tranh tại MeTruyenMoi.', 'lich-su');
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
