import * as React from "react";

import { cn } from "@/lib/utils";

type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> & {
  onValueChange?: (value: string) => void;
};

export function Select({ className, onValueChange, children, ...props }: SelectProps) {
  return (
    <select
      className={cn("rounded-full border border-brand-dark/15 bg-white px-5 py-2.5 text-[11px] font-medium uppercase tracking-wider", className)}
      onChange={event => onValueChange?.(event.target.value)}
      {...props}
    >
      {children}
    </select>
  );
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children}</option>;
}
