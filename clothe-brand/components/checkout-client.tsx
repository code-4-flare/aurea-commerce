"use client";

import { Loader2, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

import OrderSummary from "@/components/order-summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { checkoutCounties, checkoutSchema, zodFieldErrors } from "@/lib/checkout-schema";
import { formatKES } from "@/lib/utils";
import { useCommerceStore } from "@/store/use-commerce-store";

type CheckoutForm = {
  fullName: string;
  phone: string;
  email: string;
  county: string;
  townArea: string;
  streetLandmark: string;
  deliveryNotes: string;
};

type CheckoutErrorResponse = {
  message?: string;
  fieldErrors?: Record<string, string>;
};

const initialForm: CheckoutForm = {
  fullName: "",
  phone: "",
  email: "",
  county: "Nairobi",
  townArea: "",
  streetLandmark: "",
  deliveryNotes: "",
};

const fieldPaths: Record<keyof CheckoutForm, string> = {
  fullName: "customer.fullName",
  phone: "customer.phone",
  email: "customer.email",
  county: "delivery.county",
  townArea: "delivery.town",
  streetLandmark: "delivery.address",
  deliveryNotes: "delivery.notes",
};

export default function CheckoutClient() {
  const cartItems = useCommerceStore(state => state.cartItems);
  const [isPaying, setIsPaying] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const total = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    return subtotal + (subtotal === 0 || subtotal >= 15_000 ? 0 : 500);
  }, [cartItems]);

  const update = (key: keyof CheckoutForm, value: string) => {
    setForm(previous => ({ ...previous, [key]: value }));
    setFieldErrors(previous => {
      const next = { ...previous };
      delete next[fieldPaths[key]];
      return next;
    });
  };

  const handlePay = async (event: FormEvent) => {
    event.preventDefault();

    const payload = {
      customer: {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
      },
      delivery: {
        county: form.county,
        town: form.townArea,
        address: form.streetLandmark,
        notes: form.deliveryNotes,
      },
      cart: cartItems.map(item => ({
        productId: item.product.id,
        size: item.selectedSize,
        color: item.selectedColor.name,
        quantity: item.quantity,
      })),
    };
    const validation = checkoutSchema.safeParse(payload);

    if (!validation.success) {
      setFieldErrors(zodFieldErrors(validation.error));
      toast.error("Check the highlighted checkout details.");
      return;
    }

    setFieldErrors({});
    setIsPaying(true);
    try {
      const response = await fetch("/api/checkout/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      const data = (await response.json()) as CheckoutErrorResponse & { authorizationUrl?: string };

      if (!response.ok || !data.authorizationUrl) {
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        throw new Error(data.message || "Unable to start checkout.");
      }

      window.location.assign(data.authorizationUrl);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Unable to start checkout.");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
      <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-wider text-stone-500">
        <Link href="/shop" className="hover:text-brand-gold">
          Shop
        </Link>
        <span>/</span>
        <span className="font-medium text-brand-dark">Checkout</span>
      </nav>
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <form
          onSubmit={handlePay}
          noValidate
          className="flex flex-col gap-8 rounded-2xl border border-brand-dark/5 bg-white/40 p-6 backdrop-blur-sm md:p-8 lg:col-span-7"
        >
          {Object.keys(fieldErrors).length > 0 && (
            <div role="alert" className="border-l-2 border-red-700 bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-900">
              Some checkout details need your attention. Review the fields marked below.
            </div>
          )}

          <CheckoutSection title="01. Personal Information">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field id="full-name" label="Full Name *" error={fieldErrors["customer.fullName"]}>
                <Input
                  id="full-name"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={event => update("fullName", event.target.value)}
                  placeholder="e.g. Amina Kenyatta"
                  aria-invalid={Boolean(fieldErrors["customer.fullName"])}
                  aria-describedby={fieldErrors["customer.fullName"] ? "full-name-error" : undefined}
                />
              </Field>
              <Field id="phone" label="Phone Number *" error={fieldErrors["customer.phone"]}>
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={event => update("phone", event.target.value)}
                  placeholder="e.g. 0712 345 678"
                  aria-invalid={Boolean(fieldErrors["customer.phone"])}
                  aria-describedby={fieldErrors["customer.phone"] ? "phone-error" : undefined}
                />
              </Field>
            </div>
            <Field
              id="email"
              label="Email Address *"
              error={fieldErrors["customer.email"]}
              helper="Paystack sends your payment receipt to this address."
            >
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={event => update("email", event.target.value)}
                placeholder="name@domain.com"
                aria-invalid={Boolean(fieldErrors["customer.email"])}
                aria-describedby={fieldErrors["customer.email"] ? "email-error" : "email-helper"}
              />
            </Field>
          </CheckoutSection>

          <CheckoutSection title="02. Delivery Coordinates">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field id="county" label="County *" error={fieldErrors["delivery.county"]}>
                <Select
                  id="county"
                  value={form.county}
                  onValueChange={value => update("county", value)}
                  className="w-full rounded-xl py-3"
                  aria-invalid={Boolean(fieldErrors["delivery.county"])}
                >
                  {checkoutCounties.map(county => (
                    <SelectItem key={county} value={county}>
                      {county} County
                    </SelectItem>
                  ))}
                </Select>
              </Field>
              <Field id="town" label="Town / Area *" error={fieldErrors["delivery.town"]}>
                <Input
                  id="town"
                  autoComplete="address-level2"
                  value={form.townArea}
                  onChange={event => update("townArea", event.target.value)}
                  placeholder="e.g. Westlands, Nyali, Kilimani"
                  aria-invalid={Boolean(fieldErrors["delivery.town"])}
                  aria-describedby={fieldErrors["delivery.town"] ? "town-error" : undefined}
                />
              </Field>
            </div>
            <Field id="address" label="Street Address & Nearest Landmark *" error={fieldErrors["delivery.address"]}>
              <Input
                id="address"
                autoComplete="street-address"
                value={form.streetLandmark}
                onChange={event => update("streetLandmark", event.target.value)}
                placeholder="e.g. General Mathenge Rd, opposite Sarit Centre"
                aria-invalid={Boolean(fieldErrors["delivery.address"])}
                aria-describedby={fieldErrors["delivery.address"] ? "address-error" : undefined}
              />
            </Field>
            <Field id="notes" label="Delivery Notes (Optional)" error={fieldErrors["delivery.notes"]}>
              <Input
                id="notes"
                value={form.deliveryNotes}
                onChange={event => update("deliveryNotes", event.target.value)}
                placeholder="e.g. Deliver after 2 PM, call before arrival"
                aria-invalid={Boolean(fieldErrors["delivery.notes"])}
                aria-describedby={fieldErrors["delivery.notes"] ? "notes-error" : undefined}
              />
            </Field>
          </CheckoutSection>

          <CheckoutSection title="03. Secure Payment">
            <div className="flex gap-3 border-y border-brand-gold/20 py-5">
              <ShieldCheck className="h-5 w-5 flex-shrink-0 text-brand-gold" aria-hidden="true" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-brand-dark">Complete payment securely with Paystack</p>
                <p className="text-[11px] font-light leading-relaxed text-stone-500">
                  Choose M-Pesa or card on Paystack’s secure checkout. Aurea never receives your card details.
                </p>
              </div>
            </div>
          </CheckoutSection>

          <Button type="submit" disabled={isPaying || cartItems.length === 0} className="w-full active:scale-[0.98]">
            {isPaying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-brand-gold" aria-hidden="true" /> Preparing secure checkout...
              </>
            ) : (
              <>
                <Lock data-icon="inline-start" aria-hidden="true" /> Pay securely ({formatKES(total)})
              </>
            )}
          </Button>
        </form>
        <div className="lg:col-span-5">
          <OrderSummary cartItems={cartItems} />
        </div>
      </div>
    </div>
  );
}

function CheckoutSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="border-b border-stone-100 pb-2 font-serif text-lg font-normal text-brand-dark">{title}</h2>
      {children}
    </section>
  );
}

function Field({ id, label, helper, error, children }: { id: string; label: string; helper?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-[11px] leading-relaxed text-red-700">
          {error}
        </p>
      ) : helper ? (
        <p id={`${id}-helper`} className="text-[10px] leading-relaxed text-stone-400">
          {helper}
        </p>
      ) : null}
    </div>
  );
}
