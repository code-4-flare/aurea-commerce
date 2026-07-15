import { defineQuery } from "next-sanity";

const imageFields = /* groq */ `
  image {
    asset->{
      _id,
      url,
      metadata {
        lqip,
        dimensions { width, height }
      }
    },
    crop,
    hotspot
  },
  alt,
  caption
`;

const productFields = /* groq */ `
  _id,
  _createdAt,
  title,
  "slug": slug.current,
  status,
  sku,
  price,
  compareAtPrice,
  isNewArrival,
  publishedAt,
  description,
  details,
  images[] {
    _key,
    ${imageFields}
  },
  category->{
    _id,
    title,
    "slug": slug.current
  },
  collections[]->{
    _id,
    title,
    "slug": slug.current,
    description
  },
  colors[]->{
    _id,
    name,
    "slug": slug.current,
    hex
  },
  sizes[]->{
    _id,
    label,
    "slug": slug.current,
    sortOrder
  },
  seo
`;

export const ALL_ACTIVE_PRODUCTS_QUERY = defineQuery(/* groq */ `
  *[_type == "product" && (!defined(status) || status == "active") && defined(slug.current)]
  | order(publishedAt desc, _createdAt desc) {
    ${productFields}
  }
`);

export const ALL_PRODUCT_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "product" && (!defined(status) || status == "active") && defined(slug.current)] {
    "slug": slug.current
  }
`);

export const PRODUCT_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "product" && (!defined(status) || status == "active") && slug.current == $slug][0] {
    ${productFields},
    relatedProducts[]->{
      ${productFields}
    }
  }
`);

export const CHECKOUT_PRODUCTS_QUERY = defineQuery(/* groq */ `
  *[_type == "product" && (!defined(status) || status == "active") && slug.current in $productIds] {
    "id": slug.current,
    title,
    price,
    "colors": colors[]->name,
    "sizes": sizes[]->label
  }
`);

export const NEW_ARRIVALS_QUERY = defineQuery(/* groq */ `
  *[_type == "product" && (!defined(status) || status == "active") && isNewArrival == true && defined(slug.current)]
  | order(publishedAt desc, _createdAt desc)[0...12] {
    ${productFields}
  }
`);

export const HOMEPAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "homepage"][0] {
    _id,
    title,
    heroEyebrow,
    heroTitle,
    heroAccent,
    heroText,
    heroImage {
      asset->{
        _id,
        url,
        metadata {
          lqip,
          dimensions { width, height }
        }
      },
      crop,
      hotspot
    },
    primaryCtaLabel,
    primaryCtaHref,
    secondaryCtaLabel,
    secondaryCtaHref,
    heroStats[] {
      _key,
      label
    },
    seasonalFocusEyebrow,
    seasonalFocusText,
    seasonalFocusLinkLabel,
    seasonalFocusLinkHref,
    featuredProductsEyebrow,
    featuredProductsTitle,
    featuredProductsLinkLabel,
    featuredProductsLinkHref,
    featuredProducts[]->{
      ${productFields}
    },
    featuredCollections[]->{
      _id,
      title,
      "slug": slug.current,
      description,
      heroImage {
        asset->{
          _id,
          url,
          metadata {
            lqip,
            dimensions { width, height }
          }
        },
        crop,
        hotspot
      }
    },
    featuredCollectionsEyebrow,
    featuredCollectionsTitle,
    seo
  }
`);

export const SITE_SETTINGS_QUERY = defineQuery(/* groq */ `
  *[_type == "siteSettings"][0] {
    _id,
    title,
    brandName,
    description,
    announcement,
    logo {
      asset->{ _id, url },
      crop,
      hotspot
    },
    trustIndicators[] {
      _key,
      title,
      description
    },
    navigation[] {
      _key,
      label,
      href
    },
    mobileNavigation[] {
      _key,
      label,
      href
    },
    customerExperienceLabel,
    customerExperiencePhone,
    customerExperienceHours,
    customerExperienceLocation,
    footerManifestoEyebrow,
    footerManifestoTitle,
    footerManifestoAccent,
    footerManifestoText,
    footerFeatureCards[] {
      _key,
      title,
      text
    },
    footerGallery[] {
      _key,
      caption,
      href,
      image {
        asset->{
          _id,
          url,
          metadata {
            lqip,
            dimensions { width, height }
          }
        },
        crop,
        hotspot
      }
    },
    "lookbookGallery": *[_type == "lookbookItem" && defined(image)]
      | order(publishedAt desc, _createdAt desc)[0...4] {
        _id,
        title,
        caption,
        image {
          asset->{
            _id,
            url,
            metadata {
              lqip,
              dimensions { width, height }
            }
          },
          crop,
          hotspot
        }
      },
    newsletterEyebrow,
    newsletterTitle,
    footerColumns[] {
      _key,
      title,
      links[] {
        _key,
        label,
        href
      }
    },
    studioHeading,
    studioAddress,
    studioContactLabel,
    studioPhone,
    studioWhatsappUrl,
    legalText,
    legalLinks[] {
      _key,
      label,
      href
    },
    seo
  }
`);

export const DELIVERY_POLICY_QUERY = defineQuery(/* groq */ `
  *[_type == "deliveryPolicy"][0] {
    _id,
    title,
    summary,
    sections[] {
      _key,
      heading,
      body
    },
    seo
  }
`);
