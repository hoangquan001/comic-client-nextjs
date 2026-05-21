import type { Metadata } from 'next';
import LienHeContent from './lien-he-content';

export const metadata: Metadata = {
  title: 'Liên hệ - MeTruyenMoi',
  description: 'Liên hệ với đội ngũ hỗ trợ MeTruyenMoi',
};

export default function LienHePage() {
  return <LienHeContent />;
}
