import type { Product } from "@/utils/types";

type SanityImageAsset = {
  url?: string;
};

type SanityProductImage = {
  image?: {
    asset?: SanityImageAsset;
  };
  alt?: string;
};

export type SanityProduct = {
  _id?: string;
  title?: string;
  slug?: string;
  price?: number;
  compareAtPrice?: number;
  isNewArrival?: boolean;
  description?: string;
  details?: string[];
  images?: SanityProductImage[];
  category?: {
    title?: string;
  };
  collections?: {
    title?: string;
  }[];
  colors?: {
    name?: string;
    hex?: string;
  }[];
  sizes?: {
    label?: string;
    sortOrder?: number;
  }[];
};

export type SanityCollectionCard = {
  _id?: string;
  title?: string;
  slug?: string;
  description?: string;
  heroImage?: {
    asset?: SanityImageAsset;
  };
};

const fallbackImage = "/aurea-mark.svg";

export function mapSanityProduct(product: SanityProduct): Product {
  const images = product.images?.map(item => item.image?.asset?.url).filter((url): url is string => Boolean(url)) ?? [];
  const colors = product.colors?.map(color => ({
    name: color.name || "Default",
    value: color.hex || "#1C1A17",
  })) ?? [];
  const sizes = [...(product.sizes ?? [])]
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map(size => size.label)
    .filter((label): label is string => Boolean(label));

  return {
    id: product.slug || product._id || "",
    name: product.title || "Untitled Product",
    category: product.category?.title || "Collection",
    price: product.price ?? 0,
    badge: product.isNewArrival ? "New In" : undefined,
    images: images.length > 0 ? images : [fallbackImage],
    colors: colors.length > 0 ? colors : [{ name: "Default", value: "#1C1A17" }],
    sizes: sizes.length > 0 ? sizes : ["One Size"],
    rating: 0,
    reviewsCount: 0,
    description: product.description || "",
    details: product.details ?? [],
    care: [],
    inStock: true,
  };
}

export function mapSanityProducts(products: SanityProduct[] | null | undefined): Product[] {
  return (products ?? []).map(mapSanityProduct).filter(product => product.id);
}

export function mapSanityCollection(collection: SanityCollectionCard) {
  return {
    name: collection.title || "Collection",
    description: collection.description || "",
    image: collection.heroImage?.asset?.url || fallbackImage,
    slug: collection.slug || collection._id || "collection",
  };
}
