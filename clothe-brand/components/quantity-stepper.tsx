"use client";

import { Minus, Plus } from "lucide-react";

export default function QuantityStepper({ value, onChange, disabled = false }: { value: number; onChange: (value: number) => void; disabled?: boolean }) {
  return (
    <div className="flex items-center rounded-full border border-brand-dark/15 bg-white p-1">
      <button onClick={() => onChange(Math.max(1, value - 1))} disabled={value <= 1 || disabled} className="rounded-full p-2.5 text-stone-500 transition-colors hover:bg-stone-50 hover:text-brand-dark disabled:opacity-40" aria-label="Decrease quantity">
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 text-center text-xs font-semibold text-brand-dark">{value}</span>
      <button onClick={() => onChange(value + 1)} disabled={disabled} className="rounded-full p-2.5 text-stone-500 transition-colors hover:bg-stone-50 hover:text-brand-dark disabled:opacity-40" aria-label="Increase quantity">
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
