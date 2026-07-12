"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type PaymentMethod = "mpesa" | "card";

export default function PaymentMethodSelector({ value, onChange }: { value: PaymentMethod; onChange: (value: PaymentMethod) => void }) {
  return (
    <RadioGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {[
        { id: "mpesa" as const, title: "M-Pesa STK Push", badge: "Primary", desc: "Instantly request a secure PIN popup on your mobile device. Nairobi courier dispatched instantly." },
        { id: "card" as const, title: "Visa / Mastercard", desc: "Pay securely using local or international credit cards. Guaranteed and encrypted by Paystack." },
      ].map(method => (
        <label
          key={method.id}
          className={`relative flex cursor-pointer gap-4 rounded-2xl border p-5 text-left transition-all duration-300 ${value === method.id ? "scale-[1.01] border-brand-gold bg-brand-gold/5 shadow-md" : "border-brand-dark/10 bg-white"}`}
        >
          <RadioGroupItem name="payment" checked={value === method.id} onChange={() => onChange(method.id)} className="mt-0.5" />
          <span className="flex flex-col gap-1">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
              {method.title}
              {"badge" in method && method.badge && <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[8px] font-bold uppercase text-emerald-800">{method.badge}</span>}
            </span>
            <span className="text-[10px] font-light leading-snug text-stone-500">{method.desc}</span>
          </span>
        </label>
      ))}
    </RadioGroup>
  );
}
