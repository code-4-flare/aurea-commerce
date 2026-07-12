"use client";

import * as React from "react";
import { createPortal } from "react-dom";

export function Dialog({ open, children }: { open: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode }) {
  if (!open || typeof document === "undefined") return null;
  return createPortal(children, document.body);
}

export function DialogContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`fixed inset-0 z-50 ${className}`}>{children}</div>;
}

export function DialogHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function DialogTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={className}>{children}</h2>;
}
