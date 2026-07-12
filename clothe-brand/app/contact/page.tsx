import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Aurea Nairobi",
  description: "Contact the Aurea Nairobi mock fashion studio.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20 lg:px-12">
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">Studio</span>
      <h1 className="mt-3 font-serif text-5xl font-normal tracking-tight text-brand-dark">Contact Aurea</h1>
      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {[
          ["Nairobi Studio", "Westlands Commercial Centre, Ring Rd"],
          ["Customer Care", "+254 700 000 000"],
          ["Hours", "Mon - Sat, 9:00 AM - 6:00 PM"],
        ].map(([title, body]) => (
          <div key={title} className="rounded-2xl border border-brand-dark/5 bg-white p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-dark">{title}</h2>
            <p className="mt-3 text-sm font-light leading-relaxed text-stone-600">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
