import { Suspense } from 'react';
import { Spinner } from '@/components/common/spinner/spinner';
import HotComicsContent from './hot-comics-content';

export default function HotComicsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Spinner /></div>}>
      <HotComicsContent />
    </Suspense>
  );
}
