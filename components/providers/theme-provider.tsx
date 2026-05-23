'use client';

import { SettingChangeEvent } from '@/types';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { useCallback, useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {

  return (
      {children}
  );
}
