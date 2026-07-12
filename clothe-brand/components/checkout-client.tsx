"use client";

import { CheckCircle2, Loader2, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

import OrderSummary from "@/components/order-summary";
import PaymentMethodSelector, { PaymentMethod } from "@/components/payment-method-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { formatKES } from "@/lib/utils";
import { useCommerceStore } from "@/store/use-commerce-store";

export default function CheckoutClient() {
  const cartItems = useCommerceStore(state => state.cartItems);
  const clearCart = useCommerceStore(state => state.clearCart);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [isPaying, setIsPaying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", county: "Nairobi", townArea: "", streetLandmark: "", deliveryNotes: "" });
  const total = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    return subtotal + (subtotal === 0 || subtotal >= 15000 ? 0 : 500);
  }, [cartItems]);

  const update = (key: keyof typeof form, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handlePay = (event: FormEvent) => {
    event.preventDefault();
    setIsPaying(true);
    window.setTimeout(() => {
      setIsPaying(false);
      setShowSuccess(true);
      clearCart();
    }, 900);
  };

  if (showSuccess) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <div className="flex flex-col gap-6 rounded-3xl border border-brand-dark/5 bg-white p-8 shadow-2xl md:p-12">
          <div className="flex justify-center"><CheckCircle2 className="h-16 w-16 stroke-[1.5] text-emerald-600" /></div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">Authorization Received</span>
            <h2 className="font-serif text-3xl font-normal text-brand-dark">Aurea Order Secured</h2>
            <p className="mx-auto max-w-sm text-xs font-light text-stone-500">Your mock payment of <strong className="text-brand-dark">{formatKES(total)}</strong> has been verified.</p>
          </div>
          <Button onClick={() => location.assign("/shop")} className="w-full">Continue Journey</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
      <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-wider text-stone-500">
        <Link href="/shop" className="hover:text-brand-gold">Shop</Link><span>/</span><span className="font-medium text-brand-dark">Checkout</span>
      </nav>
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <form onSubmit={handlePay} className="flex flex-col gap-8 rounded-2xl border border-brand-dark/5 bg-white/40 p-6 backdrop-blur-sm md:p-8 lg:col-span-7">
          <CheckoutSection title="01. Personal Information">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Full Name *"><Input required value={form.fullName} onChange={event => update("fullName", event.target.value)} placeholder="e.g. Amina Kenyatta" /></Field>
              <Field label="Phone Number *"><Input required type="tel" value={form.phone} onChange={event => update("phone", event.target.value)} placeholder="e.g. 0712345678" /></Field>
            </div>
            <Field label="Email Address (Optional)"><Input type="email" value={form.email} onChange={event => update("email", event.target.value)} placeholder="name@domain.com" /></Field>
          </CheckoutSection>

          <CheckoutSection title="02. Delivery Coordinates">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="County *">
                <Select value={form.county} onValueChange={value => update("county", value)} className="w-full rounded-xl py-3">
                  {["Nairobi", "Mombasa", "Kiambu", "Machakos", "Kajiado", "Nakuru", "Kisumu", "Uasin Gishu", "Lamu"].map(county => <SelectItem key={county} value={county}>{county} County</SelectItem>)}
                </Select>
              </Field>
              <Field label="Town / Area *"><Input required value={form.townArea} onChange={event => update("townArea", event.target.value)} placeholder="e.g. Westlands, Nyali, Kilimani" /></Field>
            </div>
            <Field label="Street Address & Nearest Landmark *"><Input required value={form.streetLandmark} onChange={event => update("streetLandmark", event.target.value)} placeholder="e.g. General Mathenge Rd, opposite Sarit Centre" /></Field>
            <Field label="Delivery Notes (Optional)"><Input value={form.deliveryNotes} onChange={event => update("deliveryNotes", event.target.value)} placeholder="e.g. Deliver after 2 PM, call before arrival" /></Field>
          </CheckoutSection>

          <CheckoutSection title="03. Method of Settlement">
            <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
            {paymentMethod === "card" && (
              <div className="mt-4 grid gap-3 rounded-2xl border border-brand-dark/5 bg-white p-5">
                <Input placeholder="4000 1234 5678 9010" />
                <div className="grid grid-cols-2 gap-3"><Input placeholder="MM / YY" /><Input placeholder="CVV" maxLength={3} /></div>
              </div>
            )}
          </CheckoutSection>

          <div className="flex gap-3 rounded-xl border border-brand-gold/15 bg-brand-cream p-4">
            <ShieldCheck className="h-5 w-5 flex-shrink-0 text-brand-gold" />
            <p className="text-[11px] font-light leading-relaxed text-stone-500">This prototype keeps mock data only. No payment is processed and no customer data is submitted to a backend.</p>
          </div>
          <Button type="submit" disabled={isPaying || cartItems.length === 0} className="w-full">
            {isPaying ? <><Loader2 className="h-4 w-4 animate-spin text-brand-gold" /> Validating Transaction...</> : <><Lock data-icon="inline-start" /> {paymentMethod === "mpesa" ? `Pay with M-Pesa (${formatKES(total)})` : `Authorize Card (${formatKES(total)})`}</>}
          </Button>
        </form>
        <div className="lg:col-span-5"><OrderSummary cartItems={cartItems} /></div>
      </div>
    </div>
  );
}

function CheckoutSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="flex flex-col gap-4"><h2 className="border-b border-stone-100 pb-2 font-serif text-lg font-normal text-brand-dark">{title}</h2>{children}</section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex flex-col gap-1.5"><Label>{label}</Label>{children}</div>;
}
