export default function PaymentCallbackLoading() {
  return (
    <div className="mx-auto grid min-h-[70dvh] max-w-7xl grid-cols-1 px-6 py-16 lg:grid-cols-2 lg:px-12">
      <div className="flex flex-col justify-center lg:pr-16">
        <div className="mb-10 h-2 w-36 animate-pulse rounded-full bg-brand-gold/30" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-gold">Secure verification</p>
        <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-none text-brand-dark md:text-6xl">Confirming your payment.</h1>
        <p className="mt-7 max-w-lg text-sm font-light leading-7 text-stone-600">
          Keep this page open while Aurea checks the transaction directly with Paystack.
        </p>
      </div>
      <div className="mt-12 flex items-end border-brand-dark/10 lg:mt-0 lg:border-l lg:pl-12">
        <div className="w-full space-y-5 border-y border-brand-dark/10 py-8" aria-label="Verifying payment">
          <div className="h-3 w-1/3 animate-pulse rounded-full bg-stone-200" />
          <div className="h-3 w-3/4 animate-pulse rounded-full bg-stone-200 [animation-delay:120ms]" />
          <div className="h-3 w-1/2 animate-pulse rounded-full bg-stone-200 [animation-delay:240ms]" />
        </div>
      </div>
    </div>
  );
}
