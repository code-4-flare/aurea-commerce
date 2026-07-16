export type ProductBadge = "New In" | "Best Seller" | "Limited Edition" | "Editorial Pick";

export type ColorSwatch = {
  name: string;
  value: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  badge?: ProductBadge;
  images: string[];
  colors: ColorSwatch[];
  sizes: string[];
  rating: number;
  reviewsCount: number;
  description: string;
  details: string[];
  care: string[];
  inStock: boolean;
};

export type CartItem = {
  id: string;
  product: Product;
  selectedColor: ColorSwatch;
  selectedSize: string;
  quantity: number;
};

export type FilterState = {
  category: string[];
  color: string[];
  size: string[];
  priceRange: [number, number];
  availability: "all" | "inStock" | "outOfStock";
};
