import Cookies from 'js-cookie';
import type { SettingsRecord, SettingValue } from '@/types';
import { ENHANCED_SETTINGS } from '@/lib/constants/settings';
import {
  createDefaultSettings,
  getStoredValues,
  normalizeSettingValue,
} from './settings-shared';

export {
  createDefaultSettings,
  getSettingDefinition,
  normalizeSettingValue,
} from './settings-shared';

const SETTINGS_COOKIE_NAME = 'app-settings';
const SETTINGS_SCHEMA_VERSION = 1;
const SETTINGS_COOKIE_OPTIONS = {
  expires: 365,
  path: '/',
  sameSite: 'lax' as const,
};

function isBrowser() {
  return typeof window !== 'undefined';
}

export function loadSettingsFromCookie(): SettingsRecord {
  const settings = createDefaultSettings();
  if (!isBrowser()) return settings;

  const raw = Cookies.get(SETTINGS_COOKIE_NAME);
  if (!raw) return settings;

  try {
    const values = getStoredValues(JSON.parse(raw));
    for (const [id, value] of Object.entries(values)) {
      const normalized = normalizeSettingValue(id, value);
      if (normalized !== undefined) {
        settings[id] = normalized;
      }
    }
  } catch {
    Cookies.remove(SETTINGS_COOKIE_NAME, { path: SETTINGS_COOKIE_OPTIONS.path });
  }

  return settings;
}

export function saveSettingsToCookie(settings: SettingsRecord) {
  if (!isBrowser()) return;

  const defaults = createDefaultSettings();
  const values = ENHANCED_SETTINGS.reduce<Record<string, SettingValue>>((acc, setting) => {
    const value = settings[setting.id] ?? setting.defaultValue;
    if (value !== defaults[setting.id]) {
      acc[setting.id] = value;
    }
    return acc;
  }, {});

  if (Object.keys(values).length === 0) {
    Cookies.remove(SETTINGS_COOKIE_NAME, { path: SETTINGS_COOKIE_OPTIONS.path });
    return;
  }

  Cookies.set(
    SETTINGS_COOKIE_NAME,
    JSON.stringify({ version: SETTINGS_SCHEMA_VERSION, values }),
    SETTINGS_COOKIE_OPTIONS,
  );
}
