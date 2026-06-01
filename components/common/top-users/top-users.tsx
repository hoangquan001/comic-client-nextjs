'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { clientFetch } from '@/lib/api/client-fetch';
import { Spinner } from '@/components/common/spinner/spinner';
import type { IUserLite, IServiceResponse } from '@/types';
import { formatNumber } from '@/lib/utils/number';
import { openUserInfo } from '@/lib/utils/event.define';
import { getLevel } from '@/lib/constants';

function getDisplayName(user: IUserLite) {
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || 'User';
}

export default function TopUsers() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInView(true); }, { rootMargin: '200px' });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const { data: topUsers = [], isLoading } = useQuery({
    queryKey: ['topUsers'],
    queryFn: () => clientFetch<IServiceResponse<IUserLite[]>>('/top-users').then((res) => res.data ?? []),
    enabled: inView,
  });

  function showUserInfo(userId: number) {
    window.dispatchEvent(new CustomEvent(openUserInfo, { detail: { userId } }));
  }

  return (
    <div ref={ref} className="w-full bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700  overflow-hidden">
      <div className="w-full flex items-center justify-center py-3 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 uppercase">
        <div className="flex items-center gap-2">
          {/* <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> */}
          <h3 className="text-base sm:text-md font-bold text-gray-700 dark:text-light-text">Phong thần bảng</h3>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-bg min-h-80">
        {isLoading && <Spinner />}
        {!isLoading && topUsers.length > 0 && (
          <div className="grid grid-cols-1 gap-1 p-1">
            {topUsers.map((user, i) => (
              <button
                key={user.id}
                type="button"
                aria-label={`Xem hồ sơ ${getDisplayName(user)}`}
                onClick={() => showUserInfo(user.id)}
                className="shrink h-full w-full border-0 border-b border-neutral-200 bg-transparent text-left dark:border-neutral-700 last:border-b-0 relative flex items-center gap-3 p-1.5 cursor-pointer transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-primary-100 dark:hover:bg-neutral-700/40"
              >
                <Image src={`/frames/icon_txztxk${i + 1}.png`} alt={`frame ${i + 1}`} className="h-14 w-auto bg-cover absolute z-10" width={56} height={56} />
                <div className="relative shrink-0">
                  <Image className="w-10 h-11 object-cover ml-2" src={user.avatar || '/default_avatar.jpg'} alt="" width={40} height={44} unoptimized onError={(e) => (e.currentTarget.src = '/default_avatar.jpg')}  />
                </div>
                <div className="flex flex-col justify-between w-full gap-1">
                  <div className="space-y-0">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-light-text line-clamp-1">
                      <span className="hover:text-primary-100">{getDisplayName(user)}</span>
                    </h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-primary-100 font-semibold">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                      <span className="uppercase">{user.experience ? formatNumber(user.experience) : 0}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <svg className="w-3 h-3 shrink-0 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" /></svg>
                      <span className="hover:text-primary-100 hover:underline line-clamp-1">{getLevel(user.experience || 0, user.typeLevel || 0)}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
