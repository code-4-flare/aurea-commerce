import { CreditCard, RefreshCw, ShieldCheck, Truck } from "lucide-react";

import { TrustIndicator } from "@/src/sanity/lib/site";

export default function TrustStrip({ items }: { items: TrustIndicator[] }) {
  const getIcon = (title: string) => {
    if (title === "Premium Quality") return <ShieldCheck className="h-5 w-5 stroke-[1.5] text-brand-gold" />;
    if (title === "Easy Returns") return <RefreshCw className="h-5 w-5 stroke-[1.5] text-brand-gold" />;
    if (title === "Secure Payments") return <CreditCard className="h-5 w-5 stroke-[1.5] text-brand-gold" />;
    return <Truck className="h-5 w-5 stroke-[1.5] text-brand-gold" />;
  };

  return (
    <div className="w-full border-y border-brand-dark/5 bg-white py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
          {items.map(item => (
            <div key={item.title} className="flex items-start justify-center gap-3 md:justify-start">
              <div className="mt-0.5 flex-shrink-0 rounded-full border border-brand-gold/10 bg-brand-cream p-2">{getIcon(item.title)}</div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-dark">{item.title}</h3>
                <p className="mt-0.5 text-[11px] font-light text-stone-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
