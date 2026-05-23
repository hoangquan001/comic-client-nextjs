import type { Metadata } from 'next';
import TuiDoContent from './tui-do-content';

export const metadata: Metadata = {
  title: 'Kho đồ - MeTruyenMoi',
  description: 'Quản lý vật phẩm của bạn',
};

export default function TuiDoPage() {
  return <TuiDoContent />;
}
