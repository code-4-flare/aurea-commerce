export interface ColorSwatch {
  name: string;
  value: string; // Hex value for color swatch
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number; // In KES
  badge?: "New In" | "Best Seller" | "Limited Edition" | "Editorial Pick";
  images: string[]; // Array of image URLs
  colors: ColorSwatch[];
  sizes: string[];
  rating: number;
  reviewsCount: number;
  description: string;
  details: string[];
  care: string[];
  inStock: boolean;
}

export interface CartItem {
  id: string; // Unique instance ID in cart (product.id + color + size)
  product: Product;
  selectedColor: ColorSwatch;
  selectedSize: string;
  quantity: number;
}

export interface FilterState {
  category: string[];
  color: string[];
  size: string[];
  priceRange: [number, number];
  availability: "all" | "inStock" | "outOfStock";
}
