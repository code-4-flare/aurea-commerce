import * as React from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-brand-dark/10 bg-white/70 px-4 py-3 text-xs placeholder:text-stone-400 focus:border-brand-gold focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
