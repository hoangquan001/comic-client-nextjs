'use client';

import { useEffect, RefObject } from 'react';

export function useFadeIn(ref: RefObject<HTMLElement | null>, duration = 500) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.style.transition = `opacity ${duration}ms ease-in`;
          element.style.opacity = '1';
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 }
    );

    element.style.opacity = '0';
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, duration]);
}
