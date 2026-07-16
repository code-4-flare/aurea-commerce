import type { Metadata } from "next";
import { Suspense } from "react";

import ShopClient from "@/components/shop-client";
import { sanityFetch } from "@/src/sanity/lib/client";
import { ALL_ACTIVE_PRODUCTS_QUERY } from "@/src/sanity/lib/queries";
import { mapSanityProducts, type SanityProduct } from "@/src/sanity/lib/products";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Shop Women’s Fashion | Aurea Nairobi",
  description: "Browse Aurea Nairobi’s refined dresses, linen separates, knitwear, and curated wardrobe essentials, available for delivery across Kenya.",
  path: "/shop",
});

export default async function ShopPage() {
  const products = mapSanityProducts(
    await sanityFetch<SanityProduct[]>({ query: ALL_ACTIVE_PRODUCTS_QUERY, tags: ["product"] }),
  );

  return (
    <Suspense>
      <ShopClient title="Shop All" products={products} />
    </Suspense>
  );
}
