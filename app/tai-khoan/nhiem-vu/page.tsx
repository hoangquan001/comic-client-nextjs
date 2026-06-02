import type { Metadata } from 'next';
import NhiemVuContent from './nhiem-vu-content';
import { generateNoIndexMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateNoIndexMetadata('Nhiệm vụ hàng ngày', '/tai-khoan/nhiem-vu');

export default function NhiemVuPage() {
  return <NhiemVuContent />;
}
