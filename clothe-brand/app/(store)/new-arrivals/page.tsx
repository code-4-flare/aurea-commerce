import type { Metadata } from "next";
import { Suspense } from "react";

import ShopClient from "@/components/shop-client";
import { sanityFetch } from "@/src/sanity/lib/client";
import { NEW_ARRIVALS_QUERY } from "@/src/sanity/lib/queries";
import { mapSanityProducts } from "@/src/sanity/lib/products";

export const metadata: Metadata = {
  title: "New Arrivals | Aurea Nairobi",
  description: "Discover the latest mock Aurea fashion arrivals and premium editorial selections.",
};

export default async function NewArrivalsPage() {
  const products = mapSanityProducts(await sanityFetch({ query: NEW_ARRIVALS_QUERY, tags: ["product"] }));

  return (
    <Suspense>
      <ShopClient title="New Arrivals" products={products} onlyNew />
    </Suspense>
  );
}
