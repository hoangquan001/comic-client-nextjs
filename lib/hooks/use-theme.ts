'use client';
import { useSettingsStore } from '../stores';

function getResolvedTheme(theme: unknown) {
    if (theme === 'dark' || theme === 'light') return theme;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

export function useTheme() {
    const settings = useSettingsStore((state) => state.settings);
    const theme = settings.theme;
    return {
        theme,
        resolvedTheme: getResolvedTheme(theme),
        setTheme: useSettingsStore((state) => state.setSettingValue).bind(null, 'theme'),
    }
}
