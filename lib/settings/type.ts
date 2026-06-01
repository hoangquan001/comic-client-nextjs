import type { SettingValue } from '@/types';

export type StoredSettingsPayload = {
  version?: number;
  values?: Record<string, SettingValue>;
};
