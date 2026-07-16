import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductPageClient from "@/components/product-page-client";
import { client, sanityFetch } from "@/src/sanity/lib/client";
import { ALL_PRODUCT_SLUGS_QUERY, PRODUCT_BY_SLUG_QUERY } from "@/src/sanity/lib/queries";
import { mapSanityProduct, mapSanityProducts } from "@/src/sanity/lib/products";
import { createPageMetadata } from "@/lib/metadata";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await client.withConfig({ useCdn: false }).fetch(ALL_PRODUCT_SLUGS_QUERY);
  return (products ?? []).map((product: { slug?: string }) => ({ slug: product.slug })).filter((product: { slug?: string }) => product.slug);
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const productDocument = await sanityFetch({ query: PRODUCT_BY_SLUG_QUERY, params: { slug }, tags: [`product:${slug}`, "product"] });

  if (!productDocument) {
    return createPageMetadata({
      title: "Product Not Found | Aurea Nairobi",
      description: "This Aurea Nairobi product is no longer available. Explore the current collection instead.",
      path: `/product/${slug}`,
      noIndex: true,
    });
  }

  const product = mapSanityProduct(productDocument);

  return createPageMetadata({
    title: `${product.name} | Aurea Nairobi`,
    description: product.description || `Shop ${product.name} from Aurea Nairobi, available for delivery across Kenya.`,
    path: `/product/${slug}`,
    image: product.images[0],
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const productDocument = await sanityFetch({ query: PRODUCT_BY_SLUG_QUERY, params: { slug }, tags: [`product:${slug}`, "product"] });

  if (!productDocument) notFound();

  const product = mapSanityProduct(productDocument);
  const relatedProducts = mapSanityProducts(productDocument.relatedProducts).filter(item => item.id !== product.id).slice(0, 3);

  return <ProductPageClient product={product} relatedProducts={relatedProducts} />;
}
