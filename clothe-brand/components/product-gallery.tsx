"use client";

import Image from "next/image";
import { useState } from "react";

import { Product } from "@/utils/types";

export default function ProductGallery({ product }: { product: Product }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="space-y-4 lg:col-span-7">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-stone-100 shadow-sm">
        <Image
          key={activeImageIndex}
          src={product.images[activeImageIndex] || product.images[0]}
          alt={product.name}
          width={1000}
          height={1300}
          className="h-full w-full object-cover object-center"
          referrerPolicy="no-referrer"
          priority
        />
        {product.badge && <span className="absolute left-6 top-6 z-10 rounded-full bg-brand-dark px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-cream shadow-sm">{product.badge}</span>}
      </div>
      <div className="flex gap-3">
        {product.images.map((image, index) => (
          <button
            key={image}
            onClick={() => setActiveImageIndex(index)}
            className={`relative aspect-[3/4] w-24 overflow-hidden rounded-lg border bg-stone-100 transition-all ${activeImageIndex === index ? "border-brand-gold ring-1 ring-brand-gold" : "border-brand-dark/5"}`}
          >
            <Image src={image} width={150} height={200} alt={`${product.name} thumbnail ${index + 1}`} className="h-full w-full object-cover object-center" referrerPolicy="no-referrer" />
          </button>
        ))}
      </div>
    </div>
  );
}
