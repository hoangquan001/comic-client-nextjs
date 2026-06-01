'use client';

import { useState, useEffect, useRef, useCallback, useImperativeHandle, useMemo } from 'react';
import type { ReactNode } from 'react';

export interface LoopScrollHandle {
  goToItem: (idx: number) => void;
}

type ItemId = string | number;
type ItemWithId = {
  id?: ItemId | null;
};

interface LoopScrollProps<T> {
  allItems: T[];
  selectedID?: ItemId | null;
  preloadItemCount?: number;
  itemHeight?: number;
  renderItem: (item: T, index: number) => ReactNode;
  onChange?: (index: number, gridSize: number) => void;
  trackById?: (item: T) => ItemId | null | undefined;
  loopRef?: React.Ref<LoopScrollHandle>;
  breakPoints?: LoopScrollBreakpoint[]; // ex: [{ name: 'md', gridSize: 4 }, { name: 'sm', gridSize: 2 }]
}

type BreakpointName = keyof typeof breakpointWidths;
type LoopScrollBreakpoint = { name: BreakpointName | string; gridSize: number };

export const breakpointWidths = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

const BASE_GRID_SIZE = 2;
const DEFAULT_BREAK_POINTS: LoopScrollBreakpoint[] = [
  { name: 'default', gridSize: 2 },
  { name: 'sm', gridSize: 3 },
  { name: 'xl', gridSize: 4 },
];

function getBreakpointWidth(name: string) {
  const configuredWidth = breakpointWidths[name as BreakpointName];
  if (configuredWidth) return configuredWidth;

  const numericWidth = Number(name);
  return Number.isFinite(numericWidth) ? numericWidth : null;
}

function getGridSizeForWidth(width: number, breakPoints: LoopScrollBreakpoint[]) {
  let gridSize = breakPoints[0].gridSize;
  for(let i = 1; i < breakPoints.length; i++) {
    const breakpoint = breakPoints[i];
    if (width >= getBreakpointWidth(breakpoint.name)!) {
      gridSize = breakpoint.gridSize;
      
    }
  }
  return gridSize;
}

