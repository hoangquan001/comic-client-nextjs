import type { Metadata } from 'next';
import LichSuContent from './lich-su-content';
import { generateNoIndexMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateNoIndexMetadata('Lịch sử đọc', '/tai-khoan/lich-su');

export default function LichSuPage() {
  return <LichSuContent />;
}
