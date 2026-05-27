'use client';

import { useEffect } from 'react';
import { QueryProvider } from './query-provider';
import { useHistoryStore } from '@/lib/stores/use-history-store';
import { useSettingsStore } from '@/lib/stores/use-settings-store';
import { initializeAuth, useAuthStore } from '@/lib/stores/use-auth-store';

function StoreInitializer() {
  const initializeHistory = useHistoryStore((state) => state.initialize);
  const syncHistoryForUser = useHistoryStore((state) => state.syncForUser);
  const initializeSettings = useSettingsStore((state) => state.initialize);
  const userId = useAuthStore((state) => state.user?.id ?? null);
  console.log(userId)
  useEffect(() => {
    initializeAuth();
    initializeHistory();
    initializeSettings();

  }, [initializeHistory, initializeSettings]);

  useEffect(() => {
    void syncHistoryForUser(userId);
  }, [syncHistoryForUser, userId]);

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
