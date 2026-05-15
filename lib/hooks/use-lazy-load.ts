'use client';

import { useEffect, RefObject } from 'react';

export function useLazyLoad(
  ref: RefObject<HTMLImageElement | null>,
  dataSrc?: string
) {
  useEffect(() => {
    const img = ref.current;
    if (!img || !dataSrc) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          img.src = dataSrc;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(img);
    return () => observer.disconnect();
  }, [ref, dataSrc]);
}
