'use client';

import { useState, useEffect, useRef, useCallback, useImperativeHandle } from 'react';
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
  gridSize?: number;
  itemHeight?: number;
  renderItem: (item: T, index: number) => ReactNode;
  onChange?: (index: number) => void;
  trackById?: (item: T) => ItemId | null | undefined;
  loopRef?: React.Ref<LoopScrollHandle>;
}

export default function LoopScroll<T>({
  allItems,
  selectedID,
  preloadItemCount = 24,
  gridSize = 1,
  itemHeight = 32,
  renderItem,
  onChange,
  trackById,
  loopRef,
}: LoopScrollProps<T>) {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [offsetY, setOffsetY] = useState(0);
  const prevStartIdx = useRef(0);
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
    onChangeRef.current?.(idx);

    const halfBuffer = Math.round(count / 2 / gs);
    const startIdx = Math.max(idx - halfBuffer, 0);
    const endIdx = Math.min(startIdx + count, rows);

    if (Math.abs(startIdx - prevStartIdx.current) >= Math.round(halfBuffer / 2)) {
      prevStartIdx.current = startIdx;
      setVisibleItems(items.slice(startIdx * gs, endIdx * gs));
      setOffsetY(startIdx * ih);
    }
  }, []);

  // Only reset on actual data identity change, not callback ref changes
  const prevDataKey = useRef('');
  const dataKey = `${allItems.length}_${selectedID}_${gridSize}_${itemHeight}_${preloadItemCount}`;

  useEffect(() => {
    if (dataKey === prevDataKey.current) return;
    prevDataKey.current = dataKey;

    prevStartIdx.current = 0;
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
      className="w-full overflow-y-auto overflow-x-hidden relative min-h-0"
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
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
