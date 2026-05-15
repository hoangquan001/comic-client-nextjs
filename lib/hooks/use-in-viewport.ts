'use client';

import { useState, useEffect, RefObject } from 'react';

interface UseInViewportOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useInViewport(
  ref: RefObject<HTMLElement | null>,
  options: UseInViewportOptions = {}
) {
  const { threshold = 0, rootMargin = '0px', once = false } = options;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin, once]);

  return isVisible;
}
