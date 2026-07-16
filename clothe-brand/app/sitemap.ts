import type { MetadataRoute } from "next";

import { absoluteSiteUrl } from "@/lib/site-url";
import { sanityFetch } from "@/src/sanity/lib/client";
import { PRODUCT_SITEMAP_QUERY } from "@/src/sanity/lib/queries";

const publicRoutes = ["/", "/shop", "/new-arrivals", "/contact", "/delivery-returns", "/terms-of-service", "/privacy-policy"];

type SitemapProduct = { slug?: string; updatedAt?: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = publicRoutes.map(path => ({ url: absoluteSiteUrl(path) }));

  try {
    const products = (await sanityFetch({ query: PRODUCT_SITEMAP_QUERY, tags: ["product"] })) as SitemapProduct[];
    const productEntries: MetadataRoute.Sitemap = products
      .filter(product => product.slug)
      .map(product => ({
        url: absoluteSiteUrl(`/product/${product.slug}`),
        lastModified: product.updatedAt,
      }));

    return [...staticEntries, ...productEntries];
  } catch (error) {
    console.error("Unable to include Sanity products in sitemap", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return staticEntries;
  }
}
