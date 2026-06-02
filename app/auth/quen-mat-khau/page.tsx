import type { Metadata } from 'next';
import QuenMatKhauContent from './quen-mat-khau-content';
import { generateNoIndexMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateNoIndexMetadata('Quên mật khẩu', '/auth/quen-mat-khau');

export default function QuenMatKhauPage() {
  return <QuenMatKhauContent />;
}
