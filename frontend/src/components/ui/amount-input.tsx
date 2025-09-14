'use client';

import { NumericFormat } from 'react-number-format';
import { Input } from '@/components/ui/input';

interface AmountInputProps {
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
}

export function AmountInput({ value, onChange, className }: AmountInputProps) {
  return (
    <NumericFormat
      value={value}
      thousandSeparator=","
      prefix="$"
      decimalScale={2}
      fixedDecimalScale
      // wrap the shadcn/ui input component with the react-number formatting
      customInput={Input}
      className={className}
      onValueChange={(values) => {
        onChange?.(values.floatValue ?? 0);
      }}
    />
  );
}
