"use client";

import { Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatKES } from "@/lib/utils";
import { useCommerceStore } from "@/store/use-commerce-store";
import { ColorSwatch, Product } from "@/utils/types";

export default function ProductCard({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState<ColorSwatch>(product.colors[0]);
  const addToCart = useCommerceStore(state => state.addToCart);
  const wishlist = useCommerceStore(state => state.wishlist);
  const toggleWishlist = useCommerceStore(state => state.toggleWishlist);
  const isWishListed = wishlist.includes(product.id);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-brand-dark/5 bg-white shadow-sm transition-all duration-500 ease-[0.16,1,0.3,1] hover:shadow-xl">
      <div className="relative aspect-[3/4] w-full cursor-pointer overflow-hidden bg-stone-100">
        {product.badge && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-brand-dark/95 px-3.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-brand-cream shadow-sm backdrop-blur-md">
            {product.badge}
          </span>
        )}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-white/90 text-brand-dark shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-110 hover:text-brand-gold"
          aria-label={isWishListed ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4 w-4 transition-all duration-300 ${isWishListed ? "scale-110 fill-brand-gold text-brand-gold" : "text-brand-dark"}`} />
        </button>
        <Link href={`/product/${product.id}`} className="block h-full w-full">
          <Image width={800} height={1000} src={product.images[0]} alt={product.name} className="h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105" referrerPolicy="no-referrer" />
          {product.images[1] && (
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <Image width={800} height={1000} src={product.images[1]} alt={`${product.name} alternate view`} className="h-full w-full object-cover object-center transition-all duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
            </div>
          )}
        </Link>
        <div className="absolute bottom-4 left-4 right-4 z-10 hidden translate-y-8 opacity-0 transition-all duration-300 ease-[0.16,1,0.3,1] group-hover:translate-y-0 group-hover:opacity-100 sm:block">
          {product.inStock ? (
            <button
              onClick={() => addToCart(product, selectedColor, product.sizes[0] || "M")}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-brand-dark/10 bg-brand-dark py-3 text-[10px] font-semibold uppercase tracking-widest text-brand-cream shadow-md transition-all duration-300 hover:border-brand-gold hover:bg-brand-gold hover:text-brand-dark"
            >
              <ShoppingBag className="h-3.5 w-3.5" /> Quick Add
            </button>
          ) : (
            <span className="flex w-full items-center justify-center rounded-full bg-stone-200/80 py-3 text-[10px] font-semibold uppercase tracking-widest text-stone-500 backdrop-blur-md">Sold Out</span>
          )}
        </div>
      </div>

      <div className="flex flex-grow flex-col p-5">
        <span className="text-[10px] font-light uppercase tracking-widest text-stone-400">{product.category}</span>
        <Link href={`/product/${product.id}`} className="mt-1 truncate text-left font-serif text-base font-medium tracking-tight text-brand-dark transition-colors hover:text-brand-gold">
          {product.name}
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-brand-dark">{formatKES(product.price)}</span>
          <div className="flex items-center gap-1.5">
            {product.colors.map(color => (
              <button key={color.name} onClick={() => setSelectedColor(color)} className="relative flex size-5 items-center justify-center rounded-full" title={color.name}>
                <span className="size-3 rounded-full border border-brand-dark/10" style={{ backgroundColor: color.value }} />
                {selectedColor.name === color.name && <span className="absolute inset-0 rounded-full border border-brand-gold" />}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 sm:hidden">
          {product.inStock ? (
            <Button onClick={() => addToCart(product, selectedColor, product.sizes[0] || "M")} className="w-full rounded-lg py-2 text-[10px]">
              <ShoppingBag data-icon="inline-start" /> Add To Cart
            </Button>
          ) : (
            <span className="block w-full rounded-lg bg-stone-100 py-2 text-center text-[10px] font-semibold uppercase tracking-widest text-stone-400">Sold Out</span>
          )}
        </div>
      </div>
    </div>
  );
}
