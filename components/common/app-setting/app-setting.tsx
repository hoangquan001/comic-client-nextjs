'use client';

import { useMemo, useState } from 'react';
import {
  BookOpen,
  MousePointer2,
  Palette,
  RotateCcw,
  Search,
  Settings,
  X,
} from 'lucide-react';
import { InputType, SettingCategory } from '@/types';
import type { EnhancedSettingOption, SettingGroup, SettingValue } from '@/types';
import { ENHANCED_SETTINGS } from '@/lib/constants/settings';
import { useSettingsStore } from '@/lib/stores/use-settings-store';
import Selection from '@/components/common/selection/selection';

interface AppSettingProps {
  isVisible: boolean;
  onClose: () => void;
  defaultCategory?: SettingCategory;
}

const TABS = [
  { id: 'appearance', name: 'Giao diện', category: SettingCategory.APPEARANCE, Icon: Palette },
  { id: 'reading', name: 'Đọc truyện', category: SettingCategory.READING, Icon: BookOpen },
  { id: 'behavior', name: 'Hành vi', category: SettingCategory.BEHAVIOR, Icon: MousePointer2 },
];

const GROUP_DESCRIPTIONS: Record<SettingCategory, string> = {
  [SettingCategory.APPEARANCE]: 'Tùy chỉnh giao diện, màu sắc và kiểu hiển thị',
  [SettingCategory.READING]: 'Cài đặt chế độ đọc truyện và hiển thị chapter',
  [SettingCategory.BEHAVIOR]: 'Hành vi, thông báo và các tùy chọn khác',
};

function buildSettingGroups(): SettingGroup[] {
  return TABS.map((tab) => ({
    category: tab.category,
    label: tab.name,
    settings: ENHANCED_SETTINGS
      .filter((setting) => setting.category === tab.category && !setting.hidden)
      .sort((a, b) => a.order - b.order),
  }));
}

function matchesSearch(setting: EnhancedSettingOption, term: string) {
  const normalizedTerm = term.trim().toLowerCase();
  if (!normalizedTerm) return true;

  const optionLabels = setting.options?.map((option) => option.label).join(' ') ?? '';
  return [setting.name, setting.description, optionLabels]
    .filter(Boolean)
    .some((value) => value?.toLowerCase().includes(normalizedTerm));
}

function getSettingValue(
  settings: Record<string, SettingValue>,
  setting: EnhancedSettingOption,
): SettingValue {
  return settings[setting.id] ?? setting.defaultValue;
}

