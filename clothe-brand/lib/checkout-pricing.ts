import type { CheckoutPayload } from "@/types/checkout";
import { checkoutProductsSchema } from "@/lib/catalog-contracts";
import { sanityFetch } from "@/src/sanity/lib/client";
import { CHECKOUT_PRODUCTS_QUERY } from "@/src/sanity/lib/queries";

export type CheckoutQuote = {
  subtotal: number;
  deliveryFee: number;
  total: number;
  items: Array<
    CheckoutPayload["cart"][number] & {
      productDocumentId: string;
      name: string;
      productImage: string | null;
      unitPrice: number;
    }
  >;
};

export class CheckoutPricingError extends Error {}

export function calculateDeliveryFee(subtotal: number) {
  return subtotal === 0 || subtotal >= 15_000 ? 0 : 500;
}

export async function createCheckoutQuote(cart: CheckoutPayload["cart"]): Promise<CheckoutQuote> {
  const productIds = [...new Set(cart.map(item => item.productId))];
  const products = checkoutProductsSchema.parse(await sanityFetch({
    query: CHECKOUT_PRODUCTS_QUERY,
    params: { productIds },
    revalidate: false,
  }));
  const productsById = new Map(products.map(product => [product.id, product]));

  const items = cart.map(item => {
    const product = productsById.get(item.productId);

    if (!product || !Number.isFinite(product.price) || product.price <= 0) {
      throw new CheckoutPricingError("One or more products are no longer available.");
    }
    if (!(product.sizes ?? []).includes(item.size)) {
      throw new CheckoutPricingError(`${product.title} is not available in the selected size.`);
    }
    if (!(product.colors ?? []).includes(item.color)) {
      throw new CheckoutPricingError(`${product.title} is not available in the selected colour.`);
    }

    return {
      ...item,
      productDocumentId: product.productDocumentId,
      name: product.title,
      productImage: product.productImage,
      unitPrice: product.price,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee = calculateDeliveryFee(subtotal);

  return { subtotal, deliveryFee, total: subtotal + deliveryFee, items };
}
