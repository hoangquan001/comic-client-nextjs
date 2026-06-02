import type { Metadata } from 'next';
import DangKyContent from './dang-ky-content';
import { generateNoIndexMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateNoIndexMetadata('Đăng ký', '/auth/dang-ky');

export default function DangKyPage() {
  return <DangKyContent />;
}
