'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAddComment } from '@/lib/hooks/use-account-queries';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { dateAgo } from '@/lib/utils/date';
import { getChapterDetailUrl2 } from '@/lib/utils/url';
import type { Comment, CommentList, IServiceResponse } from '@/types';

const PAGE_SIZE = 10;
const TEMP_COMIC_URL = 'ta-troi-sinh-da-la-nhan-vat-phan-dien';

async function fetchRecentComments(page: number) {

  const response = await fetch(`/api/recent-comments?page=${page}&size=${PAGE_SIZE}`);
  if (!response.ok) throw new Error('Không thể tải bình luận gần đây');
  const payload = (await response.json()) as IServiceResponse<CommentList>;
  if ((payload.status !== 1 && payload.status !== 200) || !payload.data) {
    throw new Error(payload.message || 'Không thể tải bình luận gần đây');
  }
  return payload.data;
}

function renderEmojiContent(content: string) {
  const nodes: ReactNode[] = [];
  const emojiRegex = /<e>(.*?)<\/e>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = emojiRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<span key={`text-${lastIndex}`}>{content.slice(lastIndex, match.index)}</span>);
    }

    const name = match[1];
    const parts = name.split('_');
    if (parts.length < 2) {
      nodes.push(<span key={`raw-${match.index}`}>{match[0]}</span>);
    } else {
      const packName = parts[0];
      const idx = parts.slice(1).join('_');
      nodes.push(
        <Image
          key={`emoji-${match.index}`}
          src={`/emoji/data/${packName}/${idx}.gif`}
          alt={name}
          className="inline-block h-6 w-6 align-middle"
          width={24}
          height={24}
          unoptimized
        />
      );
    }

    lastIndex = emojiRegex.lastIndex;
  }

  if (lastIndex < content.length) {
    nodes.push(<span key={`text-${lastIndex}`}>{content.slice(lastIndex)}</span>);
  }

  return nodes;
}

export default function RecentCommentsPanel() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const addCommentMutation = useAddComment();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['recent-comments-panel'],
    queryFn: ({ pageParam }) => fetchRecentComments(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.cerrentpage || 1;
      return currentPage < lastPage.totalpage ? currentPage + 1 : undefined;
    },
  });

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      { rootMargin: '160px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const comments = data?.pages.flatMap((page) => page.comments) ?? [];

  function openReply(comment: Comment) {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để phản hồi bình luận');
      return;
    }
    setReplyingTo(comment.id);
    setReplyContent(comment.userID !== user?.id ? `@${comment.userName} ` : '');
  }

  function submitReply(comment: Comment) {
    if (!replyContent.trim()) return;
    addCommentMutation.mutate(
      {
        chapterId: comment.chapterID,
        content: replyContent,
        replyfromUser: comment.userID,
        replyfromCmt: comment.id,
      },
      {
        onSuccess: () => {
          setReplyContent('');
          setReplyingTo(null);
          queryClient.invalidateQueries({ queryKey: ['recent-comments-panel'] });
          toast.success('Đã gửi phản hồi');
        },
        onError: () => toast.error('Không thể gửi phản hồi'),
      }
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
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

      {/* <div className="max-h-[560px] overflow-y-auto bg-white p-2 dark:bg-dark-bg">
        {isLoading && (
          <div className="space-y-3 p-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800">
                <div className="flex gap-3">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-neutral-100 dark:bg-neutral-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-100 dark:bg-neutral-700" />
                    <div className="h-3 animate-pulse rounded bg-neutral-100 dark:bg-neutral-700" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-100 dark:bg-neutral-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-900/20">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="text-sm font-medium text-neutral-900 dark:text-light-text">{error.message}</p>
          </div>
        )}

        {!isLoading && !isError && comments.length === 0 && (
          <div className="p-6 text-center text-sm text-neutral-500 dark:text-neutral-400">Chưa có bình luận nào</div>
        )}

        {!isLoading && !isError && comments.length > 0 && (
          <div className="space-y-2">
            {comments.map((comment) => (
              <article key={comment.id} className="rounded-xl border border-neutral-200 bg-white p-3 transition-colors hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600">
                <div className="flex gap-3">
                  <Image
                    src={comment.avatar || '/default_avatar.jpg'}
                    alt={comment.userName}
                    width={40}
                    height={40}
                    className="h-10 w-10 shrink-0 rounded-full border-2 border-neutral-200 object-cover dark:border-neutral-600"
                    unoptimized
                    onError={(event) => { event.currentTarget.src = '/default_avatar.jpg'; }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-bold text-neutral-900 dark:text-light-text">{comment.userName}</h4>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                          <span>{dateAgo(comment.commentedAt)}</span>
                          <Link href={getChapterDetailUrl2(TEMP_COMIC_URL, comment.chapterID, comment.chapterName)} className="font-medium text-primary-100 hover:text-primary-200 hover:underline">
                            Ch. {comment.chapterName}
                          </Link>
                        </div>
                      </div>
                    </div>

                    <p className="mt-2 line-clamp-4 whitespace-pre-line break-words text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                      {renderEmojiContent(comment.content)}
                    </p>


                  </div>
                </div>
              </article>
            ))}

            <div ref={sentinelRef} className="py-3 text-center text-xs text-neutral-500 dark:text-neutral-400">
              {isFetchingNextPage ? 'Đang tải thêm bình luận...' : hasNextPage ? 'Kéo xuống để tải thêm' : 'Đã tải hết bình luận'}
            </div>
          </div>
        )}
      </div> */}
    </section>
  );
}
