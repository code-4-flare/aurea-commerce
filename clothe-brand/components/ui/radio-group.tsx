import * as React from "react";

export function RadioGroup({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`grid gap-4 ${className}`} {...props} />;
}

export function RadioGroupItem(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="radio" className="size-4 accent-brand-dark" {...props} />;
}
