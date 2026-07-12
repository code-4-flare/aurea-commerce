import type { Metadata } from "next";

import CheckoutClient from "@/components/checkout-client";

export const metadata: Metadata = {
  title: "Checkout | Aurea Nairobi",
  description: "Mock checkout flow for the Aurea fashion ecommerce prototype.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
