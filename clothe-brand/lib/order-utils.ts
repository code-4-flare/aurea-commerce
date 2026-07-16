import crypto from "node:crypto";

export function generateOrderNumber(now = new Date(), suffix = crypto.randomBytes(4).toString("hex").toUpperCase()) {
  const date = [now.getUTCFullYear(), String(now.getUTCMonth() + 1).padStart(2, "0"), String(now.getUTCDate()).padStart(2, "0")].join("");
  return `AUR-${date}-${suffix}`;
}

export function paystackAmountFor(totalKsh: number) {
  if (!Number.isSafeInteger(totalKsh) || totalKsh < 0 || !Number.isSafeInteger(totalKsh * 100)) {
    throw new Error("Order total must be a non-negative safe integer.");
  }
  return totalKsh * 100;
}

export function paymentMatchesOrder(
  payment: { status: string; currency: string; amount: number },
  order: { currency: string; total: number },
) {
  return payment.status === "success" && payment.currency === order.currency && payment.amount === paystackAmountFor(order.total);
}
