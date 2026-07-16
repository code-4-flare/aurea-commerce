import { z } from "zod";

export const checkoutProductsSchema = z.array(
  z.object({
    productDocumentId: z.string().min(1),
    id: z.string().min(1),
    title: z.string().min(1),
    price: z.number(),
    productImage: z.string().nullable(),
    colors: z.array(z.string()).nullable(),
    sizes: z.array(z.string()).nullable(),
  }),
);

export type CheckoutProduct = z.infer<typeof checkoutProductsSchema>;
