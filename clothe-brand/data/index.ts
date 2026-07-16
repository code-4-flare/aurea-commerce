import type { Product } from "@/types/commerce";
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "sig-bomber",
    name: "Signature Bomber Jacket",
    category: "Outerwear",
    price: 13500,
    badge: "Best Seller",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Charcoal Black", value: "#1C1A17" },
      { name: "Olive Drab", value: "#4B5320" },
      { name: "Raw Umber", value: "#735135" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.8,
    reviewsCount: 124,
    description:
      "An elevated interpretation of a classic military silhouette. Crafted from water-resistant satin-finish twill with premium ribbed trim, bespoke hardware, and an incredibly soft interior lining. This signature jacket bridges heavy heritage and clean modern styling seamlessly.",
    details: [
      "Water-resistant nylon-satin outer shell",
      "Two-way heavy-gauge metal zip closure with storm flap",
      "Concealed snap-button side welt pockets",
      "Rib-knit collar, cuffs, and bottom band",
      "Fully lined with internal utility pocket",
      "Dry clean only",
    ],
    care: [
      "Avoid contact with water and moisture",
      "Professionally leather/satin clean only",
      "Do not bleach",
      "Do not tumble dry",
      "Iron on low heat setting if necessary",
    ],
    inStock: true,
  },
  {
    id: "linen-blazer",
    name: "Linen Blend Blazer",
    category: "Outerwear",
    price: 12000,
    badge: "New In",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Oatmeal Cream", value: "#EFECE4" },
      { name: "Soft Sand", value: "#D1C7BD" },
      { name: "Charcoal Black", value: "#1C1A17" },
    ],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.6,
    reviewsCount: 42,
    description:
      "Unstructured, relaxed elegance designed for warm afternoons and breezy dinners. Crafted in a lightweight linen-blend fabric with a natural crinkle texture that keeps its form while flowing beautifully.",
    details: [
      "Unlined construction for maximum breathability",
      "Double back vents for comfort",
      "Patch pockets at hip; single chest pocket",
      "Three-button cuff detailing",
      "65% Linen, 35% Cotton Blend",
    ],
    care: ["Hand wash cold or gentle dry clean", "Lay flat to dry", "Steam iron only; do not press flat to preserve original texture"],
    inStock: true,
  },
  {
    id: "drape-midi",
    name: "Drape Midi Dress",
    category: "Dresses",
    price: 11200,
    badge: "Editorial Pick",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Champagne Silk", value: "#E9DCC9" },
      { name: "Forest Moss", value: "#2C3E35" },
      { name: "Midnight Navy", value: "#1A2536" },
    ],
    sizes: ["XS", "S", "M", "L"],
    rating: 4.9,
    reviewsCount: 88,
    description:
      "An elegant, fluid wrap-style midi dress that contours beautifully. Spun from double-faced satin with a delicate drape detailing at the shoulder and hip, falling to a clean, asymmetrical hemline.",
    details: [
      "Concealed side zipper closure",
      "Gathered shoulder draping and sash detail",
      "Lined bodice for comfort and security",
      "High-grade premium satin fibers",
      "100% Premium Satin",
    ],
    care: ["Dry clean recommended", "Iron inside-out on silk mode"],
    inStock: true,
  },
  {
    id: "rib-polo",
    name: "Ribbed Polo Knit",
    category: "Knitwear",
    price: 8500,
    badge: "New In",
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Soft Sage", value: "#B4C4B8" },
      { name: "Oatmeal Cream", value: "#EFECE4" },
      { name: "Charcoal Black", value: "#1C1A17" },
    ],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.5,
    reviewsCount: 31,
    description:
      "A luxurious knitwear staple featuring a deep rib construction and an unstructured collar. Spun from ultra-fine extra-long cotton yarn that is cool to the touch and resistant to pilling.",
    details: [
      "Super-soft ribbed textured weave",
      "Open collar design without buttons",
      "Fitted sleeves and straight hem",
      "100% Premium Soft Cotton",
    ],
    care: ["Hand wash cold in mild detergent", "Roll in towel to extract moisture; dry flat", "Store folded; do not hang"],
    inStock: true,
  },
  {
    id: "wide-trousers",
    name: "Wide Leg Trousers",
    category: "Trousers",
    price: 9800,
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Soft Sand", value: "#D1C7BD" },
      { name: "Charcoal Black", value: "#1C1A17" },
      { name: "Soft Sage", value: "#B4C4B8" },
    ],
    sizes: ["26", "28", "30", "32", "34"],
    rating: 4.7,
    reviewsCount: 65,
    description:
      "Modern tailored pants featuring double pleats and an ultra-chic wide leg drape. Perfect for anchoring everything from sharp knitwear to lightweight summer blouses.",
    details: [
      "High-rise with clean waistband",
      "Front pleats and pressed creases",
      "Slanted side pockets and back welt pockets",
      "Premium hook-and-bar internal closure",
      "Linen-blend premium weave",
    ],
    care: ["Dry clean or cold machine wash on delicate cycle", "Hang dry immediately"],
    inStock: true,
  },
  {
    id: "relaxed-shirt",
    name: "Relaxed Shirt",
    category: "Shirts",
    price: 7200,
    images: [
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Pure White", value: "#FFFFFF" },
      { name: "Sky Blue", value: "#D4E6F1" },
      { name: "Soft Sand", value: "#D1C7BD" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.4,
    reviewsCount: 29,
    description:
      "An understated button-down with dropped shoulders and a curved long hem. Woven in fine poplin cotton that holds its editorial drape with minimal wrinkling.",
    details: ["Dropped shoulder seams", "Mother-of-pearl buttons", "Single oversized chest patch pocket", "100% Cotton Poplin"],
    care: ["Wash inside-out in lukewarm water", "Iron on medium cotton heat setting"],
    inStock: true,
  },
  {
    id: "leather-sneakers",
    name: "Minimal Leather Sneakers",
    category: "Accessories",
    price: 14500,
    badge: "Limited Edition",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Alabaster White", value: "#FAF5EF" },
      { name: "Charcoal Black", value: "#1C1A17" },
    ],
    sizes: ["39", "40", "41", "42", "43", "44"],
    rating: 4.8,
    reviewsCount: 57,
    description:
      "Stripped of all visual noise, these sleek sneakers are crafted from full-grain leather in a low-top silhouette. They feature robust rubber outsoles and ultra-soft leather insoles.",
    details: [
      "Full-grain leather upper and interior",
      "Robust rubber cup-soles",
      "Embossed minimal serial code in gold leaf lettering",
      "Crafted in premium small batches",
    ],
    care: ["Wipe with soft clean cloth", "Use premium leather cream occasionally"],
    inStock: true,
  },
  {
    id: "crop-jacket",
    name: "Structured Crop Jacket",
    category: "Outerwear",
    price: 15000,
    badge: "Editorial Pick",
    images: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Oatmeal Cream", value: "#EFECE4" },
      { name: "Forest Moss", value: "#2C3E35" },
    ],
    sizes: ["XS", "S", "M", "L"],
    rating: 4.7,
    reviewsCount: 19,
    description:
      "A tailored statement item designed with sharp architectural padded shoulders, a high standing collar, and an elegant cropped waistline. Spun from structured boiled wool to hold its geometric form.",
    details: ["Broad structured shoulders", "Concealed snap-button wrap closure", "High cropped hem", "80% Wool, 20% Soft Blend"],
    care: ["Dry clean only", "Do not steam or iron shoulders directly; steam from underside"],
    inStock: true,
  },
  {
    id: "satin-skirt",
    name: "Satin Slip Skirt",
    category: "Skirts",
    price: 8900,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Forest Moss", value: "#2C3E35" },
      { name: "Champagne Silk", value: "#E9DCC9" },
      { name: "Charcoal Black", value: "#1C1A17" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.6,
    reviewsCount: 38,
    description:
      "Cut on the bias for a beautiful natural stretch that skims the silhouette elegantly. Spun from heavy-weight luster satin with an elastic waist band that remains invisible and flat.",
    details: ["Bias cut fabric for beautiful flow", "Internal elastic flat-lay waist band", "Hits mid-calf", "95% Polyester Satin, 5% Elastane"],
    care: ["Wash cold on gentle cycle inside a laundry bag", "Line dry in shade"],
    inStock: true,
  },
  {
    id: "oversized-shirt",
    name: "Oversized Cotton Shirt",
    category: "Shirts",
    price: 6800,
    badge: "New In",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Pure White", value: "#FFFFFF" },
      { name: "Sky Blue", value: "#D4E6F1" },
      { name: "Charcoal Black", value: "#1C1A17" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    rating: 4.3,
    reviewsCount: 51,
    description:
      "An effortlessly oversized casual staple. Perfect for throwing over a fitted knit or tucking loosely into wide trousers. Woven in a fine cotton slub texture that breathes wonderfully.",
    details: ["Oversized boyfriend fit with broad cuffs", "Chest pocket detailing", "Slightly longer back curved hem", "100% Cotton yarn"],
    care: ["Cold gentle machine wash", "Tumble dry low or hang in fresh air"],
    inStock: false,
  },
];

export const LOOKBOOK_IMAGES = [
  {
    id: "lb-1",
    url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
    caption: "The Quiet Escape: Sunset in Lamu",
  },
  {
    id: "lb-2",
    url: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=800&auto=format&fit=crop",
    caption: "Textural Pleats & Earthy Tones",
  },
  {
    id: "lb-3",
    url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop",
    caption: "Summer Linens Under Clear Skies",
  },
  {
    id: "lb-4",
    url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    caption: "Tailored Simplicity, Refined by Hand",
  },
];

export const COLLECTIONS = [
  {
    name: "The Summer Linen Series",
    description: "Breezy silhouettes and pure flax weaves crafted for sunset warmth.",
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop",
    slug: "linen",
  },
  {
    name: "Urban Outerwear",
    description: "Structured lines and rich premium hardware for seasonal shifts.",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800&auto=format&fit=crop",
    slug: "outerwear",
  },
  {
    name: "Tailored Essentials",
    description: "Fluid trousers and draped silk midi dresses. Minimalist sculpture.",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop",
    slug: "essentials",
  },
];

export const TRUST_INDICATORS = [
  { title: "Premium Quality", desc: "Premium finishing & quality materials" },
  { title: "Easy Returns", desc: "Easy returns within 14 days" },
  { title: "Secure Payments", desc: "M-Pesa, card & bank transfers" },
  { title: "Fast Delivery", desc: "Same-day in Nairobi, next-day nationwide" },
];