export default function AppSetting({
  isVisible,
  onClose,
  defaultCategory = SettingCategory.APPEARANCE,
}: AppSettingProps) {
  const [selectedTab, setSelectedTab] = useState<SettingCategory>(defaultCategory);
  const [searchTerm, setSearchTerm] = useState('');

  const settings = useSettingsStore((state) => state.settings);
  const setSettingValue = useSettingsStore((state) => state.setSettingValue);
  const resetToDefaults = useSettingsStore((state) => state.resetToDefaults);
  const settingGroups = useMemo(() => buildSettingGroups(), []);

  const filteredGroups = useMemo(
    () =>
      settingGroups
        .map((group) => ({
          ...group,
          settings: group.settings.filter((setting) => matchesSearch(setting, searchTerm)),
        }))
        .filter((group) => group.settings.length > 0),
    [settingGroups, searchTerm],
  );

  const currentGroup = filteredGroups.find((group) => group.category === selectedTab);

  if (!isVisible) return null;

  const resetCurrentGroup = () => {
    const selectedGroup = settingGroups.find((group) => group.category === selectedTab);
    if (!selectedGroup) return;
    resetToDefaults(selectedGroup.settings.map((setting) => setting.id));
  };

  const renderControl = (setting: EnhancedSettingOption) => {
    const value = getSettingValue(settings, setting);
    const disabled = !!setting.disabled;

    switch (setting.inputType) {
      case InputType.Toggle:
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={!!value}
              disabled={disabled}
              onChange={(event) => setSettingValue(setting.id, event.target.checked)}
              className="sr-only peer"
            />
            <span className="h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-primary-100 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 dark:bg-neutral-700" />
            <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full border border-gray-300 bg-white transition-transform peer-checked:translate-x-full peer-checked:border-white peer-disabled:opacity-70 dark:border-neutral-600" />
          </label>
        );

      case InputType.Range: {
        const min = setting.min ?? 0;
        const max = setting.max ?? 100;
        const numericValue = Number(value) || min;

        return (
          <div className="grid w-full min-w-0 grid-cols-[auto_minmax(120px,1fr)_auto_auto] items-center gap-3">
            <span className="text-xs text-neutral-500">{min}</span>
            <input
              type="range"
              min={min}
              max={max}
              step={setting.step ?? 1}
              value={numericValue}
              disabled={disabled}
              onChange={(event) => setSettingValue(setting.id, Number(event.target.value))}
              className="h-2 min-w-0 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-primary-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-700"
            />
            <span className="text-xs text-neutral-500">{max}</span>
            <span className="min-w-12 text-right text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {numericValue}
              {setting.unit || ''}
            </span>
          </div>
        );
      }

      case InputType.Selection:
        return (
          <Selection
            ariaLabel={setting.name}
            value={value}
            options={setting.options}
            disabled={disabled}
            onChange={(nextValue) => setSettingValue(setting.id, nextValue)}
            className="min-h-10 w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-700 dark:text-light-text"
          />
        );

      case InputType.Color:
        return (
          <div className="flex min-w-0 items-center gap-3">
            <input
              type="color"
              value={String(value ?? '#000000')}
              disabled={disabled}
              onChange={(event) => setSettingValue(setting.id, event.target.value)}
              className="h-11 w-12 shrink-0 cursor-pointer rounded-lg border-2 border-neutral-200 bg-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-600"
            />
            <span className="min-w-0 truncate rounded-lg bg-gray-100 px-3 py-2 font-mono text-sm text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
              {String(value)}
            </span>
          </div>
        );

      case InputType.Text:
      case InputType.Number:
        return (
          <input
            type={setting.inputType === InputType.Number ? 'number' : 'text'}
            value={String(value ?? '')}
            min={setting.min}
            max={setting.max}
            step={setting.step}
            disabled={disabled}
            onChange={(event) => {
              const nextValue =
                setting.inputType === InputType.Number ? Number(event.target.value) : event.target.value;
              setSettingValue(setting.id, nextValue);
            }}
            className="min-h-10 w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-700 dark:text-light-text"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-3 py-4">
      <button
        type="button"
        aria-label="Đóng cài đặt"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <section className="relative z-10 flex h-full max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-800 sm:h-[85vh]">
        <header className="flex flex-col gap-4 border-b border-gray-200 bg-gray-50 p-4 dark:border-neutral-700 dark:bg-neutral-900/50 md:flex-row md:items-center md:justify-between md:p-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-white shadow-md">
              <Settings className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-2xl font-bold leading-tight text-gray-900 dark:text-light-text">
                Cài đặt
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Tùy chỉnh trải nghiệm của bạn
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative min-w-0 flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Tìm kiếm cài đặt..."
                className="min-h-11 w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-neutral-600 dark:bg-neutral-700 dark:text-light-text dark:placeholder-gray-400"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <button
              type="button"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:bg-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-600"
              onClick={onClose}
              aria-label="Đóng"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <aside className="lg:w-64 flex w-full h-full lg:h-auto gap-2 border-b border-gray-200 bg-gray-50 p-3 dark:border-neutral-700 dark:bg-neutral-900/30 lg:flex-col lg:border-b-0 lg:border-r">
            {TABS.map(({ id, name, category, Icon }) => (
              <button
                key={id}
                type="button"
                className={`flex min-w-fit items-center gap-3 rounded-xl p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-primary-100 ${
                  selectedTab === category
                    ? 'bg-primary-100 text-white shadow-md'
                    : 'text-gray-700 hover:bg-white dark:text-gray-200 dark:hover:bg-neutral-700'
                }`}
                onClick={() => setSelectedTab(category)}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">{name}</span>
              </button>
            ))}
          </aside>

          <main className="min-h-0 flex-1 overflow-y-auto p-3 md:p-4">
            {currentGroup ? (
              <>
                <div className="mb-4 flex flex-col gap-3 border-b border-gray-200 pb-4 dark:border-neutral-700 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="truncate text-2xl font-bold text-gray-900 dark:text-light-text">
                      {currentGroup.label}
                    </h3>
                    <p className="mt-1 hidden text-sm text-gray-500 dark:text-gray-400 md:block">
                      {GROUP_DESCRIPTIONS[currentGroup.category]}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 hover:text-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:bg-neutral-700 dark:text-gray-200 dark:hover:bg-neutral-600"
                    onClick={resetCurrentGroup}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Khôi phục nhóm này
                  </button>
                </div>

                <div className="space-y-2">
                  {currentGroup.settings.map((setting) => (
                    <div
                      key={setting.id}
                      className="grid gap-4 rounded-xl border border-gray-200 bg-white px-4 py-3 transition hover:border-gray-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600 md:grid-cols-[minmax(0,1fr)_minmax(220px,320px)] md:items-center"
                    >
                      <div className="min-w-0">
                        <label className="block text-base font-semibold text-gray-900 dark:text-light-text">
                          {setting.name}
                        </label>
                        {setting.description && (
                          <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                            {setting.description}
                          </p>
                        )}
                        {setting.tooltip && (
                          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                            {setting.tooltip}
                          </p>
                        )}
                      </div>
                      <div className="min-w-0">{renderControl(setting)}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Search className="mb-4 h-16 w-16 text-gray-400 dark:text-gray-500" />
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-light-text">
                  Không tìm thấy cài đặt
                </h3>
                <p className="max-w-md text-gray-500 dark:text-gray-400">
                  Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác.
                </p>
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
}
