import type { Metadata } from 'next';
import { generateStaticMetadata } from '@/lib/seo/metadata';

export function generateMetadata(): Metadata {
  return generateStaticMetadata('Theo dõi', 'Danh sách truyện tranh đã theo dõi tại MeTruyenMoi.', 'theo-doi');
}

export default function FollowedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
