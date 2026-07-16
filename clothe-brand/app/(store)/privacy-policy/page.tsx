import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy | Aurea Nairobi",
  description: "Learn how Aurea Nairobi collects, uses, shares, and protects customer, order, payment-status, and website analytics information.",
  path: "/privacy-policy",
});

const sections = [
  {
    title: "Information We Collect",
    body:
      "We may collect contact details, delivery details, order information, payment status, customer service messages, and site usage information when you browse, create an order, subscribe, or contact us.",
  },
  {
    title: "How We Use Information",
    body:
      "We use information to process orders, arrange delivery, respond to support requests, send requested updates, improve the store experience, prevent misuse, and meet operational or legal requirements.",
  },
  {
    title: "Payments",
    body:
      "Payment information is handled by the selected payment provider. We do not intentionally store full card numbers or sensitive payment credentials on this website.",
  },
  {
    title: "Cookies And Analytics",
    body:
      "We may use cookies or similar technologies to keep the store working, remember preferences, understand site performance, and improve product discovery.",
  },
  {
    title: "Sharing Information",
    body:
      "We may share limited information with service providers such as delivery partners, payment processors, hosting providers, analytics tools, and support systems when needed to operate the store.",
  },
  {
    title: "Your Choices",
    body:
      "You may contact us to request access, correction, or deletion of personal information where applicable. You can also unsubscribe from marketing messages using the instructions in those messages.",
  },
  {
    title: "Data Retention",
    body:
      "We keep information only as long as reasonably needed for orders, customer service, business records, security, and legal or accounting obligations.",
  },
  {
    title: "Contact",
    body:
      "For privacy questions or requests, contact Aurea Nairobi customer care through the details provided on the Contact page.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20 lg:px-12">
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">Legal</span>
      <h1 className="mt-3 font-serif text-5xl font-normal tracking-tight text-brand-dark">Privacy Policy</h1>
      <p className="mt-4 text-xs font-light uppercase tracking-wider text-stone-500">Last updated: July 12, 2026</p>
      <p className="mt-8 max-w-3xl text-sm font-light leading-relaxed text-stone-600">
        This policy explains how Aurea Nairobi collects, uses, shares, and protects customer information when you browse or place an order.
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
