'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { UserMenu } from './user-menu';

const NAV_LINKS = [
  { href: '/truyen-hot', label: 'Hot', icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z' },
  { href: '/xep-hang', label: 'Xếp hạng', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { href: '/tim-truyen', label: 'Tìm kiếm nâng cao', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { href: '/theo-doi', label: 'Theo dõi', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { href: '/lich-su', label: 'Lịch sử', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { href: '/tro-ly-ai', label: 'Trợ lý AI', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
];

export function Header() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showGenre, setShowGenre] = useState(false);
  const { theme, setTheme } = useTheme();

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <header>
      {/* Top header bar */}
      <div className="px-3 py-1.5 border-b border-primary-100 h-[73px]">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-full md:px-4">
          <Link href="/" className="flex-shrink-0 text-primary-100 hover:scale-105 transition-transform duration-200">
            <img className="w-[127.5px] h-[60px] object-contain" loading="eager" src="/logo.png" alt="logo" />
          </Link>

          <div className="flex gap-2 items-center">
            {/* Theme toggle */}
            <div className="relative w-12 h-7 rounded-full bg-neutral-200 dark:bg-neutral-700">
              <input
                aria-label="Toggle theme"
                id="theme-toggle"
                onChange={toggleTheme}
                type="checkbox"
                checked={isDark}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <span className={`absolute top-1/2 left-1 w-5 h-5 bg-white rounded-full -translate-y-1/2 transition-transform duration-200 flex items-center justify-center ${isDark ? 'translate-x-5' : ''}`}>
                <svg className={`w-4 h-4 text-primary-100 ${isDark ? 'hidden' : 'block'}`} viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 12.667A4.667 4.667 0 1 0 8 3.333a4.667 4.667 0 0 0 0 9.334z" />
                  <path d="M8 15.307a.667.667 0 0 1-.667-.667v-.053a.667.667 0 1 1 1.334 0 .667.667 0 0 1-.667.72zm4.76-1.88a.667.667 0 0 1-.473-.194l-.087-.087a.667.667 0 1 1 .94-.94l.087.087a.667.667 0 0 1-.467 1.134zm-9.52 0a.667.667 0 0 1-.473-1.134l.087-.087a.667.667 0 1 1 .94.94l-.087.087a.667.667 0 0 1-.467.194zM14.667 8.667h-.054a.667.667 0 1 1 0-1.334.667.667 0 0 1 0 1.334zm-13.28 0h-.054a.667.667 0 1 1 0-1.334.667.667 0 0 1 0 1.334zm11.286-4.674a.667.667 0 0 1-.473-.193.667.667 0 0 1 0-.94l.087-.087a.667.667 0 1 1 .94.94l-.087.087a.667.667 0 0 1-.467.193zm-9.346 0a.667.667 0 0 1-.473-.193l-.087-.087a.667.667 0 1 1 .94-.94l.087.087a.667.667 0 0 1-.467 1.133zM8 2.027a.667.667 0 0 1-.667-.667V1.333a.667.667 0 1 1 1.334 0 .667.667 0 0 1-.667.694z" />
                </svg>
                <svg className={`w-4 h-4 text-primary-100 ${isDark ? 'block' : 'hidden'}`} viewBox="0 0 16 16" fill="currentColor">
                  <path d="M14.353 10.62c-.107-.18-.407-.46-1.153-.327-.414.073-.834.107-1.254.087-1.553-.067-2.96-.78-3.94-1.88-.866-.967-1.4-2.227-1.406-3.587 0-.76.146-1.493.446-2.187.294-.673.087-1.027-.06-1.173-.153-.154-.513-.367-1.22-.067C3.04 2.627 1.353 5.36 1.553 8.287c.2 2.76 2.133 6.113 4.693 7 .614.213 1.26.34 1.927.367.067.006.174.013.28.013 2.234 0 4.327-1.053 5.647-2.847.447-.62.327-1.013.213-1.193z" />
                </svg>
              </span>
            </div>

            <UserMenu />
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
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
              <svg className="size-[18px] shrink-0" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
          </li>
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="h-full">
              <Link href={link.href} className="flex items-center gap-2 h-full px-3 text-white no-underline rounded-t-lg cursor-pointer font-semibold hover:bg-white hover:text-black">
                <svg className="size-[18px] shrink-0" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                </svg>
                {link.label}
              </Link>
            </li>
          ))}
          <li className="relative h-full" onMouseEnter={() => setShowGenre(true)} onMouseLeave={() => setShowGenre(false)}>
            <div className="flex items-center gap-2 h-full px-3 text-white no-underline rounded-t-lg cursor-pointer font-semibold hover:bg-white hover:text-black">
              <svg className="size-[18px] shrink-0" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Thể loại
            </div>
            {showGenre && (
              <div className="hidden lg:block absolute top-full left-0 z-40 text-black dark:text-light-text">
                <GenreDropdown />
              </div>
            )}
          </li>
        </ul>

        {/* Mobile sidebar */}
        <ul className={`absolute top-full left-0 z-40 w-full bg-white dark:bg-neutral-900 text-black dark:text-light-text border shadow-lg lg:hidden transition-all origin-top duration-200 flex flex-col list-none p-0 m-0 border-primary-100 dark:border-neutral-700 ${showSidebar ? 'translate-y-0' : '-translate-y-full hidden'}`}>
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
        </ul>
      </nav>
    </header>
  );
}

function GenreDropdown() {
  // Simplified genre dropdown - will be enhanced later
  const genres = [
    { title: 'Manga', slug: 'manga' },
    { title: 'Manhua', slug: 'manhua' },
    { title: 'Manhwa', slug: 'manhwa' },
    { title: 'Action', slug: 'action' },
    { title: 'Romance', slug: 'romance' },
    { title: 'Fantasy', slug: 'fantasy' },
    { title: 'Comedy', slug: 'comedy' },
    { title: 'Drama', slug: 'drama' },
  ];

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-b-lg shadow-xl border border-neutral-200 dark:border-neutral-700 p-4 max-h-[60vh] overflow-y-auto w-[300px]">
      <div className="grid grid-cols-2 gap-2">
        {genres.map((g) => (
          <Link
            key={g.slug}
            href={`/the-loai/${g.slug}`}
            className="text-sm px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            {g.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
