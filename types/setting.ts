import { InputType } from './enums';

export interface IOption {
  label: string;
  value: string | number | boolean;
  selected?: boolean;
  icon?: string;
}

export interface SettingOption {
  inputType?: InputType;
  name?: string;
  description?: string;
  value?: string | number | boolean;
  group?: number;
  options?: IOption[];
  min?: number;
  max?: number;
  step?: number;
}

export enum SettingCategory {
  APPEARANCE = 0,
  READING = 1,
  BEHAVIOR = 2,
}

export interface EnhancedSettingOption {
  id: string;
  inputType: InputType;
  name: string;
  description?: string;
  value: string | number | boolean;
  defaultValue: string | number | boolean;
  category: SettingCategory;
  order: number;
  icon?: string;
  options?: IOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  tooltip?: string;
  preview?: boolean;
}

export type SettingValue = EnhancedSettingOption['defaultValue'];
export type SettingsRecord = Record<string, SettingValue>;

export interface SettingChangeEvent {
  key: string;
  oldValue: SettingValue | undefined;
  newValue: SettingValue | undefined;
}

export interface SettingGroup {
  category: SettingCategory;
  label: string;
  settings: EnhancedSettingOption[];
}
