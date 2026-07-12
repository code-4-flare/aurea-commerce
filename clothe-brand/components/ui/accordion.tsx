import * as React from "react";

export function Accordion({ children, className = "" }: { children: React.ReactNode; className?: string; type?: string; defaultValue?: string }) {
  return <div className={className}>{children}</div>;
}

export function AccordionItem({ children, className = "" }: { children: React.ReactNode; value: string; className?: string }) {
  return <details className={className}>{children}</details>;
}

export function AccordionTrigger({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <summary className={`cursor-pointer list-none ${className}`}>{children}</summary>;
}

export function AccordionContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
