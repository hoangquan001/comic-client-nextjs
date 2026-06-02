import type { Metadata } from 'next';
import DangNhapContent from './dang-nhap-content';
import { generateNoIndexMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateNoIndexMetadata('Đăng nhập', '/auth/dang-nhap');

export default function DangNhapPage() {
  return <DangNhapContent />;
}
