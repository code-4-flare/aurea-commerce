import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Product } from "@/types/commerce";

export default function ProductDetailsAccordion({ product }: { product: Product }) {
  return (
    <Accordion type="single" defaultValue="details" className="divide-y divide-brand-dark/10 border-t border-brand-dark/10">
      <AccordionItem value="details" className="py-4">
        <AccordionTrigger className="flex w-full items-center justify-between text-left text-xs font-bold uppercase tracking-widest text-brand-dark">
          Details & Care
        </AccordionTrigger>
        <AccordionContent className="mt-3">
          <ul className="flex list-disc flex-col gap-1.5 pl-4 text-xs font-light text-stone-600">
            {product.details.map(detail => <li key={detail}>{detail}</li>)}
            {product.care.map(careItem => <li key={careItem} className="italic text-brand-gold">{careItem}</li>)}
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="shipping" className="py-4">
        <AccordionTrigger className="flex w-full items-center justify-between text-left text-xs font-bold uppercase tracking-widest text-brand-dark">
          Delivery & Free Returns
        </AccordionTrigger>
        <AccordionContent className="mt-3">
          <p className="text-xs font-light leading-relaxed text-stone-600">
            We offer complimentary home delivery on orders over KSh 15,000 within Kenya. Items returned within 14 days in their original unworn
            condition are eligible for full refund or complimentary sizing replacement.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
