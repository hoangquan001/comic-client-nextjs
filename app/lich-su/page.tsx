import { Suspense } from 'react';
import type { Metadata } from 'next';
import { generateStaticMetadata } from '@/lib/seo/metadata';
import { Spinner } from '@/components/common/spinner/spinner';
import HistoryContent from './history-content';

export function generateMetadata(): Metadata {
  return generateStaticMetadata('Lịch sử', 'Lịch sử đọc truyện tranh tại MeTruyenMoi.', 'lich-su');
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Spinner /></div>}>
      <HistoryContent />
    </Suspense>
  );
}
