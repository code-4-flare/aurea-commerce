import type { Metadata } from "next";

import CheckoutClient from "@/components/checkout-client";

export const metadata: Metadata = {
  title: "Checkout | Aurea Nairobi",
  description: "Secure Aurea Nairobi checkout powered by Paystack.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
