import type { Metadata } from 'next';
import YeuThichContent from './yeu-thich-content';
import { generateNoIndexMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateNoIndexMetadata('Truyện yêu thích', '/tai-khoan/yeu-thich');

export default function YeuThichPage() {
  return <YeuThichContent />;
}
