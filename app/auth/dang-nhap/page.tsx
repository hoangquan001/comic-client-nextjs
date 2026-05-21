import type { Metadata } from 'next';
import DangNhapContent from './dang-nhap-content';

export const metadata: Metadata = {
  title: 'Đăng nhập - MeTruyenMoi',
  description: 'Đăng nhập vào tài khoản MeTruyenMoi',
};

export default function DangNhapPage() {
  return <DangNhapContent />;
}
