import type { Metadata } from 'next';
import ConfirmEmailContent from './xac-thuc-email-content';

export const metadata: Metadata = {
  title: 'Xác thực email - MeTruyenMoi',
  description: 'Xác thực email tài khoản MeTruyenMoi',
  robots: 'noindex',
};

interface ConfirmEmailPageProps {
  searchParams: Promise<{ mssg?: string }>;
}

export default async function ConfirmEmailPage({ searchParams }: ConfirmEmailPageProps) {
  const sp = await searchParams;
  const mssg = sp.mssg || '';
  return <ConfirmEmailContent mssg={mssg} />;
}
