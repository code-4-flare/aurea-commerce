import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Aurea Nairobi",
  description: "Default terms of service for the Aurea Nairobi fashion store.",
};

const sections = [
  {
    title: "Use Of The Store",
    body:
      "By using this website, you agree to use it for lawful personal shopping purposes and not to misuse, disrupt, copy, scrape, or interfere with the store or its content.",
  },
  {
    title: "Product Information",
    body:
      "We aim to present product details, colors, pricing, and availability accurately. Minor differences may occur because of screen settings, photography, fabric variation, or stock changes.",
  },
  {
    title: "Orders And Acceptance",
    body:
      "An order is an offer to purchase. We may accept, decline, cancel, or limit orders where items are unavailable, details are incorrect, payment is not completed, or misuse is suspected.",
  },
  {
    title: "Pricing And Payment",
    body:
      "Prices are shown in the store currency unless stated otherwise. You are responsible for providing accurate billing and payment details and for any charges applied by your payment provider.",
  },
  {
    title: "Delivery",
    body:
      "Delivery estimates are provided for convenience and may vary because of courier schedules, location, weather, public holidays, or other circumstances outside our control.",
  },
  {
    title: "Returns And Exchanges",
    body:
      "Returns and exchanges are handled according to our Delivery & Returns guidance. Items should be returned unworn, unused, and with original packaging or tags where applicable.",
  },
  {
    title: "Intellectual Property",
    body:
      "The website design, photography, copy, product names, and brand materials belong to Aurea Nairobi or its licensors and may not be used without permission.",
  },
  {
    title: "Limitation Of Liability",
    body:
      "To the fullest extent permitted by applicable law, Aurea Nairobi is not liable for indirect, incidental, or consequential losses arising from use of the store.",
  },
  {
    title: "Updates",
    body:
      "We may update these terms from time to time. Continued use of the store after changes means you accept the updated terms.",
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20 lg:px-12">
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">Legal</span>
      <h1 className="mt-3 font-serif text-5xl font-normal tracking-tight text-brand-dark">Terms of Service</h1>
      <p className="mt-4 text-xs font-light uppercase tracking-wider text-stone-500">Last updated: July 12, 2026</p>
      <p className="mt-8 max-w-3xl text-sm font-light leading-relaxed text-stone-600">
        These default terms describe the basic rules for using the Aurea Nairobi online store. They are a general template and should be reviewed for your actual business practices before launch.
      </p>

      <div className="mt-10 divide-y divide-brand-dark/10 rounded-2xl border border-brand-dark/5 bg-white">
        {sections.map(section => (
          <section key={section.title} className="p-6">
            <h2 className="font-serif text-2xl text-brand-dark">{section.title}</h2>
            <p className="mt-3 text-sm font-light leading-relaxed text-stone-600">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
