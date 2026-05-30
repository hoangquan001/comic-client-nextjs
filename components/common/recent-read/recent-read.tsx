'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useHistoryStore } from '@/lib/stores/use-history-store';
import { getComicDetailUrl, getChapterDetailUrl } from '@/lib/utils/url';
import { dateAgo } from '@/lib/utils/date';

export default function RecentRead() {
  const listHistory = useHistoryStore((s) => s.listHistory);
  const listComics = listHistory.slice(0, 2);

  listComics.forEach((c) => {
    if (c.coverImage && !c.coverImage.startsWith('https://')) {
      c.coverImage = 'https://cdn1.anhtruyen.com/coverimg/' + c.coverImage;
    }
  });
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700  overflow-hidden">
      <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z" /></svg>
          <h2 className="text-base sm:text-lg font-bold text-gray-700 dark:text-light-text uppercase">Đọc gần đây</h2>
          {listHistory.length > 0 && <span className="px-2 py-1 bg-primary-100 text-white text-xs font-bold rounded-full">{listHistory.length}</span>}
        </div>
        <div className="flex items-center">
          <Link href="/lich-su" aria-label="Xem lịch sử đọc truyện" className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg px-2 py-1 text-neutral-600 hover:bg-neutral-100 hover:text-primary-100 dark:text-neutral-400 dark:hover:bg-neutral-700">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9,18 15,12 9,6" /></svg>
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-bg h-[164px] flex justify-center relative">
        {listComics.length === 0 ? (
          <div className="text-center flex items-center justify-center h-full px-4">
            <div className="space-y-2">
              <svg className="w-16 h-16 mx-auto text-neutral-300 dark:text-neutral-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Bạn chưa đọc truyện nào gần đây</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5 p-1.5 w-full">
            {listComics.map((comic) => (
              <div key={comic.id} className="border-b border-neutral-200 dark:border-neutral-700 last:border-b-0 flex items-center gap-2 p-1">
                <div className="relative flex-shrink-0">
                  <Link href={getComicDetailUrl(comic)} className="relative block overflow-hidden rounded-lg">
                    <Image className="w-12 h-16 object-cover"
                    src={comic.coverImage || '/empty.png'} 
                    alt={comic.title} width={48} height={64} 
                    unoptimized
                    onError={(e) => { (e.target as HTMLImageElement).src = '/empty.png'; }} />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10" />
                  </Link>
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-light-text line-clamp-1">
                      <Link href={getComicDetailUrl(comic)} className="hover:text-primary-100">{comic.title}</Link>
                    </h3>
                    {comic.chapters && comic.chapters.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" /></svg>
                        <Link href={getChapterDetailUrl(comic, comic.chapters[0])} className="hover:text-primary-100 hover:underline line-clamp-1">{comic.chapters[0].title}</Link>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row items-start gap-1 justify-between">
                    <div className="flex items-center gap-1 text-xs text-orange-500 dark:text-orange-400">
                      <svg className="size-4 fill-current stroke-none" viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" /></svg>
                      <span className="font-medium">{comic.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>
                      <span className="font-medium">{dateAgo(comic.updateAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
