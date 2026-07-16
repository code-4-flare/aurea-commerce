"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function StoreError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">Temporary interruption</span>
      <h1 className="mt-3 font-serif text-4xl font-normal tracking-tight text-brand-dark">We could not load this page.</h1>
      <p className="mt-4 max-w-lg text-sm font-light leading-relaxed text-stone-600">
        Your cart and payment details have not been changed. Try again, or return to the collection while the connection recovers.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button type="button" onClick={reset}>Try again</Button>
        <Link href="/shop" className="inline-flex items-center justify-center rounded-full border border-brand-dark/20 px-8 py-4 text-xs font-semibold uppercase tracking-widest text-brand-dark transition-all hover:border-brand-dark hover:bg-white">
          Return to shop
        </Link>
      </div>
    </div>
  );
}
