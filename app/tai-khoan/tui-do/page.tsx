import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Túi đồ - MeTruyenMoi',
  description: 'Quản lý vật phẩm và huy hiệu đã nhận',
};

export default function TuiDoPage() {
  const items = [
    { id: 1, name: 'Huy hiệu Đọc giả', description: 'Đọc 100 chương truyện', image: '/emoji/1.gif', rarity: 'common' },
    { id: 2, name: 'Huy hiệu Bình luận', description: 'Bình luận 50 lần', image: '/emoji/2.gif', rarity: 'rare' },
    { id: 3, name: 'Huy hiệu Theo dõi', description: 'Theo dõi 20 truyện', image: '/emoji/3.gif', rarity: 'epic' },
  ];

  const rarityColors: Record<string, string> = {
    common: 'border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800',
    rare: 'border-sky-300 dark:border-sky-600 bg-sky-50 dark:bg-sky-900/20',
    epic: 'border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20',
    legendary: 'border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20',
  };

  const rarityLabels: Record<string, string> = {
    common: 'text-neutral-500',
    rare: 'text-sky-500',
    epic: 'text-purple-500',
    legendary: 'text-amber-500',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-light-text flex items-center gap-2">
          <svg className="w-6 h-6 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Túi đồ
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Quản lý vật phẩm và huy hiệu đã nhận</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 text-center">
          <p className="text-2xl font-bold text-primary-100">{items.length}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Vật phẩm</p>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 text-center">
          <p className="text-2xl font-bold text-sky-500">0</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Đang dùng</p>
        </div>
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 text-center">
          <p className="text-2xl font-bold text-amber-500">0</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Huyền thoại</p>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.id} className={`rounded-xl border-2 p-4 ${rarityColors[item.rarity]}`}>
            <div className="flex justify-center mb-3">
              <Image src={item.image} alt={item.name} className="w-16 h-16 rounded-lg" width={64} height={64} />
            </div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-light-text text-center">{item.name}</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-1">{item.description}</p>
            <div className="mt-2 text-center">
              <span className={`text-[0.65rem] font-bold uppercase ${rarityLabels[item.rarity]}`}>
                {item.rarity === 'common' ? 'Thường' : item.rarity === 'rare' ? 'Hiếm' : item.rarity === 'epic' ? 'Sử thi' : 'Huyền thoại'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
            <svg className="w-8 h-8 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="font-bold text-neutral-900 dark:text-light-text">Chưa có vật phẩm</h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Hoàn thành nhiệm vụ để nhận vật phẩm</p>
        </div>
      )}
    </div>
  );
}
