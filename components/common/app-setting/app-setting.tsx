'use client';

import { useState, useMemo } from 'react';
import { InputType, SettingCategory } from '@/types';
import type { EnhancedSettingOption, SettingGroup } from '@/types';
import { ENHANCED_SETTINGS } from '@/lib/constants/settings';
import { useSettingsStore } from '@/lib/stores/use-settings-store';

interface AppSettingProps {
  isVisible: boolean;
  onClose: () => void;
  defaultCategory?: SettingCategory;
}

const TABS = [
  { id: 'appearance', name: 'Giao diện', icon: 'palette', category: SettingCategory.APPEARANCE },
  { id: 'reading', name: 'Đọc truyện', icon: 'book-open', category: SettingCategory.READING },
  { id: 'behavior', name: 'Hành vi', icon: 'behavior', category: SettingCategory.BEHAVIOR },
];

const GROUP_DESCRIPTIONS: Record<number, string> = {
  [SettingCategory.APPEARANCE]: 'Tùy chỉnh giao diện, màu sắc và kiểu hiển thị',
  [SettingCategory.READING]: 'Cài đặt chế độ đọc truyện và hiển thị chapter',
  [SettingCategory.BEHAVIOR]: 'Hành vi, thông báo và các tùy chọn khác',
};

export default function AppSetting({ isVisible, onClose, defaultCategory = SettingCategory.APPEARANCE }: AppSettingProps) {
  const [selectedTab, setSelectedTab] = useState<SettingCategory>(defaultCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const { getSettingValue, setSettingValue } = useSettingsStore();

  const settingGroups = useMemo<SettingGroup[]>(() => {
    const categories: SettingCategory[] = [SettingCategory.APPEARANCE, SettingCategory.READING, SettingCategory.BEHAVIOR];
    return categories.map((cat) => ({
      category: cat,
      label: TABS.find((t) => t.category === cat)?.name ?? '',
      settings: ENHANCED_SETTINGS.filter((s) => s.category === cat).sort((a, b) => a.order - b.order),
    }));
  }, []);

  const filteredGroups = useMemo(() => {
    if (!searchTerm.trim()) return settingGroups;
    const lower = searchTerm.toLowerCase();
    return settingGroups
      .map((group) => ({
        ...group,
        settings: group.settings.filter(
          (s) => s.name.toLowerCase().includes(lower) || s.description?.toLowerCase().includes(lower)
        ),
      }))
      .filter((group) => group.settings.length > 0);
  }, [settingGroups, searchTerm]);

  const currentGroup = filteredGroups.find((g) => g.category === selectedTab);

  if (!isVisible) return null;

  function renderControl(setting: EnhancedSettingOption) {
    const value = getSettingValue(setting.id);
    switch (setting.inputType) {
      case InputType.Toggle:
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={!!value} onChange={(e) => setSettingValue(setting.id, e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-100 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:inset-s-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-primary-100" />
          </label>
        );
      case InputType.Range: {
        const min = setting.min ?? 0;
        const max = setting.max ?? 100;
        const numVal = Number(value) || min;
        return (
          <div className="flex items-center gap-3 w-full">
            <span className="text-xs text-neutral-500">{min}</span>
            <input type="range" min={min} max={max} step={setting.step ?? 1} value={numVal} onChange={(e) => setSettingValue(setting.id, Number(e.target.value))} className="flex-1 h-2 bg-gray-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-primary-100" />
            <span className="text-xs text-neutral-500">{max}</span>
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 min-w-12 text-right">{numVal}{setting.unit || ''}</span>
          </div>
        );
      }
      case InputType.Selection:
        return (
          <select value={String(value ?? '')} onChange={(e) => setSettingValue(setting.id, e.target.value)} className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-light-text text-sm focus:outline-none focus:ring-2 focus:ring-primary-100">
            {setting.options?.map((opt) => (
              <option key={String(opt.value)} value={String(opt.value)}>{opt.label}</option>
            ))}
          </select>
        );
      case InputType.Color:
        return (
          <div className="flex items-center gap-3">
            <input type="color" value={String(value ?? '#000000')} onChange={(e) => setSettingValue(setting.id, e.target.value)} className="w-12 h-12 rounded-xl border-2 border-neutral-200 dark:border-neutral-600 cursor-pointer hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2" />
            <span className="text-sm font-mono text-neutral-600 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-700 px-3 py-2 rounded-lg">{String(value)}</span>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex flex-col bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700 overflow-hidden mx-4 sm:w-[90vw] sm:h-[85vh] md:w-[80vw] lg:w-[75vw] xl:w-[70vw]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 p-2 rounded-xl bg-primary-100 text-white shadow-md">
              <svg className="w-full h-full" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" /></svg>
            </div>
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-light-text leading-tight">Cài đặt</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tùy chỉnh trải nghiệm của bạn</p>
            </div>
          </div>
          <div className="hidden sm:block flex-1 max-w-md mx-8">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <input type="text" placeholder="Tìm kiếm cài đặt..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 text-gray-900 dark:text-light-text placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent hover:border-gray-300 dark:hover:border-neutral-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
          <button className="p-3 rounded-xl bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2 active:scale-95" onClick={onClose}>
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        {/* Content */}
        <div className="flex flex-col lg:flex-row h-full min-h-0">
          {/* Tabs */}
          <div className="flex flex-row lg:flex-col w-full lg:w-64 border-b lg:border-b-0 border-r-0 lg:border-r border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900/30 p-3 gap-2">
            {TABS.map((tab) => (
              <button key={tab.id} className={`flex items-center gap-3 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2 ${selectedTab === tab.category ? 'bg-primary-100 text-white shadow-md hover:bg-primary-200' : 'text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-neutral-700'}`} onClick={() => setSelectedTab(tab.category)}>
                <div className="w-6 h-6 shrink-0">
                  {tab.icon === 'palette' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>}
                  {tab.icon === 'book-open' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>}
                  {tab.icon === 'behavior' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="4" r="2" /><path d="M10.5 8.5L8 12l2 7h4l2-7-2.5-3.5" /><path d="M7 12h10" /></svg>}
                </div>
                <span className="font-medium text-sm">{tab.name}</span>
              </button>
            ))}
          </div>
          {/* Panel */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4">
            {currentGroup ? (
              <>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-neutral-700">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-light-text">{currentGroup.label}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 hidden md:block">
                      {GROUP_DESCRIPTIONS[currentGroup.category]}
                    </p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2 hover:text-primary-100" onClick={() => currentGroup.settings.forEach((s) => setSettingValue(s.id, s.defaultValue))}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
                    Khôi phục
                  </button>
                </div>
                <div className="space-y-2">
                  {currentGroup.settings.map((setting) => (
                    <div key={setting.id} className="flex items-start justify-between gap-6 px-4 py-2 rounded-2xl bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700  hover:shadow-md hover:border-gray-300 dark:hover:border-neutral-600">
                      <div className="flex-1">
                        <label className="block text-lg font-semibold text-gray-900 dark:text-light-text mb-2 cursor-pointer">{setting.name}</label>
                        {setting.description && <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{setting.description}</p>}
                      </div>
                      <div className="shrink-0 min-w-[200px]">{renderControl(setting)}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-500">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-light-text mb-2">Không tìm thấy cài đặt</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="fixed inset-0 bg-black/50 -z-50" onClick={onClose} />
    </div>
  );
}
