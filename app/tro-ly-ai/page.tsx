import type { Metadata } from 'next';
import TroLyAIContent from './tro-ly-ai-content';
import { generateNoIndexMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateNoIndexMetadata('Trợ lý AI', '/tro-ly-ai');

export default function TroLyAIPage() {
  return <TroLyAIContent />;
}
