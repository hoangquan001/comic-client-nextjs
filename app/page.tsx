import { Suspense } from 'react';
import type { Metadata } from 'next';
import { generateHomeMetadata } from '@/lib/seo/metadata';
import { Spinner } from '@/components/common/spinner/spinner';
import HomeContent from './home-content';

export function generateMetadata(): Metadata {
  return generateHomeMetadata();
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Spinner /></div>}>
      <HomeContent />
    </Suspense>
  );
}
