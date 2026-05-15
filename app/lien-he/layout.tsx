import type { Metadata } from 'next';
import { generateStaticMetadata } from '@/lib/seo/metadata';

export function generateMetadata(): Metadata {
  return generateStaticMetadata(
    'Liên hệ',
    'Liên hệ với MeTruyenMoi - Hỗ trợ kỹ thuật, báo cáo vi phạm, góp ý, hợp tác.',
    'lien-he'
  );
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
