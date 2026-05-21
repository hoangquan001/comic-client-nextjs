'use client';

import Link from 'next/link';
import { Breadcrumb } from '@/components/common/breadcrumb/breadcrumb';
import { GridComic } from '@/components/common/grid-comic/grid-comic';
import { Spinner } from '@/components/common/spinner/spinner';
import { Empty } from '@/components/common/empty/empty';
import { useComicsByAuthor } from '@/lib/hooks/use-comic-queries';
import type { Comic } from '@/types';

interface AuthorComicsContentProps {
  author: string;
  encodedAuthor: string;
  initialData?: Comic[] | null;
}

export default function AuthorComicsContent({ author, encodedAuthor, initialData }: AuthorComicsContentProps) {
  const { data, isLoading, error } = useComicsByAuthor(author);

  const comics = initialData ?? (data as any)?.data ?? [];
  const loading = !initialData && isLoading;

  return (
    <main>
      <div className="my-2 container mx-auto w-full">
        <Breadcrumb items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Tác giả' },
          { label: author, href: `/tac-gia/${encodedAuthor}` },
        ]} />
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center shrink-0">
              <svg className="w-8 h-8 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-light-text">{author}</h1>
              <p className="text-sm text-neutral-500">Tác giả truyện tranh</p>
              {!loading && comics.length > 0 && (
                <div className="flex items-center gap-2 mt-2 text-sm text-neutral-500">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19.5A2.5 2.5 0 0 1 1.5 17V7A2.5 2.5 0 0 1 4 4.5h16A2.5 2.5 0 0 1 22.5 7v10a2.5 2.5 0 0 1-2.5 2.5H4z" /></svg>
                  <span>{comics.length} tác phẩm</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : error ? (
          <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-8 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-light-text mb-2">Có lỗi xảy ra</h3>
            <p className="text-neutral-500 mb-4">Không thể tải danh sách truyện</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-primary-100 text-white rounded-xl border-none cursor-pointer">Thử lại</button>
          </div>
        ) : comics.length === 0 ? (
          <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-8 text-center">
            <Empty />
            <p className="text-neutral-500 mt-4">Tác giả {author} chưa có tác phẩm nào</p>
            <Link href="/" className="inline-block mt-4 text-primary-100 hover:text-primary-200 font-medium">Về trang chủ</Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-light-text">Tác phẩm của {author}</h2>
              <span className="text-sm text-neutral-500">{comics.length} tác phẩm</span>
            </div>
            <GridComic title={`Tác phẩm của ${author}`} listComics={comics} />
          </div>
        )}
      </div>
    </main>
  );
}
