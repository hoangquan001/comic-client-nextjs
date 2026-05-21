import type { Metadata } from 'next';
import TheLoaiContent from './the-loai-content';

export const metadata: Metadata = {
  title: 'Thể loại truyện - MeTruyenMoi',
  description: 'Khám phá truyện tranh theo thể loại yêu thích',
};

export default function TheLoaiPage() {
  return <TheLoaiContent />;
}
