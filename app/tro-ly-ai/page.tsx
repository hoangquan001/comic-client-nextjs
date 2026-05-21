import type { Metadata } from 'next';
import TroLyAIContent from './tro-ly-ai-content';

export const metadata: Metadata = {
  title: 'Trợ lý AI - MeTruyenMoi',
  description: 'Trợ lý AI thông minh giúp bạn khám phá truyện tranh',
};

export default function TroLyAIPage() {
  return <TroLyAIContent />;
}
