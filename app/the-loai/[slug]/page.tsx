import { Suspense } from 'react';
import type { Metadata } from 'next';
import { generateGenreMetadata } from '@/lib/seo/metadata';
import { GENRES } from '@/lib/constants/genres';
import { Spinner } from '@/components/common/spinner/spinner';
import GenreDetailContent from './genre-detail-content';

interface GenreDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GenreDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const genre = GENRES.find((g) => g.slug === slug);
  if (!genre) {
    return { title: 'Thể loại không tồn tại' };
  }
  return generateGenreMetadata(genre);
}

export default function GenreDetailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Spinner /></div>}>
      <GenreDetailContent />
    </Suspense>
  );
}
