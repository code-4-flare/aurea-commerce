export function Separator({ className = "" }: { className?: string }) {
  return <div className={`h-px w-full bg-brand-dark/10 ${className}`} />;
}
