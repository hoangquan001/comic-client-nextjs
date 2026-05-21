import type { Metadata } from 'next';
import QuenMatKhauContent from './quen-mat-khau-content';

export const metadata: Metadata = {
  title: 'Quên mật khẩu - MeTruyenMoi',
  description: 'Khôi phục mật khẩu tài khoản MeTruyenMoi',
};

export default function QuenMatKhauPage() {
  return <QuenMatKhauContent />;
}
