'use client';
import LoopScroll, { LoopScrollHandle } from "@/components/common/loop-scroll/loop-scroll";
import { useHistoryStore } from "@/lib/stores";
import { dateAgo } from "@/lib/utils/date";
import { getChapterDetailUrl } from "@/lib/utils/url";
import { Chapter, Comic } from "@/types";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import Selection from '@/components/common/selection/selection';

export default function ChapterList({ comic, chapters: initialChapters }: { comic: Comic; chapters: Chapter[] }) {
  const [asc, setAsc] = useState(false);
  const [search, setSearch] = useState('');
  const [curOptionValue, setCurOptionValue] = useState(0);
  const loopRef = useRef<LoopScrollHandle>(null);

  const history = useHistoryStore((s) => s.listHistory);
  const historyComic = history.find((c) => c.id === comic.id);
  const readChapters = useMemo(() => new Set(historyComic?.chapters?.map((ch) => ch.id) ?? []), [historyComic]);

  const sorted = useMemo(() =>
    [...initialChapters].sort((a, b) => asc ? a.slug - b.slug : b.slug - a.slug),
    [initialChapters, asc]
  );

  const filtered = useMemo(() => {
    if (!search) return sorted;
    return sorted.filter((ch) => ch.title?.toLowerCase().includes(search.toLowerCase()));
  }, [sorted, search]);

  const distance = comic.numChapter > 1000 ? 100 : comic.numChapter > 200 ? 50 : 30;
  const options = useMemo(() => {
    const _length = Math.floor((comic.numChapter - 1) / distance + 1);
    return Array.from({ length: _length }, (_, i) => ({
      label: `${i * distance} - ${(i + 1) * distance}`,
      value: asc ? i : _length - i - 1,
    }));
  }, [comic.numChapter, distance, asc]);

  function onScrollChange(idx: number, gridSize: number) {
    const optionValue = Math.round(idx * gridSize / distance);
    setCurOptionValue((prev) => {
      const newVal = Math.min(optionValue, options.length - 1);
      return newVal !== prev ? newVal : prev;
    });
  }

  function onSelectRange(value: string | number | boolean) {
    const idx = Number(value);
    loopRef.current?.goToItem(idx * distance);
  }

  function renderChapter(ch: Chapter) {
    const isRead = readChapters.has(ch.id);
    return (
      <Link href={getChapterDetailUrl(comic, ch)} title={ch.title}>
        <div className={`mr-2 mb-2 flex h-12 cursor-pointer select-none items-center justify-between rounded-lg bg-neutral-100 px-2 py-1 text-sm no-underline hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-500 ${isRead ? 'bg-neutral-200 dark:bg-neutral-800' : ''}`}>
          <div className="p-1">
            <p className={isRead ? 'text-neutral-700 dark:text-neutral-200' : ''}>
              Chapter {ch.slug}
            </p>
          </div>
          <div className="ml-auto p-1">
            <div className="text-xs text-neutral-700 dark:text-neutral-300">{dateAgo(ch.updateAt)}</div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="max-h-96 flex flex-col">
      <div className="flex flex-col justify-between gap-2 lg:flex-row">
        <span className="flex items-center font-semibold uppercase md:mt-3">
          <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill="currentColor" viewBox="0 0 512 512">
            <path d="M64 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM64 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48-208a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z" />
          </svg>
          <p className="ml-2 text-xl font-extrabold text-gray-700 dark:text-light-text">Danh sách chương</p>
        </span>
        <div className="flex items-center justify-between">
          <div className="relative mr-2">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center px-3">
              <svg className="h-3 w-3 text-neutral-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input
              type="search"
              maxLength={255}
              className="block w-48 border-b border-solid border-[#ccc] px-10 pt-1 text-sm text-neutral-900 outline-none focus:border-primary-100 focus:ring-primary-100 dark:border-neutral-600 dark:bg-dark-bg dark:text-light-text dark:placeholder-neutral-400 dark:focus:border-primary-100 dark:focus:ring-primary-100"
              placeholder="Tìm chương..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <label className="p-0.5 rounded border border-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700 bg-white dark:bg-neutral-800 cursor-pointer">
              <input
                className="hidden peer"
                type="checkbox"
                checked={asc}
                onChange={(e) => setAsc(e.target.checked)}
              />
              <svg className="size-4 peer-checked:hidden" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 17H16M4 12H13M4 7H10M18 13V5M18 5L21 8M18 5L15 8" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg className="size-4 hidden peer-checked:block" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 17H10M4 12H13M18 11V19M18 19L21 16M18 19L15 16M4 7H16" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </label>
            {options.length > 1 && (
              <Selection
                ariaLabel="Chọn nhóm chương"
                className="ml-2 w-32 rounded border bg-white px-2 py-1 text-sm dark:bg-neutral-800"
                value={curOptionValue}
                onChange={onSelectRange}
                options={options}
              />
            )}
          </div>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="my-3 h-20 rounded-lg bg-neutral-100 p-3 font-light text-neutral-600 dark:bg-neutral-800 dark:text-neutral-200">Không tìm thấy chương ...</div>
      )}

      <div className="relative mt-4 flex min-h-32 w-full overflow-hidden">
        <LoopScroll
          loopRef={loopRef}
          allItems={filtered}
          preloadItemCount={40}
          itemHeight={56}
          renderItem={renderChapter}
          onChange={onScrollChange}
          trackById={(ch: Chapter) => ch.id}
        />
      </div>
    </div>
  );
}
