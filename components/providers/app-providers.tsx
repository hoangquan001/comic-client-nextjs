'use client';

import { useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryProvider } from './query-provider';
import { useHistoryStore } from '@/lib/stores/use-history-store';
import { useSettingsStore } from '@/lib/stores/use-settings-store';
import { initializeAuth, useAuthStore } from '@/lib/stores/use-auth-store';
import { config } from '@/lib/config';
import type { SettingsRecord } from '@/types';

function StoreInitializer({ initialSettings }: { initialSettings?: SettingsRecord }) {
  const initializeHistory = useHistoryStore((state) => state.initialize);
  const syncHistoryForUser = useHistoryStore((state) => state.syncForUser);
  const initializeSettings = useSettingsStore((state) => state.initialize);
  const userId = useAuthStore((state) => state.user?.id ?? null);
  useEffect(() => {
    initializeAuth();
    initializeHistory();
    initializeSettings(initialSettings);

  }, [initializeHistory, initializeSettings, initialSettings]);

  useEffect(() => {
    void syncHistoryForUser(userId);
  }, [syncHistoryForUser, userId]);

  return null;
}

export function AppProviders({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings?: SettingsRecord;
}) {

  return (
    <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID!}>
      <QueryProvider>
          <StoreInitializer initialSettings={initialSettings} />
          {children}
      </QueryProvider>
    </GoogleOAuthProvider>
  );
}
