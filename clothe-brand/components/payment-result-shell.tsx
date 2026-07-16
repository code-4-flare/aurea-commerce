import SmartLink from "@/components/smart-link";

type ResultTone = "success" | "processing" | "failed";

const toneStyles: Record<ResultTone, { label: string; marker: string; wash: string }> = {
  success: {
    label: "Payment verified",
    marker: "bg-emerald-700",
    wash: "from-emerald-900/10",
  },
  processing: {
    label: "Verification in progress",
    marker: "bg-brand-gold",
    wash: "from-brand-gold/20",
  },
  failed: {
    label: "Payment not verified",
    marker: "bg-red-800",
    wash: "from-red-900/10",
  },
};

export default function PaymentResultShell({
  tone,
  eyebrow,
  title,
  description,
  reference,
  details,
  primaryAction,
  secondaryAction,
  children,
}: {
  tone: ResultTone;
  eyebrow: string;
  title: string;
  description: string;
  reference?: string;
  details?: Array<{ label: string; value: string }>;
  primaryAction: { href: string; label: string };
  secondaryAction?: { href: string; label: string };
  children?: React.ReactNode;
}) {
  const styles = toneStyles[tone];

  return (
    <div className="relative isolate overflow-hidden border-b border-brand-dark/5">
      <div className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${styles.wash} via-transparent to-transparent`} />
      <div className="mx-auto grid min-h-[70dvh] max-w-7xl grid-cols-1 px-6 py-14 md:py-20 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] lg:px-12">
        <section className="flex flex-col justify-center border-brand-dark/10 lg:border-r lg:pr-16">
          <div className="mb-10 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-500">
            <span className={`h-2 w-2 rounded-full ${styles.marker}`} aria-hidden="true" />
            {styles.label}
          </div>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-gold">{eyebrow}</p>
          <h1 className="max-w-3xl font-serif text-4xl font-normal leading-[0.96] tracking-tight text-brand-dark md:text-6xl">
            {title}
          </h1>
          <p className="mt-7 max-w-xl text-sm font-light leading-7 text-stone-600 md:text-base">{description}</p>
          {children}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <SmartLink
              href={primaryAction.href}
              className="inline-flex items-center justify-center rounded-full bg-brand-dark px-8 py-4 text-xs font-semibold uppercase tracking-widest text-brand-cream transition-all hover:bg-brand-gold hover:text-brand-dark active:scale-[0.98]"
            >
              {primaryAction.label}
            </SmartLink>
            {secondaryAction && (
              <SmartLink
                href={secondaryAction.href}
                className="inline-flex items-center justify-center rounded-full border border-brand-dark/20 px-8 py-4 text-xs font-semibold uppercase tracking-widest text-brand-dark transition-all hover:border-brand-dark hover:bg-white active:scale-[0.98]"
              >
                {secondaryAction.label}
              </SmartLink>
            )}
          </div>
        </section>

        <aside className="mt-14 flex flex-col justify-end lg:mt-0 lg:pl-12">
          <p className="border-b border-brand-dark/10 pb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-400">
            Transaction record
          </p>
          <dl className="divide-y divide-brand-dark/10">
            {reference && (
              <div className="py-5">
                <dt className="text-[10px] uppercase tracking-widest text-stone-400">Reference</dt>
                <dd className="mt-2 break-all font-mono text-xs text-brand-dark">{reference}</dd>
              </div>
            )}
            {details?.map(detail => (
              <div key={detail.label} className="flex items-baseline justify-between gap-6 py-5">
                <dt className="text-[10px] uppercase tracking-widest text-stone-400">{detail.label}</dt>
                <dd className="text-right text-sm font-medium text-brand-dark">{detail.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-[11px] font-light leading-6 text-stone-500">
            Keep the payment reference available if you need help from the Aurea customer experience team.
          </p>
        </aside>
      </div>
    </div>
  );
}
