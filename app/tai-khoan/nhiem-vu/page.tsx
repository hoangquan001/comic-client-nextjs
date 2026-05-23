import type { Metadata } from 'next';
import NhiemVuContent from './nhiem-vu-content';

export const metadata: Metadata = {
  title: 'Nhiệm vụ hàng ngày - MeTruyenMoi',
  description: 'Hoàn thành nhiệm vụ để nhận kinh nghiệm',
};

export default function NhiemVuPage() {
  return <NhiemVuContent />;
}
