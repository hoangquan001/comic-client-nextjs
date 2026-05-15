import { Suspense } from 'react';
import { Spinner } from '@/components/common/spinner/spinner';
import RankingContent from './ranking-content';

export default function RankingPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Spinner /></div>}>
      <RankingContent />
    </Suspense>
  );
}
