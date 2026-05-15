import type { Metadata } from 'next';
import { generateStaticMetadata } from '@/lib/seo/metadata';

export function generateMetadata(): Metadata {
  return generateStaticMetadata(
    'Thể loại truyện tranh',
    'Danh mục thể loại truyện tranh tại MeTruyenMoi - Khám phá truyện theo sở thích.',
    'the-loai'
  );
}

export default function GenreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
