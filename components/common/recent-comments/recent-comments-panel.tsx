'use client';
import Image from 'next/image';
import { useRecentComments } from '@/lib/hooks';
import { ReactNode, useRef } from 'react';
import Link from 'next/link';
import { Spinner } from '../spinner/spinner';
import { openUserInfo } from '@/lib/utils/event.define';
import { useInViewport } from '@/lib/hooks/use-in-viewport';
function renderEmojiContent(content: string) {
  const nodes: ReactNode[] = [];
  const emojiRegex = /<e>(.*?)<\/e>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = emojiRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        <span
          key={`text-${lastIndex}`}
          dangerouslySetInnerHTML={{ __html: content.slice(lastIndex, match.index) }}
        />
      );
    }

    const name = match[1];
    const parts = name.split('_');
    if (parts.length < 2) {
      nodes.push(match[0]);
    } else {
      const packName = parts[0];
      const idx = parts.slice(1).join('_');
      nodes.push(
        <Image
          key={`emoji-${match.index}`}
          src={`/emoji/data/${packName}/${idx}.gif`}
          alt={name}
          className="inline-block w-7 h-7"
          width={28}
          height={28}
          unoptimized
        />
      );
    }

    lastIndex = emojiRegex.lastIndex;
  }

  if (lastIndex < content.length) {
    nodes.push(
      <span
        key={`text-${lastIndex}`}
        dangerouslySetInnerHTML={{ __html: content.slice(lastIndex) }}
      />
    );
  }

  return nodes;
}
export default function RecentCommentsPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref, { rootMargin: '200px', once: true });
  const { data, isLoading, isError } = useRecentComments(inView);
  const comments = data ?? [];

  function showUserInfo(userId: number) {
    window.dispatchEvent(new CustomEvent(openUserInfo, { detail: { userId } }));
  }

  if (!inView) {
    return <div ref={ref} className="min-h-80 w-full" aria-hidden="true" />;
  }

  return (
    <div ref={ref} className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
      <div className="border-b border-neutral-200 bg-neutral-50 px-3 py-3 dark:border-neutral-700 dark:bg-neutral-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100/10 text-primary-100 dark:bg-primary-100/20">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-light-text">Bình luận gần đây</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Thảo luận mới từ cộng đồng</p>
          </div>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto bg-white p-2 dark:bg-dark-bg scrollbar-style-1">
        {isLoading && (
          <Spinner />
        )}

        {isError && (
          <div className="p-6 text-center text-sm text-neutral-500 dark:text-neutral-400">Chưa có bình luận nào</div>
        )}

        {!isLoading && !isError && comments.length === 0 && (
          <div className="p-6 text-center text-sm text-neutral-500 dark:text-neutral-400">Chưa có bình luận nào</div>
        )}

        {!isLoading && !isError && comments.length > 0 && (
          <>
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white mb-1 transition-colors hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600">
                <div className="flex gap-3">
                  <Image
                    onClick ={() => {showUserInfo(comment.userID)}}
                    src={comment.avatar || '/default_avatar.jpg'}
                    alt={comment.userName}
                    width={40}
                    height={40}
                    className="cursor-pointer h-10 w-10 shrink-0 rounded-full border-2 border-neutral-200 object-cover dark:border-neutral-600"
                    unoptimized
                    onError={(event) => { event.currentTarget.src = '/default_avatar.jpg'; }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 ">
                        <h4 className="truncate text-sm font-bold text-neutral-900 dark:text-light-text">{comment.userName}</h4>
                        {/* <span className="text-xs text-neutral-500 dark:text-neutral-400">{dateAgo(comment.commentedAt)}</span> */}
                      </div>

                      <Link href={"/truyen-tranh/" + comment.comicSlug} className="mt-0.5 flex flex-wrap items-center gap-2 text-xs  dark:text-neutral-400 font-medium text-primary-100 hover:text-primary-200 hover:underline">
                        Ch. {comment.chapterName}
                      </Link>
                    </div>

                    <p className="line-clamp-4 whitespace-pre-line break-words text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                      {renderEmojiContent(comment.content)}
                    </p>


                  </div>
                </div>
              </div>
            ))}

            {/* <div ref={sentinelRef} className="py-3 text-center text-xs text-neutral-500 dark:text-neutral-400">
              {isFetchingNextPage ? 'Đang tải thêm bình luận...' : hasNextPage ? 'Kéo xuống để tải thêm' : 'Đã tải hết bình luận'}
            </div> */}
          </>
        )}
      </div>
    </div>
  );
}
