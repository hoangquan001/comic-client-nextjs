'use client';

import { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { useClickOutside } from '@/lib/hooks/use-click-outside';
import { EMOJI_CONTENTS } from './emoji-constants';

interface EmojiPickerProps {
  onSelect: (emoji: { name: string; path: string }) => void;
}

export default function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [activeId, setActiveId] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsDropdownOpen(false));

  const activeEmoji = useMemo(
    () => EMOJI_CONTENTS.find((c) => c.id === activeId),
    [activeId]
  );

  const emojiList = useMemo(
    () => (activeEmoji ? Array.from({ length: activeEmoji.length }, (_, i) => i + 1) : []),
    [activeEmoji]
  );

  const visiblePacks = useMemo(() => EMOJI_CONTENTS.slice(0, 5), []);
  const hiddenPacks = useMemo(() => EMOJI_CONTENTS.slice(5), []);

  function getEmojiPath(packId: number, index: number): string {
    const pack = EMOJI_CONTENTS.find((c) => c.id === packId);
    if (!pack || index <= 0 || index > pack.length) return '';
    return `/emoji/data/${pack.name}/${index}.gif`;
  }

  function handleEmojiClick(index: number) {
    if (!activeEmoji) return;
    const name = `${activeEmoji.name}_${index}`;
    const path = getEmojiPath(activeId, index);
    onSelect({ name, path });
  }

  return (
    <div ref={containerRef} className="absolute right-0 bottom-0 z-20 block bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden w-72 h-96 sm:w-80 md:w-72">
      {/* Header - Pack selector */}
      <div className="flex items-center gap-2 p-2 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
        {visiblePacks.map((pack) => (
          <div
            key={pack.id}
            className={`relative cursor-pointer rounded-xl px-2 border-2 hover:scale-105 hover:shadow-md transition-transform ${
              activeId === pack.id
                ? 'border-primary-100 bg-primary-50 dark:bg-primary-100/10 shadow-md'
                : 'border-transparent opacity-70 hover:opacity-100 hover:bg-neutral-100 dark:hover:bg-neutral-700'
            }`}
            onClick={() => setActiveId(pack.id)}
          >
            <Image className="w-10 h-10 object-contain rounded-lg drop-" src={pack.img} alt={pack.describe} loading="lazy" width={40} height={40} />
          </div>
        ))}

        <button
          className="ml-auto p-2 rounded-xl bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2 hover:scale-105 active:scale-95"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
          aria-label="Xem thêm emoji packs"
        >
          <svg className={`w-5 h-5 text-neutral-600 dark:text-neutral-300 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" />
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* Hidden packs dropdown */}
      <div className={`absolute top-16 left-0 right-0 z-30 bg-white dark:bg-neutral-800 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-700 transition-all ${isDropdownOpen ? '' : 'opacity-0 pointer-events-none -translate-y-2'}`}>
        <div className="flex flex-col max-h-48 overflow-y-auto">
          {hiddenPacks.map((pack) => (
            <div
              key={pack.id}
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700 border-b border-neutral-100 dark:border-neutral-700 last:border-b-0"
              onClick={() => {
                setActiveId(pack.id);
                setIsDropdownOpen(false);
              }}
            >
              <Image className="w-8 h-8 object-contain rounded-lg drop-" src={pack.img} alt={pack.describe} loading="lazy" width={32} height={32} />
              <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">{pack.describe}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Emoji grid */}
      <div className="grid grid-cols-4 gap-2 p-2 overflow-y-auto h-full max-h-80 sm:grid-cols-5 md:grid-cols-4">
        {emojiList.map((index) => (
          <div
            key={index}
            className="relative cursor-pointer rounded-xl p-2 hover:scale-110 hover:shadow-lg"
            onClick={() => handleEmojiClick(index)}
          >
            <Image
              className="w-full h-full object-contain rounded-lg drop- hover:brightness-110"
              src={getEmojiPath(activeId, index)}
              alt={`Emoji ${index}`}
              loading="lazy"
              width={48}
              height={48}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
