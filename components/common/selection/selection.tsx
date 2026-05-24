'use client';
import type { IOption } from '@/types';

type SelectionValue = IOption['value'];

interface SelectionProps {
  options?: IOption[];
  value?: SelectionValue;
  onChange?: (value: SelectionValue) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  itemClassName?: string;
  disabled?: boolean;
}

const EMPTY_VALUE = '__selection_empty_value__';

function encodeValue(value: SelectionValue | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (value === '') return EMPTY_VALUE;
  return String(value);
}

function decodeValue(value: string, options: IOption[]): SelectionValue {
  const option = options.find((item) => encodeValue(item.value) === value);
  return option?.value ?? value;
}

export default function Selection({
  options = [],
  value,
  onChange,
  placeholder = 'Chọn',
  ariaLabel,
  className,
  itemClassName,
  disabled,
}: SelectionProps) {
  return (
    <select
      value={encodeValue(value)}
      onChange={(event) => onChange?.(decodeValue(event.target.value, options))}
      className={className}
      disabled={disabled}
      aria-label={ariaLabel ?? placeholder}
    >
      {options.map((option, i) => (
        <option key={i} value={encodeValue(option.value)} className={itemClassName}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
