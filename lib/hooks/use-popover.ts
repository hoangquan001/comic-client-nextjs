'use client';

import { useState, useCallback, useRef } from 'react';
import { useClickOutside } from '@/lib/hooks/use-click-outside';

export function usePopover() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => setIsVisible((prev) => !prev), []);
  const show = useCallback(() => setIsVisible(true), []);
  const hide = useCallback(() => setIsVisible(false), []);

  useClickOutside(ref, hide);

  return { isVisible, ref, toggle, show, hide };
}
