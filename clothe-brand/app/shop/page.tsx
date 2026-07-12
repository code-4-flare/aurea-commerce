import type { Metadata } from "next";
import { Suspense } from "react";

import ShopClient from "@/components/shop-client";
import { sanityFetch } from "@/src/sanity/lib/client";
import { ALL_ACTIVE_PRODUCTS_QUERY } from "@/src/sanity/lib/queries";
import { mapSanityProducts } from "@/src/sanity/lib/products";

export const metadata: Metadata = {
  title: "Shop All | Aurea Nairobi",
  description: "Browse Aurea mock fashion products with editorial filtering, sorting, and cart interactions.",
};

export default async function ShopPage() {
  const products = mapSanityProducts(await sanityFetch({ query: ALL_ACTIVE_PRODUCTS_QUERY, tags: ["product"] }));

  return (
    <Suspense>
      <ShopClient title="Shop All" products={products} />
    </Suspense>
  );
}
