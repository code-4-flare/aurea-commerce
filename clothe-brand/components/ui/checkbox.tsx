import * as React from "react";

export function Checkbox(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="checkbox" className="size-4 accent-brand-dark" {...props} />;
}
