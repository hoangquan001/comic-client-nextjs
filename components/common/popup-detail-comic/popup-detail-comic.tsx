'use client';

import type { Comic } from '@/types';
import { formatNumber } from '@/lib/utils/number';
import { fillDescription } from '@/lib/utils/description';

interface PopupDetailComicProps {
  comic?: Comic;
  visible?: boolean;
}

const slideInUpStyle = `
@keyframes popup-slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
`;

export function PopupDetailComic({ comic, visible }: PopupDetailComicProps) {
  if (!visible || !comic) return null;

  const descriptionHtml = fillDescription(comic.description, comic);

  return (
    <>
      <style>{slideInUpStyle}</style>
      <div
        className="flex flex-col w-[28rem] max-w-[90vw] bg-white/95 dark:bg-neutral-900/95 rounded-2xl shadow-lg overflow-hidden"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          animation: 'popup-slideInUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          lineHeight: 1.4,
        }}
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" />

        {/* Main Content */}
        <div className="relative z-10 p-4 flex flex-col gap-3">
          {/* Header Section */}
          <div className="flex flex-col p-1 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
            {/* Title */}
            <p className="text-xl font-bold text-neutral-900 dark:text-light-text leading-tight">
              {comic.title}
            </p>

            {/* Author */}
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
              <svg
                className="w-4 h-4 stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="7" r="4" strokeWidth={2} />
              </svg>
              <span className="text-sm font-medium">
                {comic.author || 'Đang cập nhật'}
              </span>
            </div>
          </div>

          {/* Genres Section */}
          {comic.genres?.length > 0 && (
            <div className="flex flex-wrap gap-2 p-1">
              {comic.genres.map((genre, i) => (
                <span
                  key={genre.id}
                  className={`px-1 py-0.5 text-[0.7rem] font-semibold rounded-full ${
                    i === 0
                      ? 'bg-gradient-to-r from-primary-100 to-primary-200 text-white'
                      : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                  }`}
                  style={i === 0 ? { boxShadow: '0 4px 15px rgba(248, 110, 76, 0.3)' } : undefined}
                >
                  {genre.title}
                </span>
              ))}
            </div>
          )}

          {/* Stats Section */}
          <div className="flex justify-around p-1 bg-neutral-100 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-700">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-yellow-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-sm font-semibold">
                {comic.rating || 'N/A'}
              </span>
            </div>

            {/* Views */}
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="3" strokeWidth={2} />
              </svg>
              <span className="text-sm font-semibold">
                {formatNumber(comic.viewCount)}
              </span>
            </div>

            {/* Chapters */}
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M4 19.5A2.5 2.5 0 0 1 1.5 17V7A2.5 2.5 0 0 1 4 4.5h16A2.5 2.5 0 0 1 22.5 7v10a2.5 2.5 0 0 1-2.5 2.5H4z"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 9h6M9 12h6M9 15h6"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm font-semibold">
                {comic.chapters?.length ?? comic.numChapter ?? 0}
              </span>
            </div>
          </div>

          {/* Description Section */}
          <div className="p-4 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
              <svg
                className="w-4 h-4 stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="14,2 14,8 20,8"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="16" y1="13" x2="8" y2="13"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="16" y1="17" x2="8" y2="17"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="10,9 9,9 8,9"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm font-semibold">Mô tả</span>
            </div>
            <div
              className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-4 mt-1"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
