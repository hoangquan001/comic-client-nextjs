'use client';

import { useAnnouncement } from '@/lib/hooks/use-comic-queries';
import type { Announcement } from '@/types';

interface AnnouncementBannerProps {
  initialAnnouncements?: Announcement[];
}

export function AnnouncementBanner({ initialAnnouncements }: AnnouncementBannerProps) {
  const { data: announcements } = useAnnouncement(initialAnnouncements);

  if (!announcements?.length) return null;

  return (
    <div className="space-y-2">
      {announcements.map((a, i) => (
        <div key={i} className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm">
          <span className="text-yellow-500 animate-pulse">🔔</span>
          <div dangerouslySetInnerHTML={{ __html: a.content }} />
        </div>
      ))}
    </div>
  );
}
