import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">Collection update</span>
      <h1 className="mt-3 font-serif text-4xl font-normal tracking-tight text-brand-dark">This piece is no longer available.</h1>
      <p className="mt-4 max-w-lg text-sm font-light leading-relaxed text-stone-600">
        The product may have sold out or moved out of the current collection. Explore the latest Aurea pieces instead.
      </p>
      <Link href="/shop" className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-dark px-8 py-4 text-xs font-semibold uppercase tracking-widest text-brand-cream shadow-md transition-all hover:bg-brand-gold hover:text-brand-dark">
        Browse the collection
      </Link>
    </div>
  );
}
