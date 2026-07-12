"use client";

import { Lock, Minus, Percent, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { formatKES } from "@/lib/utils";
import { useCommerceStore } from "@/store/use-commerce-store";

const FREE_DELIVERY_THRESHOLD = 15000;

export default function CartDrawer() {
  const router = useRouter();
  const isOpen = useCommerceStore(state => state.isCartOpen);
  const closeCart = useCommerceStore(state => state.closeCart);
  const cartItems = useCommerceStore(state => state.cartItems);
  const updateCartQuantity = useCommerceStore(state => state.updateCartQuantity);
  const removeCartItem = useCommerceStore(state => state.removeCartItem);
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");

  const subtotal = useMemo(() => cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0), [cartItems]);
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 500;
  const total = subtotal - discountAmount + deliveryFee;
  const deliveryProgressPercent = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  const handlePromo = (event: FormEvent) => {
    event.preventDefault();
    if (promoCode.trim().toUpperCase() === "AUREA10") {
      setAppliedDiscount(10);
      setPromoMessage("AUREA10 applied: 10% discount subtracted.");
    } else {
      setAppliedDiscount(0);
      setPromoMessage(promoCode.trim() ? "Invalid promotional code." : "Please type a code.");
    }
  };

  const goToCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  const goToShop = () => {
    closeCart();
    router.push("/shop");
  };

  return (
    <Sheet open={isOpen} onOpenChange={open => !open && closeCart()}>
      <SheetContent>
        <button className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm" aria-label="Close cart" onClick={closeCart} />
        <div className="relative z-10 ml-auto flex h-full w-full max-w-md flex-col overflow-hidden bg-brand-cream shadow-2xl">
          <div className="flex items-center justify-between border-b border-brand-dark/10 p-6">
            <SheetTitle className="font-serif text-xl font-normal tracking-tight text-brand-dark">
              Your Cart <span className="ml-1.5 rounded-full bg-brand-dark px-2 py-0.5 font-sans text-xs font-semibold text-brand-cream">{cartItems.length}</span>
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={closeCart} aria-label="Close cart">
              <X />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length > 0 ? (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2.5 rounded-2xl border border-brand-dark/5 bg-white p-4">
                  <div className="flex items-center justify-between text-xs">
                    {subtotal >= FREE_DELIVERY_THRESHOLD ? (
                      <span className="font-semibold text-emerald-800">Congratulations! You have unlocked Free Delivery.</span>
                    ) : (
                      <span className="font-light text-stone-600">
                        Add <span className="font-semibold text-brand-dark">{formatKES(FREE_DELIVERY_THRESHOLD - subtotal)}</span> more for free delivery.
                      </span>
                    )}
                    <span className="font-mono text-[10px] text-stone-500">{formatKES(FREE_DELIVERY_THRESHOLD)} goal</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                    <div className={`h-full rounded-full ${subtotal >= FREE_DELIVERY_THRESHOLD ? "bg-emerald-600" : "bg-brand-gold"}`} style={{ width: `${deliveryProgressPercent}%` }} />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex gap-4 rounded-2xl border border-brand-dark/5 bg-white p-4 shadow-sm">
                      <div className="h-24 w-18 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100">
                        <Image width={150} height={150} src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover object-center" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="line-clamp-1 font-serif text-sm font-medium tracking-tight text-brand-dark">{item.product.name}</h3>
                            <button onClick={() => removeCartItem(item.id)} className="p-0.5 text-stone-400 transition-colors hover:text-rose-600" aria-label="Remove item">
                              <Trash2 className="h-4 w-4 stroke-[1.5]" />
                            </button>
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-500">
                            <span>Size: <strong className="text-brand-dark">{item.selectedSize}</strong></span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              Color:<span className="inline-block size-2 rounded-full" style={{ backgroundColor: item.selectedColor.value }} />
                              <strong className="normal-case text-brand-dark">{item.selectedColor.name}</strong>
                            </span>
                          </div>
                        </div>
                        <div className="mt-2.5 flex items-center justify-between">
                          <QuantityMini value={item.quantity} onChange={quantity => updateCartQuantity(item.id, quantity)} />
                          <span className="text-sm font-semibold text-brand-dark">{formatKES(item.product.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handlePromo} className="flex flex-col gap-2 pt-4">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-dark">Promotional Code</label>
                  <div className="flex gap-2">
                    <div className="relative flex flex-grow items-center">
                      <Input value={promoCode} onChange={event => setPromoCode(event.target.value)} placeholder="Type AUREA10 for 10% off" className="uppercase tracking-wider" />
                      {appliedDiscount > 0 && <Percent className="absolute right-3 h-4 w-4 text-emerald-600" />}
                    </div>
                    <Button type="submit" size="sm" className="rounded-xl px-5">Apply</Button>
                  </div>
                  {promoMessage && <p className={`text-[11px] ${appliedDiscount > 0 ? "font-semibold text-emerald-600" : "font-light text-rose-600"}`}>{promoMessage}</p>}
                </form>
              </div>
            ) : (
              <div className="flex h-[60vh] flex-col items-center justify-center px-4 text-center">
                <div className="mb-6 rounded-full border border-brand-gold/15 bg-brand-cream p-6">
                  <ShoppingBag className="h-10 w-10 stroke-[1.5] text-brand-gold" />
                </div>
                <h3 className="mb-2 font-serif text-lg font-normal italic text-brand-dark">Your cart is currently silent.</h3>
                <p className="mb-8 max-w-xs text-xs font-light text-stone-500">Explore our curated drapes and find tailored essentials designed to elevate your everyday flow.</p>
                <Button onClick={goToShop}>Shop The Collection</Button>
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="flex flex-col gap-4 border-t border-brand-dark/10 bg-white p-6">
              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex justify-between text-stone-500"><span>Subtotal</span><span className="font-medium text-brand-dark">{formatKES(subtotal)}</span></div>
                {appliedDiscount > 0 && <div className="flex justify-between rounded-lg bg-emerald-50 p-2 font-medium text-emerald-700"><span>Coupon (10%)</span><span>-{formatKES(discountAmount)}</span></div>}
                <div className="flex justify-between text-stone-500"><span>Standard Shipping</span><span className="font-medium text-brand-dark">{deliveryFee === 0 ? "Complimentary" : formatKES(deliveryFee)}</span></div>
                <Separator />
                <div className="flex justify-between text-sm font-semibold text-brand-dark"><span>Order Total</span><span>{formatKES(total)}</span></div>
              </div>
              <Button onClick={goToCheckout} className="w-full">
                <Lock data-icon="inline-start" /> Checkout Securely
              </Button>
              <div className="flex items-center justify-center gap-4 pt-2 text-[9px] font-light uppercase tracking-wider text-stone-400">
                <span>Secure Payments</span><span>14-Day Returns</span><span>Fast Courier</span>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function QuantityMini({ value, onChange }: { value: number; onChange: (quantity: number) => void }) {
  return (
    <div className="flex items-center rounded-full border border-brand-dark/15 p-0.5">
      <button onClick={() => onChange(Math.max(1, value - 1))} className="rounded-full p-1 text-stone-400 transition-colors hover:bg-stone-50 hover:text-brand-dark" aria-label="Decrease quantity">
        <Minus className="h-3 w-3" />
      </button>
      <span className="w-6 text-center text-xs font-semibold text-brand-dark">{value}</span>
      <button onClick={() => onChange(value + 1)} className="rounded-full p-1 text-stone-400 transition-colors hover:bg-stone-50 hover:text-brand-dark" aria-label="Increase quantity">
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}
