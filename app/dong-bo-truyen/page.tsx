import type { Metadata } from 'next';
import DongBoTruyenContent from './dong-bo-truyen-content';

export const metadata: Metadata = {
  title: 'Đồng bộ truyện - MeTruyenMoi',
  description: 'Đồng bộ danh sách theo dõi truyện từ các trang khác',
};

export default function DongBoTruyenPage() {
  return <DongBoTruyenContent />;
}
