import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Hero from "@/components/hero";
import ProductGrid from "@/components/product-grid";
import SmartLink from "@/components/smart-link";
import { sanityFetch } from "@/src/sanity/lib/client";
import { ALL_ACTIVE_PRODUCTS_QUERY, HOMEPAGE_QUERY, SITE_SETTINGS_QUERY } from "@/src/sanity/lib/queries";
import { mapSanityCollection, mapSanityProducts, type SanityCollectionCard, type SanityProduct } from "@/src/sanity/lib/products";
import { mapHomepage, mapSiteSettings, type RawHomepage, type RawSiteSettings } from "@/src/sanity/lib/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Aurea Nairobi | Refined Fashion for Everyday Living",
  description: "Discover refined dresses, separates, and new arrivals curated by Aurea Nairobi, with secure checkout and delivery across Kenya.",
  path: "/",
});

type HomepageDocument = (RawHomepage & {
  featuredProducts?: SanityProduct[];
  featuredCollections?: SanityCollectionCard[];
}) | null;

export default async function HomePage() {
  const [homepageDocument, activeProducts, siteSettingsDocument] = await Promise.all([
    sanityFetch<HomepageDocument>({ query: HOMEPAGE_QUERY, tags: ["homepage", "product", "collection"] }),
    sanityFetch<SanityProduct[]>({ query: ALL_ACTIVE_PRODUCTS_QUERY, tags: ["product"] }),
    sanityFetch<RawSiteSettings | null>({ query: SITE_SETTINGS_QUERY, tags: ["siteSettings"] }),
  ]);
  const homepage = mapHomepage(homepageDocument);
  const siteSettings = mapSiteSettings(siteSettingsDocument);
  const fallbackProducts = mapSanityProducts(activeProducts).slice(0, 4);
  const featuredProducts = mapSanityProducts(homepageDocument?.featuredProducts).slice(0, 4);
  const displayedProducts = featuredProducts.length > 0 ? featuredProducts : fallbackProducts;
  const featuredCollections = (homepageDocument?.featuredCollections ?? []).map(mapSanityCollection).filter(collection => collection.name);

  return (
    <div className="flex flex-col gap-16">
      <Hero content={homepage} siteSettings={siteSettings} />
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-12">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-brand-gold">{homepage.featuredProductsEyebrow}</span>
            <h2 className="font-serif text-3xl font-normal tracking-tight text-brand-dark lg:text-4xl">{homepage.featuredProductsTitle}</h2>
          </div>
          <SmartLink href={homepage.featuredProductsLinkHref} className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand-dark transition-colors hover:text-brand-gold">
            {homepage.featuredProductsLinkLabel} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </SmartLink>
        </div>
        <ProductGrid products={displayedProducts} />
      </section>

      {featuredCollections.length > 0 && (
        <section className="border-y border-brand-dark/5 bg-white py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="mb-12 text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">{homepage.featuredCollectionsEyebrow}</span>
              <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight text-brand-dark lg:text-4xl">{homepage.featuredCollectionsTitle}</h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {featuredCollections.map(collection => (
                <Link key={collection.slug} href="/shop" className="group relative flex flex-col overflow-hidden rounded-3xl border border-brand-dark/5 bg-brand-cream shadow-sm transition-all duration-500 hover:shadow-xl">
                  <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                    <Image width={800} height={600} src={collection.image} alt={collection.name} className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex flex-col gap-2 p-6">
                    <h3 className="font-serif text-xl text-brand-dark">{collection.name}</h3>
                    <p className="text-xs font-light leading-relaxed text-stone-500">{collection.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
