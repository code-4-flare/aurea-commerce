"use client";

import { Ruler, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

import ProductDetailsAccordion from "@/components/product-details-accordion";
import QuantityStepper from "@/components/quantity-stepper";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatKES } from "@/lib/utils";
import { useCommerceStore } from "@/store/use-commerce-store";
import { ColorSwatch, Product } from "@/utils/types";

export default function ProductOptions({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState<ColorSwatch>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const addToCart = useCommerceStore(state => state.addToCart);

  return (
    <div className="space-y-8 lg:col-span-5">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">{product.category}</span>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${product.inStock ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
            <span className={`size-1.5 rounded-full ${product.inStock ? "bg-emerald-600" : "bg-rose-600"}`} />
            {product.inStock ? "In Stock" : "Sold Out"}
          </span>
        </div>
        <h1 className="font-serif text-3xl font-normal tracking-tight text-brand-dark lg:text-4xl">{product.name}</h1>
        <p className="text-2xl font-semibold text-brand-dark">{formatKES(product.price)}</p>
        <p className="text-sm font-light leading-relaxed text-stone-600">{product.description}</p>
      </div>

      <div className="flex flex-col gap-6 border-t border-brand-dark/10 pt-6">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-dark">
            Selected Color: <span className="font-medium normal-case text-stone-500">{selectedColor.name}</span>
          </span>
          <div className="flex items-center gap-3">
            {product.colors.map(color => (
              <button key={color.name} onClick={() => setSelectedColor(color)} className="relative flex size-8 items-center justify-center rounded-full" title={color.name}>
                <span className="size-6 rounded-full border border-brand-dark/15 shadow-sm" style={{ backgroundColor: color.value }} />
                {selectedColor.name === color.name && <span className="absolute inset-0 rounded-full border border-brand-gold" />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-dark">
              Select Size: <span className="text-brand-gold">{selectedSize}</span>
            </span>
            <button onClick={() => setIsSizeGuideOpen(true)} className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-brand-gold transition-colors hover:text-brand-dark">
              <Ruler className="h-3.5 w-3.5" /> Size Guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                disabled={!product.inStock}
                className={`flex h-12 min-w-12 items-center justify-center rounded-xl border px-3.5 text-xs font-semibold transition-all ${selectedSize === size ? "scale-[1.03] border-brand-dark bg-brand-dark text-brand-cream shadow-md" : "border-brand-dark/15 bg-white text-brand-dark hover:border-brand-dark disabled:opacity-50"}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <QuantityStepper value={quantity} onChange={setQuantity} disabled={!product.inStock} />
            <Button onClick={() => addToCart(product, selectedColor, selectedSize, quantity)} disabled={!product.inStock} className="flex-grow py-4">
              <ShoppingBag data-icon="inline-start" /> {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
          <a
            href={`https://wa.me/254700000000?text=Hello%20Aurea%20Nairobi,%20I%20would%20like%20to%20order%20the%20${encodeURIComponent(product.name)}%20in%20size%20${selectedSize}%20(${selectedColor.name})`}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2.5 rounded-full border border-brand-gold/30 bg-white/20 py-3.5 text-xs font-semibold uppercase tracking-widest text-brand-dark shadow-sm transition-all duration-300 hover:border-brand-gold hover:bg-white/50"
          >
            Need help? Order via WhatsApp
          </a>
        </div>

        <div className="rounded-2xl border border-brand-gold/15 bg-brand-cream p-5 text-xs font-light leading-relaxed text-stone-600">
          <p><strong className="text-brand-dark">Delivery Estimate:</strong> Nairobi & Environs today. Rest of Kenya in 1-2 working days via G4S or Fargo Courier.</p>
          <Separator className="my-3 bg-brand-gold/10" />
          <p><strong className="text-brand-dark">Authenticity Guarantee:</strong> Every piece is delivered in our signature dust bag and premium presentation box.</p>
        </div>

        <ProductDetailsAccordion product={product} />
      </div>

      {product.inStock && (
        <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between gap-4 border-t border-brand-dark/10 bg-white p-4 shadow-2xl sm:hidden">
          <div className="flex-shrink-0">
            <span className="block text-[10px] uppercase text-stone-400">Active Price</span>
            <span className="text-sm font-semibold text-brand-dark">{formatKES(product.price)}</span>
          </div>
          <Button onClick={() => addToCart(product, selectedColor, selectedSize, quantity)} className="flex-grow rounded-xl py-3.5">
            <ShoppingBag data-icon="inline-start" /> Quick Add ({selectedSize})
          </Button>
        </div>
      )}

      <Dialog open={isSizeGuideOpen} onOpenChange={open => !open && setIsSizeGuideOpen(false)}>
        <DialogContent className="grid place-items-center p-4">
          <button className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm" aria-label="Close size guide" onClick={() => setIsSizeGuideOpen(false)} />
          <div className="relative z-10 max-h-[min(760px,calc(100vh-2rem))] w-full max-w-lg overflow-y-auto rounded-2xl border border-brand-dark/10 bg-brand-cream p-6 shadow-2xl md:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-brand-dark/10 pb-4">
              <DialogTitle className="font-serif text-lg uppercase tracking-wider text-brand-dark">Aurea Sizing Blueprint</DialogTitle>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="rounded-full p-2 text-stone-500 transition-colors hover:bg-white hover:text-brand-dark"
                aria-label="Close size guide"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse font-mono text-[11px]">
                <thead><tr className="border-b border-brand-dark/20 text-left text-stone-400"><th className="py-2.5 uppercase">Size</th><th>Chest</th><th>Waist</th><th>Sleeve</th></tr></thead>
                <tbody className="divide-y divide-brand-dark/5 text-brand-dark">
                  {["XS / 34|82 - 86|64 - 68|58.5", "S / 36|87 - 92|69 - 74|59.5", "M / 38|93 - 98|75 - 80|60.5", "L / 40|99 - 104|81 - 86|61.5", "XL / 42|105 - 110|87 - 92|62.5"].map(row => {
                    const cells = row.split("|");
                    return <tr key={row}>{cells.map(cell => <td key={cell} className="py-2.5">{cell}</td>)}</tr>;
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
