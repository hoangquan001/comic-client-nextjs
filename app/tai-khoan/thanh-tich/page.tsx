import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thành tích - MeTruyenMoi',
  description: 'Xem các huy hiệu và thành tựu đã đạt được',
};

export default function ThanhTichPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-light-text flex items-center gap-2">
          <svg className="w-6 h-6 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55.47.98.97 1.21C12.04 18.75 14 20 14 20s1.96-1.25 3.03-1.79c.5-.23.97-.66.97-1.21v-2.34" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
          </svg>
          Thành tích
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Xem các huy hiệu và thành tựu đã đạt được</p>
      </div>

      {/* Empty State */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
              <svg className="w-10 h-10 text-neutral-400 dark:text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55.47.98.97 1.21C12.04 18.75 14 20 14 20s1.96-1.25 3.03-1.79c.5-.23.97-.66.97-1.21v-2.34" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-light-text">Chưa có thành tích</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
            Hãy đọc truyện và tham gia hoạt động để mở khóa các thành tích thú vị!
          </p>
        </div>
      </div>
    </div>
  );
}
