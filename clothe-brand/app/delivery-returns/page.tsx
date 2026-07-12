import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delivery & Returns | Aurea Nairobi",
  description: "Mock delivery and returns information for Aurea Nairobi.",
};

export default function DeliveryReturnsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20 lg:px-12">
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">Guidelines</span>
      <h1 className="mt-3 font-serif text-5xl font-normal tracking-tight text-brand-dark">Delivery & Returns</h1>
      <div className="mt-10 grid gap-6">
        {[
          ["Nairobi delivery", "Same-day courier is available for Nairobi and surrounding areas on orders placed before 2 PM."],
          ["Nationwide delivery", "Rest of Kenya orders are dispatched through mock courier partners within 1-2 working days."],
          ["Returns", "Items can be returned within 14 days in original unworn condition for a mock refund or size exchange."],
        ].map(([title, body]) => (
          <section key={title} className="rounded-2xl border border-brand-dark/5 bg-white p-6">
            <h2 className="font-serif text-2xl text-brand-dark">{title}</h2>
            <p className="mt-2 text-sm font-light leading-relaxed text-stone-600">{body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
