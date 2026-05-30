'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUserNotify, useUpdateNotify, useDeleteNotify } from '@/lib/hooks/use-account-queries';
import { Empty } from '@/components/common/empty/empty';
import type { INotification } from '@/types';
import { dateAgo } from '@/lib/utils/date';

interface NotifyPopupProps {
  enabled?: boolean;
  onClose: () => void;
}

type DisplayNotification = INotification & {
  comic_title?: string;
  link?: string;
};

export default function NotifyPopup({ enabled = true, onClose }: NotifyPopupProps) {
  const [optionNotify, setOptionNotify] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [optionIndex, setOptionIndex] = useState<number | null>(null);

  const { data: rawData = [] } = useUserNotify(enabled);
  const updateNotifyMutation = useUpdateNotify();
  const deleteNotifyMutation = useDeleteNotify();

  const notifications = useMemo<DisplayNotification[]>(() =>
    rawData.map((notification) => {
      let parsed: Partial<DisplayNotification> = {};
      try {
        parsed = JSON.parse(notification.params || '{}') as Partial<DisplayNotification>;
      } catch {}
      const merged = { ...notification, ...parsed };
      if (notification.type === 0) merged.content = `<b>${merged.comic_title || 'Truyện'}</b> đã ra chapter mới.`;
      return merged;
    }),
    [rawData]
  );

  const filtered = optionNotify === 0 ? notifications : notifications.filter((notification) => !notification.isRead);
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;
  const totalCount = notifications.length;

  function handleMarkAllRead() {
    updateNotifyMutation.mutate({ ID: null, IsRead: null });
  }

  function handleDeleteAll() {
    deleteNotifyMutation.mutate(-1);
  }

  function handleToggleRead(id: number, isRead: boolean) {
    updateNotifyMutation.mutate({ ID: id, IsRead: !isRead });
    setOptionIndex(null);
  }

  function handleMarkRead(id: number, isRead: boolean) {
    if (!isRead) updateNotifyMutation.mutate({ ID: id, IsRead: true });
    setOptionIndex(null);
  }

  function handleDelete(id: number) {
    deleteNotifyMutation.mutate(id);
    setOptionIndex(null);
  }

  return (
    <div className="absolute right-0 max-sm:-right-13.5 top-full mt-3 w-96 bg-white dark:bg-dark-bg border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl z-50 overflow-hidden max-h-150">
      {/* Header */}
      <div className="relative bg-neutral-50 dark:bg-neutral-800">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-light-text">Thông báo</h3>
          </div>
          <div className="flex items-center gap-2">
            <button className={`p-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg cursor-pointer ${showOptions ? 'text-primary-100 bg-primary-100/10' : ''}`} onClick={() => setShowOptions(!showOptions)}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h16M4 16h16" /></svg>
            </button>
            <button type="button" aria-label="Đóng thông báo" className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg cursor-pointer" onClick={onClose}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        {showOptions && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg z-10">
            <div className="absolute -top-2 right-4 w-4 h-4 bg-white dark:bg-neutral-800 border-l border-t border-neutral-200 dark:border-neutral-700 transform rotate-45" />
            <div className="p-2">
              <button onClick={handleMarkAllRead} disabled={unreadCount === 0} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                <svg className="w-4 h-4 text-lime-600 dark:text-lime-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4" /><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.5 0 4.77 1.02 6.41 2.66" /></svg>
                <span>Đánh dấu tất cả đã đọc</span>
              </button>
              <button onClick={handleDeleteAll} disabled={totalCount === 0} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                <span>Xóa tất cả thông báo</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="relative bg-white dark:bg-dark-bg">
        <div className="flex">
          <button className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border-none bg-transparent cursor-pointer ${optionNotify === 0 ? 'text-primary-100 bg-neutral-50 dark:bg-neutral-800' : ''}`} onClick={() => setOptionNotify(0)}>
            <span className="font-medium">Tất cả</span>
            {totalCount > 0 && <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 text-xs rounded-full font-medium">{totalCount}</span>}
          </button>
          <button className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border-none bg-transparent cursor-pointer ${optionNotify === 1 ? 'text-primary-100 bg-neutral-50 dark:bg-neutral-800' : ''}`} onClick={() => setOptionNotify(1)}>
            <span className="font-medium">Chưa đọc</span>
            {unreadCount > 0 && <span className="px-2 py-0.5 bg-primary-100 text-white text-xs rounded-full font-medium">{unreadCount}</span>}
          </button>
        </div>
        <div className={`absolute bottom-0 left-0 w-1/2 h-0.5 bg-primary-100 transition-transform duration-300 ${optionNotify === 1 ? 'translate-x-full' : ''}`} />
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="p-8 text-center flex justify-center items-center flex-col bg-white dark:bg-dark-bg">
          <Empty />
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Bạn không có thông báo nào</p>
        </div>
      )}

      {/* Notification list */}
      {filtered.length > 0 && (
        <div className="bg-white dark:bg-dark-bg overflow-y-auto max-h-80 scrollbar-style-1">
          <div className="flex flex-col">
            {filtered.map((notify, i) => (
              <div key={notify.id} className={`relative border-b border-neutral-100 dark:border-neutral-800 last:border-b-0 ${!notify.isRead ? 'bg-sky-50/50 dark:bg-sky-900/10' : ''} ${hoveredIndex === i ? 'bg-neutral-50 dark:bg-neutral-800/50' : ''}`} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => { setHoveredIndex(null); if (optionIndex !== i) setOptionIndex(null); }}>
                {!notify.isRead && <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-primary-100 rounded-r" />}
                <div className="flex items-center p-3 gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <Link href={notify.link || '/'} onClick={() => handleMarkRead(notify.id, notify.isRead)} className="cursor-pointer rounded-lg size-12 shrink-0 overflow-hidden">
                    <Image loading="lazy" className="rounded-lg size-12 w-full h-full object-cover border border-neutral-200 dark:border-neutral-600 hover:scale-105" src={notify.image || '/empty.png'} alt="" width={48} height={48} />
                  </Link>
                  <Link href={notify.link || '/'} onClick={() => handleMarkRead(notify.id, notify.isRead)} className={`flex flex-col cursor-pointer flex-1 min-w-0 ${notify.isRead ? 'opacity-70' : ''}`}>
                    <span className="text-sm line-clamp-2 font-medium text-neutral-900 dark:text-light-text mb-1" dangerouslySetInnerHTML={{ __html: notify.content }} />
                    <span className={`text-xs text-neutral-500 dark:text-neutral-400 font-medium ${!notify.isRead ? 'text-primary-100 font-semibold' : ''}`}>{dateAgo(notify.timestamp)}</span>
                  </Link>
                </div>
                {(hoveredIndex === i || optionIndex === i) && (
                  <div className="absolute z-50 top-1/2 -translate-y-1/2 right-3 flex items-center justify-center bg-white dark:bg-neutral-700 w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-600 hover:cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-600  hover:scale-105 hover:shadow-md" onClick={() => setOptionIndex(optionIndex === i ? null : i)}>
                    <svg className="w-4 h-4 text-neutral-500 dark:text-neutral-400" fill="#5E5E5E" viewBox="0 0 992 992"><g><circle cx="144.3" cy="496" r="144.3" /><circle cx="496" cy="496" r="144.3" /><circle cx="847.7" cy="496" r="144.3" /></g></svg>
                  </div>
                )}
                {optionIndex === i && (
                  <div className="absolute z-100 right-10 top-8 bg-white dark:bg-neutral-800 shadow-xl w-50 p-2 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg cursor-pointer" onClick={() => handleToggleRead(notify.id, notify.isRead)}>
                      <svg fill="#06b6d4" className="w-4 h-4 shrink-0" viewBox="0 0 490 490"><polygon points="452.253,28.326 197.831,394.674 29.044,256.875 0,292.469 207.253,461.674 490,54.528" /></svg>
                      <span className="ml-3 text-sm font-medium text-neutral-700 dark:text-neutral-200">{notify.isRead ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}</span>
                    </div>
                    <div className="flex items-center p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg cursor-pointer" onClick={() => handleDelete(notify.id)}>
                      <svg className="w-4 h-4 shrink-0" fill="#ef4444" viewBox="0 0 460.775 460.775"><path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z" /></svg>
                      <span className="ml-3 text-sm font-medium text-neutral-700 dark:text-neutral-200">Xóa</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
