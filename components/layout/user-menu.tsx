'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useClickOutside } from '@/lib/hooks/use-click-outside';
import { useAuthStore } from '@/lib/stores/use-auth-store';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setIsOpen(false));

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        {isAuthenticated && user?.avatar ? (
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/default_avatar.jpg';
            }}
          />
        ) : (
          <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-40 w-72 bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
            {isAuthenticated ? (
              <>
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center gap-3">
                    <img
                      src={user?.avatar || '/default_avatar.jpg'}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-sm">{user?.firstName || user?.username}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <nav className="py-2">
                  {[
                    { href: '/tai-khoan/profile', label: 'Tài khoản', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                    { href: '/theo-doi', label: 'Theo dõi', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
                    { href: '/lich-su', label: 'Lịch sử', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { href: '/dong-bo-truyen', label: 'Đồng bộ', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700"
                      onClick={() => setIsOpen(false)}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="border-t border-neutral-200 dark:border-neutral-700 py-2">
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                      router.push('/');
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm w-full text-red-500 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 text-center">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="font-semibold text-sm">Chào mừng bạn!</p>
                  <p className="text-xs text-gray-500 mt-1">Đăng nhập để trải nghiệm đầy đủ tính năng</p>
                </div>
                <div className="px-4 pb-4 flex flex-col gap-2">
                  <Link
                    href="/auth/login"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary-100 text-white rounded-lg text-sm font-semibold hover:opacity-90"
                    onClick={() => setIsOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/auth/register"
                    className="flex items-center justify-center gap-2 w-full py-2.5 border border-primary-100 text-primary-100 rounded-lg text-sm font-semibold hover:bg-primary-100 hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Đăng ký miễn phí
                  </Link>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
