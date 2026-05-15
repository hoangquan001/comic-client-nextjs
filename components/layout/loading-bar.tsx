'use client';

import { useLoadingStore } from '@/lib/stores/use-loading-store';

export function LoadingBar() {
  const isLoading = useLoadingStore((s) => s.isLoading());

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-primary-100 overflow-hidden">
      <div className="h-full bg-primary-100 animate-pulse w-full" />
    </div>
  );
}
