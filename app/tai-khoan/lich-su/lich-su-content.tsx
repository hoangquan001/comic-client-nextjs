'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useHistoryStore } from '@/lib/stores/use-history-store';
import { ComicCard } from '@/components/common/comic-card';
import { AccountIcon, GlassCard, PageHeader } from '../_components/account-ui';

export default function LichSuContent() {
  const { listHistory, initialize } = useHistoryStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="space-y-6">
      <PageHeader icon="clock" title="Lịch sử đọc" iconClassName="text-red-500" />

      {listHistory.length > 0 ? (
        <div className="mx-3 grid grid-cols-2 gap-[12px] xs:grid-cols-3 sm:grid-cols-4 lg:mx-0 lg:grid-cols-6">
          {listHistory.map((comic) => (
            <ComicCard key={comic.id} comic={comic} />
          ))}
        </div>
      ) : (
        <GlassCard className="p-12">
          <div className="text-center">
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <svg className="mb-4 h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7m16 0v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5m16 0h-2.586a1 1 0 0 0-.707.293l-2.414 2.414a1 1 0 0 1-.707.293h-3.172a1 1 0 0 1-.707-.293l-2.414-2.414A1 1 0 0 0 6.586 13H4" />
              </svg>
              <p className="text-sm">Chưa có lịch sử đọc</p>
            </div>
            <div className="mt-6 text-center">
              <Link href="/" className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-sky-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500/50">
                <AccountIcon name="search" className="h-5 w-5" />
                Khám phá truyện
              </Link>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
