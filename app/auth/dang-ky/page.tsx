import type { Metadata } from 'next';
import DangKyContent from './dang-ky-content';

export const metadata: Metadata = {
  title: 'Đăng ký - MeTruyenMoi',
  description: 'Tạo tài khoản MeTruyenMoi miễn phí',
};

export default function DangKyPage() {
  return <DangKyContent />;
}
