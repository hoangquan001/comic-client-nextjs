'use client';

import { useEffect, useState, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { useCommentsByComicId, useAddComment } from '@/lib/hooks/use-account-queries';
import { Pagination } from '@/components/common/pagination/pagination';
import { EmojiPicker } from '@/components/common';
import { getChapterDetailUrl2 } from '@/lib/utils/url';
import type { Comic, Comment } from '@/types';
import { toast } from 'sonner';
import { dateAgo } from '@/lib/utils/date';
import { useInViewport } from '@/lib/hooks/use-in-viewport';
import { openUserInfo } from '@/lib/utils/event.define';
import { useClickOutside } from '@/lib/hooks/use-click-outside';

interface CommentSectionProps {
  comic: Comic;
  chapterID: number;
}

const EMPTY_COMMENTS: Comment[] = [];

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

export default function CommentSection({ comic, chapterID }: CommentSectionProps) {
  const { user, isAuthenticated } = useAuthStore();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showEmoji2, setShowEmoji2] = useState(false);
  const [content, setContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyCommentId, setReplyCommentId] = useState<number | null>(null);
  const [replyUserId, setReplyUserId] = useState(-1);
  const targetCommentId = searchParams.get('comment');
  const targetParentCommentId = searchParams.get('parent');
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(() => {
    const parentId = Number(targetParentCommentId);
    return parentId ? new Set([parentId]) : new Set();
  });
  const sectionRef = useRef<HTMLElement>(null);
  const shouldLoadComments = useInViewport(sectionRef, { once: true });
  const shouldLoadTargetComment = Boolean(targetCommentId || targetParentCommentId);
  const shouldFetchComments = shouldLoadComments || shouldLoadTargetComment;
  const emojiRef = useRef<HTMLDivElement>(null);
  useClickOutside(emojiRef, () => { setShowEmoji(false); setShowEmoji2(false); });
  const emojiRef2 = useRef<HTMLDivElement>(null);
  useClickOutside(emojiRef2, () => { setShowEmoji(false); setShowEmoji2(false); });
  const { data: commentData, isLoading, isError } = useCommentsByComicId(
    comic.id,
    currentPage,
    10,
    shouldFetchComments
  );
  const addCommentMutation = useAddComment();

  const comments = commentData?.comments ?? EMPTY_COMMENTS;
  const totalPages = commentData?.totalpage ?? 0;
  const commentsCount = comments.reduce((t, c) => t + 1 + (c.replies?.length || 0), 0);

  useEffect(() => {
    const parentId = Number(targetParentCommentId);
    if (!parentId) return;

    const timer = window.setTimeout(() => {
      setExpandedReplies((prev) => {
        if (prev.has(parentId)) return prev;
        const next = new Set(prev);
        next.add(parentId);
        return next;
      });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [targetParentCommentId]);

  useEffect(() => {
    if (!targetCommentId || comments.length === 0) return;

    const timer = window.setTimeout(() => {
      document.getElementById(`id${targetCommentId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);

    return () => window.clearTimeout(timer);
  }, [comments, expandedReplies, targetCommentId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    addCommentMutation.mutate(
      { chapterId: chapterID, content },
      { onSuccess: (res) => { if (res.status === 1) { setContent(''); } } }
    );
  }

  function handleReplySubmit(e: React.FormEvent, parentId: number) {
    e.preventDefault();
    if (!replyContent.trim()) return;
    addCommentMutation.mutate(
      { chapterId: chapterID, content: replyContent, replyfromUser: replyUserId, replyfromCmt: parentId },
      { onSuccess: (res) => { if (res.status === 1) { setReplyContent(''); setReplyCommentId(null); } } }
    );
  }

  function openReply(comment: Comment) {
    if (!isAuthenticated) { toast.error('Vui lòng đăng nhập để phản hồi bình luận'); return; }
    setReplyCommentId(comment.id);
    setReplyUserId(comment.userID);
    setReplyContent(comment.userID !== user?.id ? `@${comment.userName} ` : '');
    setShowEmoji2(false);
  }

  function toggleReplies(commentId: number) {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId); else next.add(commentId);
      return next;
    });
  }

  function addEmojiToContent(emoji: { name: string; path: string }, isReply: boolean) {
    const tag = `<e>${emoji.name}</e> `;
    if (isReply) setReplyContent((c) => c + tag);
    else setContent((c) => c + tag);
  }

  function showUserInfo(userId: number) {
    window.dispatchEvent(new CustomEvent(openUserInfo, { detail: { userId } }));
  }

  function renderComment(comment: Comment, isReply = false) {
    return (
      <article key={comment.id} id={`id${comment.id}`} className={`rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-800 ${isReply ? 'bg-neutral-50 dark:bg-neutral-700/40 border-neutral-100 dark:border-neutral-600' : ''}`}>
        <div className="p-3 sm:p-4 flex gap-3">
          <div className="shrink-0">
            <button
              type="button"
              aria-label={`Xem hồ sơ ${comment.userName}`}
              className="relative block cursor-pointer rounded-full border-none bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-primary-100"
              onClick={() => showUserInfo(comment.userID)}
            >
              <Image unoptimized loading="lazy" src={comment.avatar || '/default_avatar.jpg'} className="w-12 h-12 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-600 hover:border-primary-100 transition-colors duration-200" alt="avatar" width={48} height={48} onError={(e) => { (e.target as HTMLImageElement).src = '/default_avatar.jpg'; }} />
              {!isReply && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-lime-500 border-2 border-white dark:border-neutral-800 rounded-full" />}
            </button>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => showUserInfo(comment.userID)} className="border-none bg-transparent p-0 text-sm font-bold text-neutral-900 transition-colors hover:text-primary-100 dark:text-light-text dark:hover:text-primary-100">{comment.userName}</button>
                {/* {!isReply && <span className="px-2 py-0.5 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs font-medium rounded-full">Thành viên</span>} */}
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                {!isReply && <span className="font-medium">{dateAgo(comment.commentedAt)}</span>}
                {comment.chapterName && (
                  <Link href={getChapterDetailUrl2(comic.url, comment.chapterID, comment.chapterName)} className="text-primary-100 hover:text-primary-200 font-medium hover:underline">
                    Chapter {comment.chapterName}
                  </Link>
                )}
              </div>
            </div>
            <div className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed wrap-break-word">
              {renderEmojiContent(comment.content)}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button type="button" className="flex items-center gap-1 px-2 py-1 text-neutral-500 dark:text-neutral-400 hover:text-lime-600 dark:hover:text-lime-400 hover:bg-neutral-100 dark:hover:bg-neutral-600 rounded-lg transition-colors duration-200 border-none cursor-pointer">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                  <span className="text-xs font-medium">0</span>
                </button>
                <button type="button" className="flex items-center gap-1 px-2 py-1 text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-600 rounded-lg transition-colors duration-200 border-none cursor-pointer">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" /></svg>
                </button>
              </div>
              <button type="button" className="flex items-center gap-1 px-3 py-1 text-neutral-600 dark:text-neutral-400 hover:text-primary-100 hover:bg-primary-100/10 rounded-lg transition-colors duration-200 border-none cursor-pointer" onClick={() => openReply(comment)}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                Phản hồi
              </button>
            </div>
            {comment.replies && comment.replies.length > 0 && !isReply && (
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-700">
                <button type="button" className="flex items-center gap-2 text-primary-100 hover:text-primary-200 text-sm font-medium hover:underline border-none cursor-pointer" onClick={() => toggleReplies(comment.id)}>
                  <svg className={`w-4 h-4 transition-transform ${expandedReplies.has(comment.id) ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6,9 12,15 18,9" /></svg>
                  Xem {comment.replies.length} phản hồi
                </button>
              </div>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <section ref={sectionRef} className="mt-8 w-full space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50/60 p-3 sm:p-5 dark:border-neutral-700 dark:bg-neutral-900/40">
      <div className="rounded-xl bg-white p-5 md:shadow-sm dark:bg-neutral-800 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
              <h2 className="text-xl font-bold text-gray-700 dark:text-light-text">Bình luận</h2>
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Chia sẻ cảm nhận của bạn về truyện</div>
          </div>
          <span className="rounded-full bg-primary-100/10 px-3 py-1 text-sm font-bold text-primary-100">
            {shouldFetchComments && !isLoading ? commentsCount : '...'}
          </span>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="flex flex-col items-start gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800 sm:flex-row sm:items-center">
          <svg className="w-10 h-10 text-primary-100 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10,17 15,12 10,7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
          <div className="flex-1">
            <h3 className="mb-1 text-base font-bold text-neutral-900 dark:text-light-text">Tham gia thảo luận</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Đăng nhập để chia sẻ cảm nhận về truyện.</p>
          </div>
          <Link href="/auth/dang-nhap" className="flex items-center gap-2 rounded-lg bg-primary-100 px-5 py-2.5 font-medium text-white transition-colors hover:bg-primary-200" title="Đăng nhập">
            Đăng nhập
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9,18 15,12 9,6" /></svg>
          </Link>
        </div>
      )}

      {isAuthenticated && (
        <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 p-4 border-b border-neutral-100 dark:border-neutral-700">
              <div className="relative">
                <Image unoptimized loading="lazy" src={user?.avatar || '/default_avatar.jpg'} className="w-10 h-10 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-600" alt="avatar" width={40} height={40} onError={(e) => { (e.target as HTMLImageElement).src = '/default_avatar.jpg'; }} />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-lime-500 border-2 border-white dark:border-neutral-800 rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-neutral-900 dark:text-light-text">{user?.firstName} {user?.lastName}</span>
                {/* <span className="text-xs text-neutral-500 dark:text-neutral-400">Thành viên</span> */}
              </div>
            </div>
            <div className="p-4">
              <textarea className="w-full h-24 p-3 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-light-text placeholder-neutral-500 dark:placeholder-neutral-400 resize-none focus:ring-2 focus:ring-primary-100 focus:border-primary-100 transition-colors duration-200" placeholder="Chia sẻ cảm nhận của bạn về truyện này..." required value={content} onChange={(e) => setContent(e.target.value)} rows={4} />
            </div>
            <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-700/50">
              <div className="flex items-center gap-2">
                <div ref={emojiRef} className="relative">
                  <button type="button" className="flex items-center gap-2 px-3 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-600 rounded-lg transition-colors duration-200 border-none cursor-pointer" onClick={() => setShowEmoji(!showEmoji)}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
                    <span className="text-sm font-medium">Emoji</span>
                  </button>
                  {showEmoji && (
                    <EmojiPicker onSelect={(emoji) => { addEmojiToContent(emoji, false); setShowEmoji(false); }} />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => { setContent(''); setShowEmoji(false); }} className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 font-medium border border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 rounded-lg transition-colors duration-200 cursor-pointer">Hủy</button>
                <button type="submit" disabled={!content.trim()} className="flex items-center gap-2 px-6 py-2 bg-primary-100 hover:bg-primary-200 disabled:bg-neutral-400 text-white font-medium rounded-lg transition-colors duration-200 border-none cursor-pointer disabled:cursor-not-allowed">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22,2 15,22 11,13 2,9 22,2" /></svg>
                  Gửi bình luận
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {!shouldFetchComments && (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-white/80 px-5 py-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400">
          Bình luận sẽ được tải khi bạn cuộn đến khu vực này.
        </div>
      )}

      {shouldFetchComments && isLoading && (
        <div className="space-y-3">
          {[1, 2].map((item) => (
            <div key={item} className="animate-pulse rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex gap-3">
                <div className="h-12 w-12 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-32 rounded bg-neutral-200 dark:bg-neutral-700" />
                  <div className="h-4 w-full rounded bg-neutral-100 dark:bg-neutral-700/70" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {shouldFetchComments && isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
          Không thể tải bình luận lúc này. Vui lòng thử lại sau.
        </div>
      )}

      {shouldFetchComments && !isLoading && !isError && comments.length === 0 && (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-white px-5 py-10 text-center dark:border-neutral-700 dark:bg-neutral-800">
          <p className="font-medium text-neutral-700 dark:text-neutral-200">Chưa có bình luận nào</p>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Hãy là người đầu tiên chia sẻ cảm nhận về truyện.</p>
        </div>
      )}

      {shouldFetchComments && !isLoading && !isError && comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-1">
              {renderComment(comment)}
              {expandedReplies.has(comment.id) && comment.replies && comment.replies.length > 0 && (
                <div className="ml-8 space-y-3 border-l-2 border-neutral-100 pl-4 dark:border-neutral-700 sm:ml-12">
                  {comment.replies.map((reply) => renderComment(reply, true))}
                </div>
              )}
              {replyCommentId === comment.id && isAuthenticated && (
                <div className="ml-8 rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-700/50 sm:ml-12">
                  <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="space-y-3">
                    <div className="flex gap-3 p-3">
                      <div className="shrink-0">
                        <Image unoptimized loading="lazy" src={user?.avatar || '/default_avatar.jpg'} className="w-8 h-8 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-600" alt="avatar" width={32} height={32} onError={(e) => { (e.target as HTMLImageElement).src = '/default_avatar.jpg'; }} />
                      </div>
                      <div className="flex-1">
                        <textarea className="w-full p-2 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-light-text placeholder-neutral-500 dark:placeholder-neutral-400 resize-none focus:ring-2 focus:ring-primary-100 focus:border-primary-100 transition-colors duration-200" placeholder="Viết phản hồi..." required value={replyContent} onChange={(e) => setReplyContent(e.target.value)} rows={3} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-3 pb-3">
                      <div className="flex items-center gap-2">
                        <div ref={emojiRef2} className="relative">
                          <button type="button" className="flex items-center gap-1 px-2 py-1 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-600 rounded-lg border-none cursor-pointer" onClick={() => setShowEmoji2(!showEmoji2)}>
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
                          </button>
                          {showEmoji2 && <EmojiPicker onSelect={(emoji) => { addEmojiToContent(emoji, true); setShowEmoji2(false); }} />}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" className="px-3 py-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 font-medium border border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 rounded-lg transition-colors duration-200 cursor-pointer" onClick={() => setReplyCommentId(null)}>Hủy</button>
                        <button type="submit" className="flex items-center gap-1 px-4 py-1 bg-primary-100 hover:bg-primary-200 text-white font-medium rounded-lg transition-colors duration-200 border-none cursor-pointer">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22,2 15,22 11,13 2,9 22,2" /></svg>
                          Gửi
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {shouldFetchComments && totalPages > 1 && (
        <div className="border-t border-neutral-200 pt-3 dark:border-neutral-700">
          <Pagination currentPage={currentPage} totalpage={totalPages} onChange={setCurrentPage} />
        </div>
      )}
    </section>
  );
}
