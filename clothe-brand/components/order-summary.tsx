import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import { formatKES } from "@/lib/utils";
import { CartItem } from "@/utils/types";

export default function OrderSummary({ cartItems }: { cartItems: CartItem[] }) {
  const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal === 0 || subtotal >= 15000 ? 0 : 500;
  const total = subtotal + deliveryFee;

  return (
    <div className="sticky top-28 flex flex-col gap-6 rounded-2xl border border-brand-dark/5 bg-white p-6 shadow-sm md:p-8">
      <h2 className="border-b border-stone-100 pb-3 font-serif text-lg font-normal text-brand-dark">Review Order</h2>
      <div className="max-h-[40vh] divide-y divide-stone-100 overflow-y-auto pr-2">
        {cartItems.map(item => (
          <div key={item.id} className="flex gap-4 py-3 first:pt-0 last:pb-0">
            <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded bg-stone-100">
              <Image width={150} height={200} src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover object-center" referrerPolicy="no-referrer" />
            </div>
            <div className="flex flex-grow flex-col justify-between text-xs">
              <div>
                <h3 className="font-medium tracking-tight text-brand-dark">{item.product.name}</h3>
                <p className="mt-0.5 text-[10px] uppercase tracking-widest text-stone-400">Size: {item.selectedSize} | Color: {item.selectedColor.name}</p>
              </div>
              <div className="mt-1 flex items-center justify-between text-stone-500">
                <span>Qty: {item.quantity}</span>
                <span className="font-semibold text-brand-dark">{formatKES(item.product.price * item.quantity)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 text-xs">
        <div className="flex justify-between text-stone-500"><span>Subtotal Items</span><span className="font-medium text-brand-dark">{formatKES(subtotal)}</span></div>
        <div className="flex justify-between text-stone-500"><span>Standard Courier Delivery</span><span className="font-medium text-brand-dark">{deliveryFee === 0 ? "Complimentary" : formatKES(deliveryFee)}</span></div>
        <Separator />
        <div className="flex justify-between text-sm font-semibold text-brand-dark"><span>Order Grand Total</span><span>{formatKES(total)}</span></div>
      </div>
    </div>
  );
}
