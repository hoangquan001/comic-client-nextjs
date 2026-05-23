'use client';
import { useSettingsStore } from '../stores';

export function useTheme() {
    const settings = useSettingsStore((state) => state.settings);
    return {
        theme: settings.theme,
        setTheme: useSettingsStore((state) => state.setSettingValue).bind(null, 'theme'),
    }
}
