import type { Metadata } from 'next';
import { generateHotComicsMetadata } from '@/lib/seo/metadata';

export function generateMetadata(): Metadata {
  return generateHotComicsMetadata();
}

export default function HotComicsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
