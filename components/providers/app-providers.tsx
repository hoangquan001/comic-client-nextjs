'use client';

import { useEffect } from 'react';
import { ThemeProvider } from './theme-provider';
import { QueryProvider } from './query-provider';
import { useHistoryStore } from '@/lib/stores/use-history-store';
import { useSettingsStore } from '@/lib/stores/use-settings-store';
import { initializeAuth } from '@/lib/stores/use-auth-store';

function StoreInitializer() {
  const initializeHistory = useHistoryStore((state) => state.initialize);
  const initializeSettings = useSettingsStore((state) => state.initialize);

  useEffect(() => {
    initializeAuth();
    initializeHistory();
    initializeSettings();

  }, [initializeHistory, initializeSettings]);

  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
        <StoreInitializer />
        {children}
    </QueryProvider>
  );
}
