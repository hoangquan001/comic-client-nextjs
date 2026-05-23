'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { useClickOutside } from '@/lib/hooks/use-click-outside';
import LoopScroll from '@/components/common/loop-scroll/loop-scroll';
import type { Chapter } from '@/types';
import { dateAgo } from '@/lib/utils/date';

interface ChapterSelectorProps {
  chapters: Chapter[];
  currentChapter: Chapter | null;
  topToBottom?: boolean;
  onChapterChange: (chapter: Chapter) => void;
  onOpen?: () => void;
}


export default function ChapterSelector({
  chapters,
  currentChapter,
  topToBottom = false,
  onChapterChange,
  onOpen,
}: ChapterSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useClickOutside(containerRef, () => setIsOpen(false));

  const filteredChapters = useMemo(() => {
    if (!searchTerm.trim()) return chapters;
    const lower = searchTerm.toLowerCase();
    return chapters.filter((ch) => ch.title?.toLowerCase().includes(lower));
  }, [chapters, searchTerm]);

  function toggleDropdown() {
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      onOpen?.();
      setSearchTerm('');
    }
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchTerm(value.toLowerCase()), 300);
  }

  function selectChapter(chapter: Chapter) {
    onChapterChange(chapter);
    setIsOpen(false);
    setSearchTerm('');
  }

  if (!currentChapter) return null;

  return (
    <div ref={containerRef} className="relative inline-block">
      <button type="button" className="flex items-center justify-between gap-3 px-2 py-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md  hover:shadow-md cursor-pointer w-full sm:w-64 hover:border-sky-300 dark:hover:border-sky-600 focus-within:ring-2 focus-within:ring-sky-500/20" onClick={toggleDropdown}>
        <div className="flex items-center gap-1 sm:gap-3 flex-1 min-w-0">
          <svg className="w-5 h-5 text-sky-600 dark:text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <div className="text-sm font-semibold text-neutral-900 dark:text-light-text">
            <span className="hidden sm:inline">#Chapter </span>
            <span>{currentChapter.slug}</span>
          </div>
        </div>
        <div className={`flex-shrink-0 w-6 h-6 text-neutral-400 dark:text-neutral-500 hidden sm:block transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className={`absolute left-1/2 transform -translate-x-1/2 z-50 mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-xl min-w-[320px] max-w-[480px] overflow-hidden ${topToBottom ? 'top-full' : 'bottom-full mb-2 mt-0'}`}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-700">
            <div className="flex items-center gap-2 uppercase">
              <svg className="w-5 h-5 text-sky-600 dark:text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span className="text-sm font-semibold text-neutral-900 dark:text-light-text">Danh sách chương</span>
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded-full">{filteredChapters.length} chương</div>
          </div>

          <div className="p-4 border-b border-neutral-100 dark:border-neutral-700">
            <div className="relative flex items-center">
              <svg className="absolute left-3 w-4 h-4 text-neutral-400 dark:text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                maxLength={255}
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 dark:focus:border-sky-400 text-neutral-900 dark:text-light-text placeholder-neutral-500 dark:placeholder-neutral-400"
                placeholder="Tìm kiếm chương..."
                onChange={handleSearch}
              />
              {searchTerm && (
                <button className="absolute right-3 w-4 h-4 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300" onClick={() => setSearchTerm('')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              )}
            </div>
          </div>

          <div className="py-2 flex w-full overflow-hidden items-center justify-center">
            {filteredChapters.length === 0 && searchTerm ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-neutral-500 dark:text-neutral-400">
                <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                <span className="text-sm">Không tìm thấy chương nào</span>
              </div>
            ) : (
              <div className="w-full max-h-80 min-h-0 flex">
                <LoopScroll
                  allItems={filteredChapters}
                  selectedID={currentChapter?.id}
                  itemHeight={37}
                  trackById={(ch) => ch.id}
                  renderItem={(chapter) => (
                    <div
                      className={`flex items-center justify-between px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 cursor-pointer border-b border-neutral-100 dark:border-neutral-700/50 last:border-b-0 ${chapter.id === currentChapter?.id ? 'bg-sky-50 dark:bg-sky-900/20 border-sky-100 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/30' : ''}`}
                      onClick={() => selectChapter(chapter)}
                    >
                      <div className="flex gap-3 flex-1 min-w-0">
                        <div className="text-sm font-semibold text-neutral-900 dark:text-light-text">#{chapter.title}</div>
                        {chapter.updateAt && <div className="text-xs text-neutral-500 dark:text-neutral-400">{dateAgo(chapter.updateAt)}</div>}
                      </div>
                      <svg className="w-4 h-4 text-neutral-400 dark:text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                    </div>
                  )}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
