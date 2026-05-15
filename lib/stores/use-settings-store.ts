import { create } from 'zustand';
import type { EnhancedSettingOption, SettingChangeEvent } from '@/types';
import { ENHANCED_SETTINGS } from '@/lib/constants/settings';

type SettingValue = string | number | boolean;

interface SettingsState {
  settings: Map<string, SettingValue>;
  initialized: boolean;
  initialize: () => void;
  getSettingValue: (id: string) => SettingValue | undefined;
  getSetting: (id: string) => EnhancedSettingOption | undefined;
  setSettingValue: (id: string, value: SettingValue) => void;
  resetToDefaults: () => void;
  getAllSettings: () => EnhancedSettingOption[];
}

const STORAGE_KEY = 'enhanced-settings';

function loadSettings(): Map<string, SettingValue> {
  const map = new Map<string, SettingValue>();
  if (typeof window === 'undefined') return map;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Record<string, SettingValue>;
      for (const [key, value] of Object.entries(parsed)) {
        map.set(key, value);
      }
    }
  } catch {}

  for (const setting of ENHANCED_SETTINGS) {
    if (!map.has(setting.id)) {
      map.set(setting.id, setting.defaultValue);
    }
  }

  return map;
}

function saveSettings(settings: Map<string, SettingValue>) {
  if (typeof window === 'undefined') return;
  const obj: Record<string, SettingValue> = {};
  for (const [key, value] of settings) {
    obj[key] = value;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: new Map(),
  initialized: false,

  initialize: () => {
    if (get().initialized) return;
    const settings = loadSettings();
    set({ settings, initialized: true });
  },

  getSettingValue: (id) => get().settings.get(id),

  getSetting: (id) => ENHANCED_SETTINGS.find((s) => s.id === id),

  setSettingValue: (id, value) => {
    const settings = new Map(get().settings);
    settings.set(id, value);
    saveSettings(settings);
    set({ settings });
  },

  resetToDefaults: () => {
    const settings = new Map<string, SettingValue>();
    for (const setting of ENHANCED_SETTINGS) {
      settings.set(setting.id, setting.defaultValue);
    }
    saveSettings(settings);
    set({ settings });
  },

  getAllSettings: () => {
    const { settings } = get();
    return ENHANCED_SETTINGS.map((s) => ({
      ...s,
      value: settings.get(s.id) ?? s.defaultValue,
    }));
  },
}));
