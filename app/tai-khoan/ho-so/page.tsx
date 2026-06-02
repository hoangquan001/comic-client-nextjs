import type { Metadata } from 'next';
import HoSoContent from './ho-so-content';
import { generateNoIndexMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateNoIndexMetadata('Hồ sơ', '/tai-khoan/ho-so');

export default function HoSoPage() {
  return <HoSoContent />;
}