export default function LoopScroll<T>({
  allItems,
  selectedID,
  preloadItemCount = 40,
  breakPoints = DEFAULT_BREAK_POINTS,
  itemHeight = 32,
  renderItem,
  onChange,
  trackById,
  loopRef,
}: LoopScrollProps<T>) {
  const gridClasses = useMemo(() => breakPoints?.map(({ name, gridSize }) => `${name === 'default' ? '' : `${name}:`}grid-cols-${gridSize}`).join(' '), [breakPoints]);
  const [visibleItems, setVisibleItems] = useState<T[]>(() => allItems.slice(0, preloadItemCount));
  const [offsetY, setOffsetY] = useState(0);
  const [gridSize, setGridSize] = useState(BASE_GRID_SIZE);
  const prevStartIdx = useRef(0);
  const prevEndIdx = useRef(0);
  const prevGridSize = useRef(gridSize);
  const containerRef = useRef<HTMLDivElement>(null);

  // Store latest callbacks/derived values in refs so computeVisible stays stable
  const allItemsRef = useRef(allItems);
  const onChangeRef = useRef(onChange);
  const gridSizeRef = useRef(gridSize);
  const itemHeightRef = useRef(itemHeight);
  const preloadItemCountRef = useRef(preloadItemCount);


  useEffect(() => {
    allItemsRef.current = allItems;
    onChangeRef.current = onChange;
    gridSizeRef.current = gridSize;
    itemHeightRef.current = itemHeight;
    preloadItemCountRef.current = preloadItemCount;
  }, [allItems, onChange, gridSize, itemHeight, preloadItemCount]);

  useEffect(() => {
    const updateGridSize = (width: number) => {
      setGridSize(getGridSizeForWidth(width, breakPoints));
    };

    updateGridSize(window.innerWidth);

    const observer = new ResizeObserver(([entry]) => {
      updateGridSize(entry.contentRect.width);
    });

    observer.observe(document.body);
    return () => observer.disconnect();
  }, [breakPoints]);

  const nRow = Math.ceil(allItems.length / gridSize);
  const totalHeight = nRow * itemHeight;

  useImperativeHandle(loopRef, () => ({
    goToItem(idx: number) {
      if (containerRef.current) {
        containerRef.current.scrollTop = Math.max(Math.round(idx / gridSize), 0) * itemHeight;
      }
    },
  }));

  const computeVisible = useCallback((scrollTop: number) => {
    const items = allItemsRef.current;
    const gs = gridSizeRef.current;
    const ih = itemHeightRef.current;
    const count = preloadItemCountRef.current;
    const rows = Math.ceil(items.length / gs);

    const idx = Math.floor(scrollTop / ih);
    onChangeRef.current?.(idx, gs);

    const containerHeight = containerRef.current?.clientHeight ?? 0;
    const viewportRows = Math.max(Math.ceil(containerHeight / ih), 1);
    const overscanRows = Math.max(Math.ceil(count / gs), 1);
    const startIdx = Math.max(idx - overscanRows, 0);
    const endIdx = Math.min(idx + viewportRows + overscanRows, rows);

    if (startIdx !== prevStartIdx.current || endIdx !== prevEndIdx.current) {
      prevStartIdx.current = startIdx;
      prevEndIdx.current = endIdx;
      setVisibleItems(items.slice(startIdx * gs, endIdx * gs));
      setOffsetY(startIdx * ih);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const previousGridSize = prevGridSize.current;

    if (!container || previousGridSize === gridSize) return;

    const topItemIndex = Math.floor(container.scrollTop / itemHeight) * previousGridSize;
    const nextScrollTop = Math.floor(topItemIndex / gridSize) * itemHeight;

    prevGridSize.current = gridSize;
    prevStartIdx.current = Number.NEGATIVE_INFINITY;
    prevEndIdx.current = Number.NEGATIVE_INFINITY;
    container.scrollTop = nextScrollTop;
    computeVisible(nextScrollTop);
  }, [computeVisible, gridSize, itemHeight]);

  // Only reset on actual data identity change, not callback ref changes
  const prevDataKey = useRef('');
  const dataKey = `${allItems.length}_${selectedID}_${itemHeight}_${preloadItemCount}`;

  useEffect(() => {
    if (dataKey === prevDataKey.current) return;
    prevDataKey.current = dataKey;

    prevStartIdx.current = Number.NEGATIVE_INFINITY;
    prevEndIdx.current = Number.NEGATIVE_INFINITY;
    setVisibleItems(allItems.slice(0, preloadItemCount));
    setOffsetY(0);

    if (containerRef.current) {
      if (selectedID != null) {
        const idx = allItems.findIndex((item) =>
          trackById ? trackById(item) === selectedID : (item as ItemWithId).id === selectedID,
        );
        const targetScroll = Math.max(Math.round(idx / gridSize), 0) * itemHeight;
        containerRef.current.scrollTop = targetScroll;
        computeVisible(targetScroll);
      } else {
        containerRef.current.scrollTop = 0;
        computeVisible(0);
      }
    }
  }, [dataKey, allItems, selectedID, gridSize, itemHeight, preloadItemCount, trackById, computeVisible]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      computeVisible(e.currentTarget.scrollTop);
    },
    [computeVisible],
  );

  return (
    <div
      ref={containerRef}
      className="w-full overflow-y-auto overflow-x-hidden relative min-h-0 scrollbar-style-1"
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          className={"grid " + gridClasses}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transform: `translateY(${offsetY}px)`,
          }}
        >
          {visibleItems.map((item, i) => (
            <div key={trackById?.(item) ?? i} style={{ height: itemHeight }}>
              {renderItem(item, i)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
