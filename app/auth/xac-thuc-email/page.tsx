import type { Metadata } from 'next';
import ConfirmEmailContent from './xac-thuc-email-content';
import { generateNoIndexMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateNoIndexMetadata('Xác thực email', '/auth/xac-thuc-email');

interface ConfirmEmailPageProps {
  searchParams: Promise<{ mssg?: string }>;
}

export default async function ConfirmEmailPage({ searchParams }: ConfirmEmailPageProps) {
  const sp = await searchParams;
  const mssg = sp.mssg || '';
  return <ConfirmEmailContent mssg={mssg} />;
}
