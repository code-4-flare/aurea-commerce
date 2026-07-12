import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "icon";
};

export function Button({ className, variant = "default", size = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-all disabled:pointer-events-none disabled:opacity-50",
        variant === "default" && "bg-brand-dark text-brand-cream shadow-md hover:bg-brand-gold hover:text-brand-dark",
        variant === "outline" && "border border-brand-dark/20 bg-transparent text-brand-dark hover:border-brand-dark hover:bg-white",
        variant === "ghost" && "bg-transparent text-brand-dark hover:text-brand-gold",
        size === "default" && "px-8 py-4",
        size === "sm" && "px-4 py-2.5",
        size === "icon" && "size-10 p-0",
        className,
      )}
      {...props}
    />
  );
}
