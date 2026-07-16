"use client";

import { Loader2, Lock, MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { formatKES } from "@/lib/utils";
import { readApiResponse, whatsappInquiryResponseSchema } from "@/lib/api-contracts";
import { useCommerceStore } from "@/store/use-commerce-store";

const FREE_DELIVERY_THRESHOLD = 15000;

export default function CartDrawer() {
  const router = useRouter();
  const isOpen = useCommerceStore(state => state.isCartOpen);
  const closeCart = useCommerceStore(state => state.closeCart);
  const cartItems = useCommerceStore(state => state.cartItems);
  const updateCartQuantity = useCommerceStore(state => state.updateCartQuantity);
  const removeCartItem = useCommerceStore(state => state.removeCartItem);
  const [isOpeningWhatsApp, setIsOpeningWhatsApp] = useState(false);
  const whatsappRequestInFlight = useRef(false);

  const subtotal = useMemo(() => cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0), [cartItems]);
  const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 500;
  const total = subtotal + deliveryFee;
  const deliveryProgressPercent = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  const goToCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  const goToShop = () => {
    closeCart();
    router.push("/shop");
  };

  const openWhatsAppInquiry = async () => {
    if (whatsappRequestInFlight.current) return;
    whatsappRequestInFlight.current = true;
    const popup = window.open("about:blank", "_blank");
    if (popup) popup.opener = null;
    setIsOpeningWhatsApp(true);

    try {
      const response = await fetch("/api/checkout/whatsapp-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: cartItems.map(item => ({
            productId: item.product.id,
            size: item.selectedSize,
            color: item.selectedColor.name,
            quantity: item.quantity,
          })),
        }),
      });
      const data = await readApiResponse(response, whatsappInquiryResponseSchema);
      if (!response.ok || "message" in data) {
        throw new Error("message" in data ? data.message : "Unable to prepare WhatsApp.");
      }

      if (popup) popup.location.assign(data.whatsappUrl);
      else window.location.assign(data.whatsappUrl);
      closeCart();
    } catch (error) {
      popup?.close();
      toast.error(error instanceof Error ? error.message : "Unable to prepare your WhatsApp order.");
    } finally {
      whatsappRequestInFlight.current = false;
      setIsOpeningWhatsApp(false);
    }
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
                <div className="flex justify-between text-stone-500"><span>Standard Shipping</span><span className="font-medium text-brand-dark">{deliveryFee === 0 ? "Complimentary" : formatKES(deliveryFee)}</span></div>
                <Separator />
                <div className="flex justify-between text-sm font-semibold text-brand-dark"><span>Order Total</span><span>{formatKES(total)}</span></div>
              </div>
              <Button onClick={goToCheckout} className="w-full">
                <Lock data-icon="inline-start" /> Checkout Securely
              </Button>
              <Button type="button" variant="outline" onClick={openWhatsAppInquiry} disabled={isOpeningWhatsApp} className="w-full">
                {isOpeningWhatsApp ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <MessageCircle data-icon="inline-start" aria-hidden="true" />}
                {isOpeningWhatsApp ? "Preparing WhatsApp..." : "Order via WhatsApp"}
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
