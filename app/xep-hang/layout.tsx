import type { Metadata } from 'next';
import { generateRankingMetadata } from '@/lib/seo/metadata';

export function generateMetadata(): Metadata {
  return generateRankingMetadata();
}

export default function RankingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
