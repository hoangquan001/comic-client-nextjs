import { Suspense } from 'react';
import { Spinner } from '@/components/common/spinner/spinner';
import SearchContent from './search-content';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Spinner /></div>}>
      <SearchContent />
    </Suspense>
  );
}
