'use client';

import { useState, useRef, useEffect } from 'react';
import { useClickOutside } from '@/lib/hooks/use-click-outside';
import type { IOption } from '@/types';

interface SelectionProps {
  options: IOption[];
  value?: number;
  onChange?: (value: any) => void;
}

export default function Selection({ options, value = 0, onChange }: SelectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [idx, setIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsVisible(false));

  useEffect(() => {
    const found = options?.findIndex((opt) => opt.value === value);
    setIdx(found >= 0 ? found : 0);
  }, [options, value]);

  function selectOption(val: any) {
    onChange?.(val);
    const found = options?.findIndex((opt) => opt.value === val);
    setIdx(found >= 0 ? found : 0);
    setIsVisible(false);
  }

  const currentLabel = options?.length > 0 ? options[idx]?.label : 'N/A';

  return (
    <div ref={containerRef} className="relative flex">
      <button
        type="button"
        className="relative grid grid-cols-[1fr_1rem] w-full min-w-fit px-2 rounded border border-gray-300 focus:outline-primary-100 font-medium dark:bg-neutral-800 focus:text-primary-100"
        onClick={() => setIsVisible(!isVisible)}
      >
        <span className="text-center truncate text-sm">{currentLabel}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 my-auto" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8 9l4-4l4 4m0 6l-4 4l-4-4" />
        </svg>
      </button>

      <ul className={`flex flex-col absolute border mt-1 w-full max-h-64 overflow-y-auto scrollbar-style-1 z-50 left-0 rounded-md shadow-md py-1 focus:outline-none top-full bg-white dark:bg-neutral-800 dark:border-neutral-500 ${isVisible ? '' : 'hidden'}`}>
        {options?.map((option, i) => (
          <li
            key={i}
            className={`cursor-pointer text-left mx-1 px-1 rounded-md ${
              option.value === value
                ? 'text-primary-100 border-primary-100 hover:bg-primary-100 hover:text-white'
                : 'hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-secondary-100 dark:hover:text-white'
            }`}
            onClick={() => selectOption(option.value)}
          >
            <span className="truncate">
              <label className="custom-radio flex items-center cursor-pointer">
                <span
                  className={`size-3 shrink-0 border rounded-full mr-2 transition-colors ${
                    option.value === value ? 'border-white bg-primary-100' : 'border-neutral-400'
                  }`}
                />
                {option.label}
              </label>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
