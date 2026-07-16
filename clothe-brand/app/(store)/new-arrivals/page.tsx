import type { Metadata } from "next";
import { Suspense } from "react";

import ShopClient from "@/components/shop-client";
import { sanityFetch } from "@/src/sanity/lib/client";
import { NEW_ARRIVALS_QUERY } from "@/src/sanity/lib/queries";
import { mapSanityProducts } from "@/src/sanity/lib/products";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "New Fashion Arrivals | Aurea Nairobi",
  description: "Explore the latest Aurea Nairobi fashion arrivals, including limited dresses, premium separates, and new-season wardrobe pieces.",
  path: "/new-arrivals",
});

export default async function NewArrivalsPage() {
  const products = mapSanityProducts(await sanityFetch({ query: NEW_ARRIVALS_QUERY, tags: ["product"] }));

  return (
    <Suspense>
      <ShopClient title="New Arrivals" products={products} onlyNew />
    </Suspense>
  );
}
