import type { Metadata } from 'next';
import DongBoTruyenContent from './dong-bo-truyen-content';
import { generateNoIndexMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateNoIndexMetadata('Đồng bộ truyện', '/dong-bo-truyen');

export default function DongBoTruyenPage() {
  return <DongBoTruyenContent />;
}
