import { category } from "./category";
import { collection } from "./collection";
import { color } from "./color";
import { deliveryPolicy } from "./deliveryPolicy";
import { homepage } from "./homepage";
import { lookbookItem } from "./lookbookItem";
import { product } from "./product";
import { productImage } from "./productImage";
import { seoFields } from "./seoFields";
import { siteSettings } from "./siteSettings";
import { size } from "./size";

export const schemaTypes = [
  productImage,
  seoFields,
  product,
  category,
  collection,
  color,
  size,
  homepage,
  siteSettings,
  deliveryPolicy,
  lookbookItem,
];

export {
  category,
  collection,
  color,
  deliveryPolicy,
  homepage,
  lookbookItem,
  product,
  productImage,
  seoFields,
  siteSettings,
  size,
};
