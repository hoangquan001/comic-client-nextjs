import type { Metadata } from 'next';
import YeuThichContent from './yeu-thich-content';

export const metadata: Metadata = {
  title: 'Truyện yêu thích - MeTruyenMoi',
  description: 'Danh sách truyện tranh bạn đang theo dõi',
};

export default function YeuThichPage() {
  return <YeuThichContent />;
}
