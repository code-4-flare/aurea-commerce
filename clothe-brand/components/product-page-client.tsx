import Link from "next/link";

import ProductGallery from "@/components/product-gallery";
import ProductGrid from "@/components/product-grid";
import ProductOptions from "@/components/product-options";
import type { Product } from "@/types/commerce";

export default function ProductPageClient({ product, relatedProducts }: { product: Product; relatedProducts: Product[] }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
      <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-wider text-stone-500">
        <Link href="/" className="hover:text-brand-gold">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-brand-gold">Shop</Link>
        <span>/</span>
        <span className="font-medium text-brand-dark">{product.category}</span>
      </nav>
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <ProductGallery product={product} />
        <ProductOptions product={product} />
      </div>
      <div className="mt-20 border-t border-brand-dark/10 pt-12">
        <h2 className="mb-8 text-center font-serif text-2xl font-normal text-brand-dark lg:text-3xl">Complete The Signature Drape</h2>
        <ProductGrid products={relatedProducts} />
      </div>
    </div>
  );
}
