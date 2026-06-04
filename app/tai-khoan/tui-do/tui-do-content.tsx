'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useItemInventory, useEquippedItems, useItemTemplates, useItemAction } from '@/lib/hooks/use-account-queries';
import { LoadingState } from '../_components/account-ui';

type InventoryTab = 'owned' | 'equipped' | 'all';
type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
type ItemCategory = 'badge' | 'avatar_frame' | 'title' | 'consumable' | 'equipment' | 'collectible';

interface InventoryItem {
  id: number;
  name: string;
  description: string;
  image: string;
  rarity: ItemRarity;
  category: ItemCategory;
  quantity: number;
  isEquipped?: boolean;
}

const CATEGORY_INFO: Record<ItemCategory, { displayName: string }> = {
  badge: { displayName: 'Huy hiệu' },
  avatar_frame: { displayName: 'Khung avatar' },
  title: { displayName: 'Danh hiệu' },
  consumable: { displayName: 'Tiêu hao' },
  equipment: { displayName: 'Trang bị' },
  collectible: { displayName: 'Sưu tập' },
};

const RARITY_INFO: Record<ItemRarity, { displayName: string; text: string; border: string }> = {
  common: { displayName: 'Thường', text: 'text-neutral-600 dark:text-neutral-400', border: 'border-neutral-400' },
  uncommon: { displayName: 'Không thường', text: 'text-lime-600 dark:text-lime-400', border: 'border-lime-500' },
  rare: { displayName: 'Hiếm', text: 'text-sky-600 dark:text-sky-400', border: 'border-sky-500' },
  epic: { displayName: 'Sử thi', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500' },
  legendary: { displayName: 'Huyền thoại', text: 'text-red-600 dark:text-red-400', border: 'border-red-500' },
};

export default function TuiDoContent() {
  const [activeTab, setActiveTab] = useState<InventoryTab>('owned');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [rarity, setRarity] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);

  const { data: inventoryData, isLoading: loadingInventory } = useItemInventory(page, 20, category || undefined);
  const { data: equippedItems = [], isLoading: loadingEquipped } = useEquippedItems();
  const { data: templates = [], isLoading: loadingTemplates } = useItemTemplates();
  const itemAction = useItemAction();

  const isLoading = loadingInventory || loadingEquipped || loadingTemplates;

  const inventoryItems: InventoryItem[] = inventoryData?.items ?? [];
  const totalPages = inventoryData?.totalPages ?? 1;

  const filteredItems = useMemo(() => {
    const baseItems = activeTab === 'equipped'
      ? equippedItems
      : activeTab === 'all'
        ? templates
        : inventoryItems;

    return baseItems.filter((item: any) => {
      const matchesSearch = !searchTerm || `${item.name} ${item.description}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRarity = !rarity || item.rarity === rarity;
      return matchesSearch && matchesRarity;
    });
  }, [activeTab, category, rarity, searchTerm, inventoryItems, equippedItems, templates]);

  function handleUseItem(item: any) {
    itemAction.mutate(
      { action: 'use', data: { ItemTemplateID: item.itemTemplateId ?? item.id, Quantity: 1 } },
      {
        onSuccess: (res) => toast.success(res.message || 'Sử dụng vật phẩm thành công'),
        onError: () => toast.error('Không thể sử dụng vật phẩm'),
      },
    );
  }

  function handleEquipItem(item: any) {
    itemAction.mutate(
      { action: 'equip', data: { ItemTemplateID: item.itemTemplateId ?? item.id, SlotType: item.category } },
      {
        onSuccess: (res) => toast.success(res.message || 'Trang bị thành công'),
        onError: () => toast.error('Không thể trang bị vật phẩm'),
      },
    );
  }

  function handleUnequipItem(slotType: string) {
    itemAction.mutate(
      { action: 'unequip', data: { SlotType: slotType } },
      {
        onSuccess: (res) => toast.success(res.message || 'Gỡ trang bị thành công'),
        onError: () => toast.error('Không thể gỡ trang bị'),
      },
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-lg bg-white p-6 dark:bg-neutral-800">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Kho đồ</h2>
          <p className="text-neutral-600 dark:text-neutral-400">Quản lý vật phẩm của bạn</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-lg bg-white p-2 dark:bg-neutral-800">
        <TabButton active={activeTab === 'owned'} icon="🎒" label="Đang sở hữu" count={inventoryItems.length} onClick={() => { setActiveTab('owned'); setPage(1); }} />
        <TabButton active={activeTab === 'equipped'} icon="⚔️" label="Đang trang bị" count={equippedItems.length} onClick={() => setActiveTab('equipped')} />
        <TabButton active={activeTab === 'all'} icon="📋" label="Toàn bộ items" count={templates.length} onClick={() => setActiveTab('all')} />
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-lg bg-white p-6 dark:bg-neutral-800 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <FilterGroup label="Tìm kiếm">
          <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Tìm theo tên hoặc mô tả..." className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100" />
        </FilterGroup>
        <FilterGroup label="Loại vật phẩm">
          <select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }} className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100">
            <option value="">Tất cả</option>
            {Object.entries(CATEGORY_INFO).map(([value, info]) => <option key={value} value={value}>{info.displayName}</option>)}
          </select>
        </FilterGroup>
        <FilterGroup label="Độ hiếm">
          <select value={rarity} onChange={(event) => setRarity(event.target.value)} className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100">
            <option value="">Tất cả</option>
            {Object.entries(RARITY_INFO).map(([value, info]) => <option key={value} value={value}>{info.displayName}</option>)}
          </select>
        </FilterGroup>
        <FilterGroup label="Sắp xếp">
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100">
            <option value="">Mặc định</option>
            <option value="name">Tên</option>
            <option value="rarity">Độ hiếm</option>
            <option value="quantity">Số lượng</option>
            <option value="category">Loại</option>
          </select>
        </FilterGroup>
        {sortBy && (
          <FilterGroup label="Thứ tự">
            <select className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100">
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </select>
          </FilterGroup>
        )}
      </div>

      {isLoading && <LoadingState text="Đang tải kho đồ..." />}

      {!isLoading && filteredItems.length === 0 ? (
        <div className="space-y-4 py-12 text-center">
          <div className="text-6xl text-neutral-300 dark:text-neutral-600">📦</div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{activeTab === 'owned' ? 'Không có vật phẩm sở hữu' : activeTab === 'equipped' ? 'Không có vật phẩm đang trang bị' : 'Không có vật phẩm'}</h3>
          <p className="mx-auto max-w-md text-neutral-600 dark:text-neutral-400">
            {searchTerm || category || rarity ? 'Không tìm thấy vật phẩm phù hợp với bộ lọc.' : activeTab === 'owned' ? 'Kho đồ của bạn đang trống. Hãy hoàn thành nhiệm vụ để nhận vật phẩm!' : activeTab === 'equipped' ? 'Bạn chưa trang bị vật phẩm nào. Hãy trang bị vật phẩm từ kho đồ!' : 'Không có vật phẩm nào trong hệ thống.'}
          </p>
        </div>
      ) : !isLoading && (
        <>
          <div className="rounded-lg bg-white p-6 dark:bg-neutral-800">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredItems.map((item: any) => <ItemCard key={item.id} item={item} onUse={handleUseItem} onEquip={handleEquipItem} onUnequip={handleUnequipItem} />)}
            </div>
          </div>

          {activeTab === 'owned' && totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2">
              <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-700">
                Trước
              </button>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">{page} / {totalPages}</span>
              <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-700">
                Sau
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}

function TabButton({ active, icon, label, count, onClick }: { active: boolean; icon: string; label: string; count: number; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-transparent px-4 py-3 text-neutral-600 transition-all duration-200 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-100 sm:flex-none ${active ? 'scale-105 border-red-200 bg-primary-100 text-white shadow-lg shadow-primary-50 dark:border-red-700' : ''}`}>
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
      {count > 0 && <span className={`min-w-6 rounded-full px-2 py-1 text-center text-xs font-semibold transition-colors duration-200 ${active ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'}`}>{count}</span>}
    </button>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>
      {children}
    </div>
  );
}

function ItemCard({ item, onUse, onEquip, onUnequip }: { item: any; onUse: (item: any) => void; onEquip: (item: any) => void; onUnequip: (slotType: string) => void }) {
  const rarityInfo = RARITY_INFO[item.rarity as ItemRarity] ?? RARITY_INFO.common;
  return (
    <div className="relative min-h-[120px] cursor-pointer rounded-lg border border-neutral-200 bg-white p-3 transition-all duration-200 ease-in-out hover:scale-105 hover:border-neutral-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600">
      <div className="mb-2 flex justify-center">
        <div className="relative h-16 w-16 overflow-hidden rounded-lg">
          <Image unoptimized src={item.image || '/emoji/1.gif'} alt={item.name} fill className="object-cover" />
          <div className={`pointer-events-none absolute inset-0 rounded-lg border-2 ${rarityInfo.border}`} />
          {item.quantity > 1 && <div className="absolute -bottom-1 -right-1 min-w-5 rounded-full bg-neutral-900 px-1.5 py-0.5 text-center text-xs text-white">{item.quantity}</div>}
        </div>
      </div>
      <div className="min-w-0">
        <h3 className="mb-1 truncate text-base font-semibold text-neutral-900 dark:text-neutral-100">{item.name}</h3>
        <div className="mb-1">
          <span className={`text-xs font-medium ${rarityInfo.text}`}>{rarityInfo.displayName}</span>
        </div>
        <p className="line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>
      </div>
      <div className="mt-2 flex gap-1">
        {!item.isEquipped && item.category !== 'consumable' && (
          <button type="button" onClick={(e) => { e.stopPropagation(); onEquip(item); }} className="rounded bg-sky-100 px-2 py-1 text-xs font-medium text-sky-700 hover:bg-sky-200 dark:bg-sky-900 dark:text-sky-300">
            Trang bị
          </button>
        )}
        {item.isEquipped && (
          <button type="button" onClick={(e) => { e.stopPropagation(); onUnequip(item.slotType ?? item.category); }} className="rounded bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-300">
            Gỡ
          </button>
        )}
        {item.category === 'consumable' && (
          <button type="button" onClick={(e) => { e.stopPropagation(); onUse(item); }} className="rounded bg-lime-100 px-2 py-1 text-xs font-medium text-lime-700 hover:bg-lime-200 dark:bg-lime-900 dark:text-lime-300">
            Sử dụng
          </button>
        )}
      </div>
    </div>
  );
}
