import { create } from 'zustand';
import type { EnhancedSettingOption, SettingChangeEvent } from '@/types';
import type { SettingsRecord, SettingValue } from '@/types';
import { ENHANCED_SETTINGS } from '@/lib/constants/settings';
import {
  createDefaultSettings,
  getSettingDefinition,
  loadSettingsFromCookie,
  normalizeSettingValue,
  saveSettingsToCookie,
} from '@/lib/settings/settings-cookie-storage';

interface SettingsState {
  settings: SettingsRecord;
  initialized: boolean;
  initialize: () => void;
  getSettingValue: (id: string) => SettingValue | undefined;
  getSetting: (id: string) => EnhancedSettingOption | undefined;
  setSettingValue: (id: string, value: SettingValue) => void;
  resetToDefaults: (ids?: string[]) => void;
  getAllSettings: () => EnhancedSettingOption[];
}

function dispatchSettingChange(event: SettingChangeEvent) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<SettingChangeEvent>('setting-change', { detail: event }));
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: createDefaultSettings(),
  initialized: false,

  initialize: () => {
    if (get().initialized) return;
    const settings = loadSettingsFromCookie();
    set({ settings, initialized: true });
  },

  getSettingValue: (id) => get().settings[id],

  getSetting: (id) => getSettingDefinition(id),

  setSettingValue: (id, value) => {
    const normalizedValue = normalizeSettingValue(id, value);
    if (normalizedValue === undefined) return;

    const state = get();
    const currentSettings = state.initialized ? state.settings : loadSettingsFromCookie();
    const oldValue = currentSettings[id];
    const settings = { ...currentSettings, [id]: normalizedValue };
    saveSettingsToCookie(settings);
    set({ settings, initialized: true });
    dispatchSettingChange({ key: id, oldValue, newValue: normalizedValue });
  },

  resetToDefaults: (ids) => {
    const defaults = createDefaultSettings();
    const currentSettings = get().initialized ? get().settings : loadSettingsFromCookie();
    const settings = ids?.length
      ? ids.reduce<SettingsRecord>((acc, id) => {
          const definition = getSettingDefinition(id);
          if (definition) acc[id] = definition.defaultValue;
          return acc;
        }, { ...currentSettings })
      : defaults;

    saveSettingsToCookie(settings);
    set({ settings, initialized: true });
  },

  getAllSettings: () => {
    const { settings } = get();
    return ENHANCED_SETTINGS.map((s) => ({
      ...s,
      value: settings[s.id] ?? s.defaultValue,
    }));
  },
}));
