import type { Metadata } from "next";

import CheckoutClient from "@/components/checkout-client";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Secure Checkout | Aurea Nairobi",
  description: "Review your Aurea Nairobi order and complete payment securely with Paystack or continue your order through WhatsApp.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return <CheckoutClient />;
}
