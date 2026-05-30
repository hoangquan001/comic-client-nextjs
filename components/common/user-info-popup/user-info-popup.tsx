'use client';

import { useRef, useCallback } from 'react';
import Image from 'next/image';
import { getLevel } from '@/lib/constants/levels';
import { useClickOutside } from '@/lib/hooks/use-click-outside';
import type { IUser } from '@/types';
import { formatNumber } from '@/lib/utils/number';
import { useUserById } from '@/lib/hooks';

interface UserInfoPopupProps {
  userId: number | null;
  visible: boolean;
  onClose: () => void;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}


function getUserName(user: IUser): string {
  return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
}

export default function UserInfoPopup({ userId, visible, onClose }: UserInfoPopupProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useClickOutside(modalRef, handleClose);

  const { data: userInfo, isLoading } = useUserById(userId);

  if (!visible) return null;

  return (
    <>
    <div
      ref={modalRef}
      className="fixed z-[101] max-[376px]:w-[80%] max-sm:w-[300px] bg-white text-black dark:text-light-text dark:bg-neutral-800 shadow-2xl left-1/2 top-1/2 z-50 w-[400px] block rounded-2xl transform -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-neutral-200 dark:border-neutral-700 sm:w-[450px]"
    >
      {isLoading || !userInfo ? (
        <div className="flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 text-primary-100 animate-spin">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-full h-full"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 font-medium">
              Đang tải thông tin...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-neutral-200 dark:border-neutral-700 bg-primary-100 text-white">
            <div className="flex items-center gap-2 font-bold text-lg">
              <Image
                loading="lazy"
                src="/favicon.png"
                className="h-8 w-8 rounded-lg bg-white/20 p-1"
                alt="favicon-icon"
                width={32}
                height={32}
                unoptimized
              />
              <span className="font-bold">
                {getUserName(userInfo) || userInfo.username || 'User'}
              </span>
            </div>
            <button
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200 border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
              onClick={onClose}
              aria-label="Đóng popup"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col sm:flex-row justify-between p-4 border-b-2 border-dashed border-neutral-200 dark:border-neutral-700">
            {/* Avatar Section */}
            <div className="w-full m-auto max-sm:mt-2 sm:w-[30%] flex flex-col items-center">
              <div className="relative">
                <Image
                  loading="lazy"
                  src={userInfo.avatar || '/default_avatar.jpg'}
                  className="rounded-xl w-32 h-44 object-cover shadow-lg border-2 border-neutral-200 dark:border-neutral-600 transition-transform duration-200 hover:scale-105"
                  alt={userInfo.username || 'avatar'}
                  width={128}
                  height={176}
                  unoptimized
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default_avatar.jpg';
                  }}
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="w-full sm:w-[60%] max-sm:ml-2 flex flex-col items-start mt-4 sm:mt-0 sm:pl-4 space-y-3">
              {/* User ID */}
              <div className="flex justify-center sm:justify-start w-full text-sm">
                <span className="text-neutral-600 dark:text-neutral-400 min-w-[100px]">
                  ID:
                </span>
                <span className="ml-3 font-semibold text-neutral-900 dark:text-light-text">
                  #{userInfo.id}
                </span>
              </div>

              {/* Username */}
              <div className="flex justify-center sm:justify-start w-full text-sm mb-2">
                <span
                  className="uppercase font-bold text-xl bg-clip-text text-transparent bg-primary-50 dark:bg-gradient-to-r dark:from-red-500 dark:to-red-600"
                >
                  {userInfo.username}
                </span>
              </div>

              {/* Join Date */}
              <div className="flex justify-center sm:justify-start w-full text-sm">
                <span className="text-neutral-600 dark:text-neutral-400 min-w-[100px]">
                  Ngày tham gia:
                </span>
                <span className="ml-3 font-semibold text-neutral-900 dark:text-light-text">
                  {formatDate(userInfo.createAt)}
                </span>
              </div>

              {/* Experience */}
              <div className="flex justify-center sm:justify-start w-full text-sm">
                <span className="text-neutral-600 dark:text-neutral-400 min-w-[100px]">
                  {userInfo.typeLevel === 0 ? 'Tinh hoa:' : 'Kinh nghiệm:'}
                </span>
                <span className="ml-3 font-semibold text-sky-600 dark:text-sky-400">
                  {formatNumber(userInfo.experience!)}
                </span>
              </div>

              {/* Level */}
              <div className="flex justify-center sm:justify-start w-full text-sm">
                <span className="text-neutral-600 dark:text-neutral-400 min-w-[100px]">
                  {userInfo.typeLevel === 0 ? 'Cảnh giới:' : 'Cấp độ:'}
                </span>
                <span className="ml-3 font-semibold text-primary-100 font-bold">
                  {getLevel(userInfo.experience!, userInfo.typeLevel!)}
                </span>
              </div>

              {/* Motto */}
              <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-700 w-full">
                <div className="text-center font-medium text-sm text-neutral-700 dark:text-neutral-300 italic bg-neutral-50 dark:bg-neutral-700/50 p-3 rounded-lg border-l-4 border-red-500 line-clamp-3 w-full">
                  {userInfo.maxim || 'Chưa cập nhật châm ngôn'}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
    <div className="z-100 fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"></div>
    </>
  );
}
