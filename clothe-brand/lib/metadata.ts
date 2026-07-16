import type { Metadata } from "next";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
};

export const brandName = "Aurea Nairobi";

export function createPageMetadata({ title, description, path, image, noIndex = false }: PageMetadataInput): Metadata {
  const normalizedDescription = description.length > 160 ? `${description.slice(0, 157).trimEnd()}...` : description;
  const resolvedImage = image || "/opengraph-image";
  const images = [{ url: resolvedImage, alt: title }];

  return {
    title,
    description: normalizedDescription,
    alternates: { canonical: path },
    robots: noIndex ? { index: false, follow: false, nocache: true } : undefined,
    openGraph: {
      type: "website",
      locale: "en_KE",
      siteName: brandName,
      title,
      description: normalizedDescription,
      url: path,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: normalizedDescription,
      images: [resolvedImage],
    },
  };
}
