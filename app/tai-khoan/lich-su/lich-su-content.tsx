'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useHistoryStore } from '@/lib/stores/use-history-store';
import { Empty } from '@/components/common/empty/empty';
import { getComicDetailUrl } from '@/lib/utils/url';

export default function LichSuPage() {
  const { listHistory, initialize, removeHistory, clearHistory } = useHistoryStore();

  useEffect(() => { initialize(); }, [initialize]);

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-light-text">Lịch sử đọc</h2>
        {listHistory.length > 0 && (
          <button onClick={clearHistory} className="text-sm text-red-500 hover:text-red-600 font-medium bg-transparent border-none cursor-pointer">Xóa tất cả</button>
        )}
      </div>

      {listHistory.length === 0 ? (
        <div className="py-16 text-center"><Empty /><p className="text-sm text-neutral-500 mt-4">Bạn chưa đọc truyện nào</p></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {listHistory.map((comic) => (
            <div key={comic.id} className="group relative">
              <Link href={getComicDetailUrl(comic)} className="block">
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                  <Image src={comic.coverImage || '/empty.png'} alt={comic.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" loading="lazy" width={300} height={400} />
                </div>
                <h3 className="mt-2 text-sm font-medium text-neutral-900 dark:text-light-text line-clamp-2">{comic.title}</h3>
              </Link>
              <button onClick={() => removeHistory(comic.id)} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center border-none cursor-pointer text-xs">x</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
