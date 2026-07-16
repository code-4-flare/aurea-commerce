export const paystackTransactionStatuses = [
  "abandoned",
  "failed",
  "ongoing",
  "pending",
  "processing",
  "queued",
  "reversed",
  "success",
] as const;

export type PaystackTransactionStatus = (typeof paystackTransactionStatuses)[number];

export type PaymentTransaction = {
  status: PaystackTransactionStatus;
  currency: string;
  amount: number;
};

type PaymentResultOrder = {
  orderId: string;
  orderNumber: string;
  message: string;
};

export type PaymentVerificationResult =
  | ({ status: "paid" } & PaymentResultOrder)
  | ({ status: "pending" } & PaymentResultOrder)
  | ({ status: "failed"; orderId?: string; orderNumber?: string; message: string });
