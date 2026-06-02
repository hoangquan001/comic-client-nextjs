import type { Metadata } from 'next';
import TuiDoContent from './tui-do-content';
import { generateNoIndexMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateNoIndexMetadata('Kho đồ', '/tai-khoan/tui-do');

export default function TuiDoPage() {
  return <TuiDoContent />;
}
