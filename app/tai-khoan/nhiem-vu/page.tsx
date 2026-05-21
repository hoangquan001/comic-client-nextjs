import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nhiệm vụ hàng ngày - MeTruyenMoi',
  description: 'Hoàn thành nhiệm vụ để nhận kinh nghiệm',
};

export default function NhiemVuPage() {

  const dailyQuests = [
    { id: 1, title: 'Đọc 1 chương truyện', reward: '+10 XP', progress: 0, target: 1, icon: 'book' },
    { id: 2, title: 'Đọc 5 chương truyện', reward: '+30 XP', progress: 0, target: 5, icon: 'books' },
    { id: 3, title: 'Theo dõi 1 truyện', reward: '+5 XP', progress: 0, target: 1, icon: 'heart' },
    { id: 4, title: 'Bình luận 1 lần', reward: '+10 XP', progress: 0, target: 1, icon: 'chat' },
    { id: 5, title: 'Đánh giá 1 truyện', reward: '+10 XP', progress: 0, target: 1, icon: 'star' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-light-text flex items-center gap-2">
          <svg className="w-6 h-6 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Nhiệm vụ hàng ngày
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Hoàn thành nhiệm vụ để nhận kinh nghiệm</p>
      </div>

      {/* Quest List */}
      <div className="space-y-3">
        {dailyQuests.map((quest) => (
          <div key={quest.id} className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100/10 flex items-center justify-center shrink-0">
              {quest.icon === 'book' && (
                <svg className="w-6 h-6 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              )}
              {quest.icon === 'books' && (
                <svg className="w-6 h-6 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              )}
              {quest.icon === 'heart' && (
                <svg className="w-6 h-6 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
              {quest.icon === 'chat' && (
                <svg className="w-6 h-6 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              )}
              {quest.icon === 'star' && (
                <svg className="w-6 h-6 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-neutral-900 dark:text-light-text">{quest.title}</h3>
                <span className="text-xs font-bold text-primary-100">{quest.reward}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-100 rounded-full transition-all" style={{ width: `${Math.min((quest.progress / quest.target) * 100, 100)}%` }} />
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">{quest.progress}/{quest.target}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
