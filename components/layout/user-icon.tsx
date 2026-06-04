'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useClickOutside } from '@/lib/hooks/use-click-outside';
import { useAuthStore } from '@/lib/stores/use-auth-store';
import type { IUser } from '@/types';
import dynamic from 'next/dynamic';
const UserMenu = dynamic(() => import('./user-menu'), { ssr: false });
interface UserIconProps {
  initialUser: IUser | null;
}
export function UserIcon({ initialUser }: UserIconProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user: clientUser, initialized } = useAuthStore();
  const user = initialized ? clientUser : initialUser;
  const isAuthenticated = !!user;
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setIsOpen(false));
  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer border-none bg-transparent ${isAuthenticated ? '' : 'bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600'}`}
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        {isAuthenticated ? (
          <div className="relative">
            <Image
              loading="lazy"
              className="w-10 h-10 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-600"
              src={user.avatar || '/default_avatar.jpg'}
              alt="User avatar"
              width={40}
              height={40}
              unoptimized
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-lime-500 border-2 border-white dark:border-neutral-800 rounded-full" />
          </div>
        ) : (
          <div className="relative size-10 flex items-center justify-center">
            <svg className="size-6 text-neutral-600 dark:text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
      </button>
      {isOpen && (
        <UserMenu initialUser={user} onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
}
