'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
const GenreCategories = dynamic(() => import('@/components/common/genre-categories/genre-categories'));
const NAV_LINKS = [
  { href: '/truyen-hot', label: 'Hot', icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z' },
  { href: '/theo-doi', label: 'Theo dõi', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { href: '/xep-hang', label: 'Xếp hạng', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { href: '/tim-truyen', label: 'Tìm kiếm nâng cao', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { href: '/lich-su', label: 'Lịch sử', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { href: '/tro-ly-ai', label: 'Trợ lý AI', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
];

export function Nav() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showGenre, setShowGenre] = useState(false);
  const genreTimeoutRef = useRef<NodeJS.Timeout>(undefined);

  const handleGenreEnter = () => {
    if (genreTimeoutRef.current) clearTimeout(genreTimeoutRef.current);
    setShowGenre(true);
  };

  const handleGenreLeave = () => {
    genreTimeoutRef.current = setTimeout(() => setShowGenre(false), 200);
  };

  const openFeedback = () => {
    setShowSidebar(false);
    window.dispatchEvent(new CustomEvent('open-feedback'));
  };

  const openSettings = () => {
    setShowSidebar(false);
    window.dispatchEvent(new CustomEvent('open-settings'));
  };

  return (
    <nav className="relative bg-primary-100 dark:bg-neutral-800 text-white text-sm py-0.5">
      {/* Mobile header */}
      <div className="flex items-center justify-between px-3 h-10 lg:hidden">
        <div className="flex items-center gap-1 text-white">
          <svg className="w-7 h-7" viewBox="0 0 24 24" stroke="currentColor" fill="none">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <Link href="/" className="text-inherit no-underline text-sm font-medium">Trang chủ</Link>
        </div>
        <button
          type="button"
          aria-label="Toggle menu"
          className="bg-transparent border-2 border-transparent rounded-lg cursor-pointer p-1 hover:border-white/30"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? (
            <svg className="w-7 h-7" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-7 h-7" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          )}
        </button>
      </div>

      {/* Desktop nav links */}
      <ul className="hidden lg:container lg:flex items-center h-10 max-w-7xl mx-auto list-none p-0 gap-0.5">
        <li className="h-full">
          <Link href="/" aria-label="Trang chủ" className="flex items-center gap-2 h-full px-3 text-white no-underline rounded-t-lg cursor-pointer font-semibold hover:bg-white hover:text-black">
            <svg className="size-4.5 shrink-0" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
        </li>
        {/* Genre dropdown */}
        <li className="relative h-full" onMouseEnter={handleGenreEnter} onMouseLeave={handleGenreLeave}>
          <div className="flex items-center gap-2 h-full px-3 text-white no-underline rounded-t-lg cursor-pointer font-semibold hover:bg-white hover:text-black">
            <svg className="size-4.5 shrink-0" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Thể loại
          </div>
          {showGenre && (
            <div className="absolute top-full left-0 z-40 text-black dark:text-light-text" onMouseEnter={handleGenreEnter} onMouseLeave={handleGenreLeave}>
              <GenreCategories />
            </div>
          )}
        </li>
        {NAV_LINKS.map((link) => (
          <li key={link.href} className="h-full">
            <Link href={link.href} className="flex items-center gap-2 h-full px-3 text-white no-underline rounded-t-lg cursor-pointer font-semibold hover:bg-white hover:text-black">
              <svg className="size-4.5 shrink-0" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
              </svg>
              {link.label}
            </Link>
          </li>
        ))}

        {/* Feedback */}
        <li className="h-full">
          <button onClick={openFeedback} className="flex items-center gap-2 h-full px-3 text-white no-underline rounded-t-lg cursor-pointer font-semibold hover:bg-white hover:text-black bg-transparent border-none">
            <svg className="size-4.5 shrink-0" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Góp ý
          </button>
        </li>
      </ul>

      {/* Mobile sidebar */}
      <ul className={`absolute top-full left-0 z-40 w-full bg-white dark:bg-neutral-900 text-black dark:text-light-text border shadow-lg lg:hidden transition-all origin-top duration-200 flex flex-col list-none p-0 m-0 border-primary-100 dark:border-neutral-700 ${showSidebar ? 'translate-y-0' : '-translate-y-full hidden'}`}>

        {/* Mobile genre dropdown */}
        <li className="relative border-b border-neutral-100 dark:border-neutral-700" onClick={() => setShowGenre(!showGenre)} onMouseLeave={() => setShowGenre(false)}>
          <div className="flex items-center gap-3 p-3 text-inherit no-underline w-full h-10 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700">
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Thể loại
          </div>
          {showGenre && (
            <div className="absolute top-full left-0 right-0 z-40" onMouseEnter={() => setShowGenre(true)} onMouseLeave={() => setShowGenre(false)}>
              <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 p-4 overflow-y-auto">
                <GenreCategories />
              </div>
            </div>
          )}
        </li>
        {NAV_LINKS.map((link) => (
          <li key={link.href} className="border-b border-neutral-100 dark:border-neutral-700">
            <Link href={link.href} className="flex items-center gap-3 p-3 text-inherit no-underline w-full h-10 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700" onClick={() => setShowSidebar(false)}>
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
              </svg>
              {link.label}
            </Link>
          </li>
        ))}

        {/* Mobile feedback & settings */}
        <li className="border-b border-neutral-100 dark:border-neutral-700">
          <button onClick={openFeedback} className="flex items-center gap-3 p-3 text-inherit no-underline w-full h-10 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700 bg-transparent border-none text-inherit">
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Góp ý
          </button>
        </li>
        <li className="border-b border-neutral-100 dark:border-neutral-700">
          <button onClick={openSettings} className="flex items-center gap-3 p-3 text-inherit no-underline w-full h-10 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700 bg-transparent border-none text-inherit">
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Cài đặt
          </button>
        </li>
      </ul>
    </nav>

  );
}
