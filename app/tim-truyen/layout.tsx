import type { Metadata } from 'next';
import { generateSearchMetadata } from '@/lib/seo/metadata';

export function generateMetadata(): Metadata {
  return generateSearchMetadata();
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
