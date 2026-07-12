import * as React from "react";

export function Label({ className = "", ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={`text-[10px] font-semibold uppercase tracking-wider text-brand-dark ${className}`} {...props} />;
}
