import type { Metadata } from 'next';
import HoSoContent from './ho-so-content';

export const metadata: Metadata = {
  title: 'Hồ sơ - MeTruyenMoi',
  description: 'Quản lý thông tin hồ sơ cá nhân',
};

export default function HoSoPage() {
  return <HoSoContent />;
}
