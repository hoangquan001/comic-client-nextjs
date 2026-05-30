'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { useHistoryStore } from '@/lib/stores/use-history-store';
import { openSettings } from '@/lib/utils/event.define';
import type { IUser } from '@/types';

interface UserMenuProps {
  initialUser: IUser | null;
  onClose: () => void;
}

export default function UserMenu({ initialUser, onClose }: UserMenuProps) {
  const router = useRouter();
  const { user: clientUser, initialized, logout } = useAuthStore();
  const user = initialized ? clientUser : initialUser;
  const isAuthenticated = !!user;
  const historyCount = useHistoryStore((state) => state.listHistory.length);
  const menuRef = useRef<HTMLDivElement>(null);


  const menuItems = [
    { label: 'Hồ sơ', route: '/tai-khoan/ho-so', type: 'link' as const, iconPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { label: 'Yêu thích', route: '/tai-khoan/yeu-thich', type: 'link' as const, iconPath: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { label: 'Lịch sử', route: '/tai-khoan/lich-su', type: 'link' as const, iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Đồng bộ', route: '/dong-bo-truyen', type: 'link' as const, iconPath: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
    { label: 'Cài đặt', type: 'button' as const, iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', secondaryIconPath: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  const handleMenuItemClick = (item: typeof menuItems[number]) => {
    onClose();
    if (item.type === 'button' && item.label === 'Cài đặt') {
      window.dispatchEvent(new CustomEvent(openSettings));
    }
  };

  const handleQuickAction = (action: string) => {
    if (action === 'sync') router.push('/dong-bo-truyen');
    else if (action === 'favorites') router.push('/tai-khoan/yeu-thich');
    else if (action === 'history') router.push('/tai-khoan/lich-su');
  };

  return (
    <div ref={menuRef} className="relative">

        <div className="fixed inset-0 z-40 bg-black/20" onClick={() => onClose()} />

        <div className="absolute right-0 top-full mt-3 w-72 md:w-80 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden" style={{ backdropFilter: 'blur(20px)', background: 'rgba(255, 255, 255, 0.95)' }}>
            <div className="dark:block hidden" style={{ background: 'rgba(38, 38, 38, 0.95)', position: 'absolute', inset: 0, borderRadius: 'inherit', zIndex: 0 }} />
            <div className="relative z-10">
              {isAuthenticated ? (
                <>
                  {/* User Profile Header */}
                  <div className="p-6 bg-gradient-to-br from-sky-50 to-indigo-100 dark:from-neutral-800 dark:to-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="relative mb-4">
                      <Image
                        loading="lazy"
                        src={user?.avatar || '/default_avatar.jpg'}
                        alt="User avatar"
                        className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-neutral-700 shadow-lg"
                        width={64}
                        height={64}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/default_avatar.jpg'; }}
                      />
                      <div className="absolute -bottom-1 -right-1 flex items-center gap-1 bg-lime-500 text-white text-xs px-2 py-1 rounded-full">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span className="font-medium">Online</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-light-text">{user?.firstName || user?.username}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{user?.email}</p>
                      <div className="mt-3">
                        <span className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <span>{historyCount} truyện đã đọc</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center justify-center gap-2 p-4 border-b border-neutral-200 dark:border-neutral-700">
                    <button className="relative p-3 bg-neutral-100 dark:bg-neutral-700 hover:bg-sky-100 dark:hover:bg-sky-900/30 rounded border-none cursor-pointer" title="Đồng bộ truyện" onClick={() => handleQuickAction('sync')}>
                      <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8z" />
                        <path d="M12 18c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
                      </svg>
                    </button>
                    <button className="relative p-3 bg-neutral-100 dark:bg-neutral-700 hover:bg-sky-100 dark:hover:bg-sky-900/30 rounded border-none cursor-pointer" title="Yêu thích" onClick={() => handleQuickAction('favorites')}>
                      <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <button className="relative p-3 bg-neutral-100 dark:bg-neutral-700 hover:bg-sky-100 dark:hover:bg-sky-900/30 rounded border-none cursor-pointer" title="Lịch sử" onClick={() => handleQuickAction('history')}>
                      <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Navigation Menu */}
                  <nav className="py-2">
                    <ul className="space-y-1 list-none p-0 m-0">
                      {menuItems.map((item) => (
                        <li key={item.label} className="mx-2">
                          {item.type === 'link' ? (
                            <Link
                              href={item.route!}
                              className="flex items-center gap-3 px-4 py-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded no-underline hover:text-neutral-900 dark:hover:text-light-text group"
                              onClick={() => onClose()}
                            >
                              <svg className="w-5 h-5 text-neutral-500 dark:text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.iconPath} />
                              </svg>
                              <span className="flex-1 font-medium">{item.label}</span>
                              <svg className="w-4 h-4 text-neutral-400 dark:text-neutral-500 group-hover:text-sky-500 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          ) : (
                            <button
                              onClick={() => handleMenuItemClick(item)}
                              className="flex items-center gap-3 px-4 py-3 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded border-none bg-transparent cursor-pointer w-full text-left hover:text-neutral-900 dark:hover:text-light-text group"
                            >
                              <svg className="w-5 h-5 text-neutral-500 dark:text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.iconPath} />
                                {item.secondaryIconPath && (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.secondaryIconPath} />
                                )}
                              </svg>
                              <span className="flex-1 font-medium">{item.label}</span>
                              <svg className="w-4 h-4 text-neutral-400 dark:text-neutral-500 group-hover:text-sky-500 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </nav>

                  {/* Divider */}
                  <div className="h-px bg-neutral-200 dark:bg-neutral-700 mx-4 my-2" />

                  {/* Logout */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        logout();
                        onClose();
                        router.push('/');
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border-none bg-transparent cursor-pointer"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Guest Profile Header */}
                  <div className="p-6 bg-gradient-to-br from-neutral-50 to-sky-50 dark:from-neutral-800 dark:to-sky-900/20 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center justify-center mb-4">
                      <svg className="md:size-20 size-16 text-neutral-400 dark:text-neutral-500 p-4 bg-neutral-100 dark:bg-neutral-700 rounded-full" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="text-center space-y-3">
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-light-text">Chào mừng bạn!</h3>
                      <p className="text-neutral-600 dark:text-neutral-400">Đăng nhập để trải nghiệm đầy đủ tính năng</p>
                      <div className="space-y-2 mt-4">
                        <div className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                          <svg className="w-4 h-4 text-sky-500 dark:text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                          <span>Lưu truyện yêu thích</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                          <svg className="w-4 h-4 text-sky-500 dark:text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Theo dõi lịch sử đọc</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                          <svg className="w-4 h-4 text-sky-500 dark:text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                            <circle cx="16" cy="8" r="3" />
                          </svg>
                          <span>Nhận thông báo mới</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Auth Buttons */}
                  <div className="p-4 space-y-3">
                    <Link
                      href="/auth/dang-nhap"
                      className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded font-medium border-none cursor-pointer no-underline bg-primary-100 text-white hover:bg-primary-200 shadow-lg hover:shadow-xl"
                      onClick={() => onClose()}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span>Đăng nhập</span>
                    </Link>
                    <Link
                      href="/auth/dang-ky"
                      className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded font-medium border-none cursor-pointer no-underline bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-light-text hover:bg-neutral-200 dark:hover:bg-neutral-600"
                      onClick={() => onClose()}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      <span>Đăng ký miễn phí</span>
                    </Link>
                  </div>

                  {/* Guest Quick Links */}
                  <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
                    <div className="text-sm font-semibold text-neutral-900 dark:text-light-text mb-3">Khám phá ngay</div>
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => { onClose(); window.dispatchEvent(new CustomEvent(openSettings)); }} className="flex flex-col items-center gap-2 p-3 bg-neutral-50 dark:bg-neutral-700 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg border-none cursor-pointer bg-transparent text-inherit hover:text-sky-600 dark:hover:text-sky-400">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-neutral-500 dark:text-neutral-400">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Cài đặt</span>
                      </button>
                      <Link href="/xep-hang" className="flex flex-col items-center gap-2 p-3 bg-neutral-50 dark:bg-neutral-700 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg no-underline text-inherit hover:text-sky-600 dark:hover:text-sky-400" onClick={() => onClose()}>
                        <svg className="w-6 h-6 text-neutral-500 dark:text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Xếp hạng</span>
                      </Link>
                      <Link href="/tim-truyen" className="flex flex-col items-center gap-2 p-3 bg-neutral-50 dark:bg-neutral-700 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg no-underline text-inherit hover:text-sky-600 dark:hover:text-sky-400" onClick={() => onClose()}>
                        <svg className="w-6 h-6 text-neutral-500 dark:text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Tìm kiếm</span>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}
