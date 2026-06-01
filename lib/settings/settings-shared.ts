import { InputType } from '@/types';
import type { EnhancedSettingOption, SettingsRecord, SettingValue } from '@/types';
import { ENHANCED_SETTINGS } from '@/lib/constants/settings';
import { StoredSettingsPayload } from './type';

const SETTINGS_BY_ID = new Map(ENHANCED_SETTINGS.map((setting) => [setting.id, setting]));

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

export function getStoredValues(payload: unknown): Record<string, unknown> {
  if (!isRecord(payload)) return {};

  if (isRecord((payload as StoredSettingsPayload).values)) {
    return (payload as StoredSettingsPayload).values ?? {};
  }

  return payload;
}

export function getSettingDefinition(id: string): EnhancedSettingOption | undefined {
  return SETTINGS_BY_ID.get(id);
}

export function createDefaultSettings(): SettingsRecord {
  return ENHANCED_SETTINGS.reduce<SettingsRecord>((acc, setting) => {
    acc[setting.id] = setting.defaultValue;
    return acc;
  }, {});
}

function normalizeNumberValue(value: unknown, setting: EnhancedSettingOption): SettingValue {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) return setting.defaultValue;

  const min = setting.min ?? Number.NEGATIVE_INFINITY;
  const max = setting.max ?? Number.POSITIVE_INFINITY;
  return Math.min(Math.max(parsed, min), max);
}

function normalizeBooleanValue(value: unknown, setting: EnhancedSettingOption): SettingValue {
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return setting.defaultValue;
}

function normalizeStringValue(value: unknown, setting: EnhancedSettingOption): SettingValue {
  if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
    return setting.defaultValue;
  }

  const normalized = String(value);
  if (setting.inputType === InputType.Color && !/^#[0-9a-f]{6}$/i.test(normalized)) {
    return setting.defaultValue;
  }

  return normalized;
}

export function normalizeSettingValue(id: string, value: unknown): SettingValue | undefined {
  const setting = getSettingDefinition(id);
  if (!setting) return undefined;

  const defaultValue = setting.defaultValue;
  let normalized: SettingValue;

  if (typeof defaultValue === 'boolean') {
    normalized = normalizeBooleanValue(value, setting);
  } else if (typeof defaultValue === 'number') {
    normalized = normalizeNumberValue(value, setting);
  } else {
    normalized = normalizeStringValue(value, setting);
  }

  if (setting.inputType === InputType.Selection && setting.options?.length) {
    const hasOption = setting.options.some((option) => option.value === normalized);
    return hasOption ? normalized : setting.defaultValue;
  }

  return normalized;
}

export function normalizeSettingsPayload(payload: unknown): SettingsRecord {
  const settings = createDefaultSettings();
  const values = getStoredValues(payload);

  for (const [id, value] of Object.entries(values)) {
    const normalized = normalizeSettingValue(id, value);
    if (normalized !== undefined) {
      settings[id] = normalized;
    }
  }

  return settings;
}
