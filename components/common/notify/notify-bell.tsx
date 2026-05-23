'use client';

import { useState, useRef } from 'react';
import { useClickOutside } from '@/lib/hooks/use-click-outside';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import { useUserNotify } from '@/lib/hooks/use-account-queries';
import dynamic from 'next/dynamic';
const NotifyPopup = dynamic(() => import('./notify-popup'), { ssr: false });
export default function NotifyBell() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: notifyData } = useUserNotify(isAuthenticated);
  const notifications = notifyData ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useClickOutside(containerRef, () => setIsVisible(false));

  if (!isAuthenticated) return null;

  return (
    <div ref={containerRef} className="flex justify-center items-center relative h-8 w-8 cursor-pointer bg-neutral-100 dark:bg-neutral-800 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700">
      <button type="button" aria-label="Thông báo" className={`h-full w-full items-center flex select-none relative justify-center border-none bg-transparent ${isVisible ? '[&_svg]:fill-primary-100' : ''}`} onClick={() => setIsVisible(!isVisible)}>
        <div className="relative flex items-center justify-center">
          <svg className={`fill-neutral-600 dark:fill-neutral-300 hover:fill-primary-200`} height="20" width="20" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path d="M512 938.666667c47.146667 0 85.333333-38.186667 85.333333-85.333334h-170.666666c0 47.146667 38.186667 85.333333 85.333333 85.333334z m256-256V469.333333c0-131.2-69.76-240.64-192-269.653333V170.666667c0-35.413333-28.586667-64-64-64s-64 28.586667-64 64v29.013333c-122.24 29.013333-192 138.453333-192 269.653333v213.333334l-85.333333 85.333333v42.666667h682.666666v-42.666667l-85.333333-85.333333z" />
          </svg>
          <span className={`absolute z-50 size-3 -top-2 -right-2 bg-red-600 text-center font-bold text-white text-[10px] rounded-full flex items-center justify-center transition-all ${unreadCount > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
            {unreadCount}
          </span>
        </div>
      </button>
      {isVisible && <NotifyPopup onClose={() => setIsVisible(false)} />}
    </div>
  );
}
