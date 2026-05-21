import type { Metadata } from 'next';
import LichSuContent from './lich-su-content';

export const metadata: Metadata = {
  title: 'Lịch sử đọc - MeTruyenMoi',
  description: 'Xem lại lịch sử đọc truyện tranh',
};

export default function LichSuPage() {
  return <LichSuContent />;
}
