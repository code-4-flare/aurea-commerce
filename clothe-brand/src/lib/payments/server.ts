import "server-only";

import { PaystackError, verifyPaystackTransactionWithPayload } from "@/lib/paystack";
import type { PaystackWebhookEvent } from "@/lib/paystack-webhook";
import {
  findOrderByReference,
  reconcileOrderPayment,
  recordPaymentEvent,
} from "@/src/lib/orders/server";
import type { PaymentVerificationResult } from "@/types/payment";

export async function verifyAndReconcilePayment(reference: string): Promise<PaymentVerificationResult> {
  const order = await findOrderByReference(reference);

  try {
    const { transaction, rawPayload } = await verifyPaystackTransactionWithPayload(reference);

    await recordPaymentEvent({
      orderId: order?.id,
      reference,
      eventType: "verification",
      status: transaction.status,
      amount: transaction.amount,
      currency: transaction.currency,
      rawPayload,
    });

    if (!order) {
      return {
        status: "failed",
        message: "No order was found for this payment reference.",
      };
    }

    return reconcileOrderPayment(order, transaction);
  } catch (error) {
    if (error instanceof PaystackError) {
      await recordPaymentEvent({
        orderId: order?.id,
        reference,
        eventType: "verification_error",
        status: "error",
        rawPayload: error.payload ?? { message: error.message },
      });
    }
    throw error;
  }
}

export async function reconcilePaystackWebhook(rawPayload: unknown, event: PaystackWebhookEvent) {
  const order = await findOrderByReference(event.data.reference);

  await recordPaymentEvent({
    orderId: order?.id,
    reference: event.data.reference,
    eventType: event.event,
    status: event.data.status,
    amount: event.data.amount,
    currency: event.data.currency,
    rawPayload,
  });

  if (!order || event.event !== "charge.success") return;
  await reconcileOrderPayment(order, event.data);
}
