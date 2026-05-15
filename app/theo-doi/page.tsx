import { Suspense } from 'react';
import { Spinner } from '@/components/common/spinner/spinner';
import FollowedContent from './followed-content';

export default function FollowedPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Spinner /></div>}>
      <FollowedContent />
    </Suspense>
  );
}
