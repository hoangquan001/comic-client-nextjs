'use client';

import { useSettingsStore } from '@/lib/stores/use-settings-store';
import { useEffect } from 'react';

function resolveTheme(theme: unknown) {
  if (theme === 'dark' || theme === 'light') return theme;

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSettingsStore((state) => state.settings.theme);

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      const resolvedTheme = resolveTheme(theme);
      root.classList.toggle('dark', resolvedTheme === 'dark');
      root.style.colorScheme = resolvedTheme;
    };

    applyTheme();

    if (theme !== 'auto') return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', applyTheme);
    return () => media.removeEventListener('change', applyTheme);
  }, [theme]);

  return (
    <>
      {children}
    </>
  );
}
