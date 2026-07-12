import * as React from "react";

import { cn } from "@/lib/utils";

export function Sheet({ open, children }: { open: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode }) {
  if (!open) return null;
  return <>{children}</>;
}

export function SheetContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("fixed inset-0 z-50 flex overflow-hidden", className)}>{children}</div>;
}

export function SheetHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function SheetTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={className}>{children}</h2>;
}
