import { isPrivateStorePath } from "@/lib/links";

export type LinkItem = {
  label: string;
  href: string;
};

export type TrustIndicator = {
  title: string;
  description: string;
};

export type FooterColumn = {
  title: string;
  links: LinkItem[];
};

export type FooterFeatureCard = {
  title: string;
  text: string;
};

export type FooterGalleryItem = {
  caption: string;
  href: string;
  image: string;
};

export type SiteSettingsContent = {
  title: string;
  brandName: string;
  description: string;
  announcement: string;
  navigation: LinkItem[];
  mobileNavigation: LinkItem[];
  trustIndicators: TrustIndicator[];
  customerExperienceLabel: string;
  customerExperiencePhone: string;
  customerExperienceHours: string;
  customerExperienceLocation: string;
  footerManifestoEyebrow: string;
  footerManifestoTitle: string;
  footerManifestoAccent: string;
  footerManifestoText: string;
  footerFeatureCards: FooterFeatureCard[];
  footerGallery: FooterGalleryItem[];
  footerColumns: FooterColumn[];
  studioHeading: string;
  studioAddress: string;
  studioContactLabel: string;
  studioPhone: string;
  studioWhatsappUrl: string;
  legalText: string;
  legalLinks: LinkItem[];
};

export type HomepageContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroAccent: string;
  heroText: string;
  heroImage: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  heroStats: string[];
  seasonalFocusEyebrow: string;
  seasonalFocusText: string;
  seasonalFocusLinkLabel: string;
  seasonalFocusLinkHref: string;
  featuredProductsEyebrow: string;
  featuredProductsTitle: string;
  featuredProductsLinkLabel: string;
  featuredProductsLinkHref: string;
  featuredCollectionsEyebrow: string;
  featuredCollectionsTitle: string;
};

type SanityImageValue = {
  asset?: {
    url?: string;
  };
};

type RawLink = {
  label?: string;
  href?: string;
};

type RawSiteSettings = {
  title?: string;
  brandName?: string;
  description?: string;
  announcement?: string;
  navigation?: RawLink[];
  mobileNavigation?: RawLink[];
  trustIndicators?: { title?: string; description?: string }[];
  customerExperienceLabel?: string;
  customerExperiencePhone?: string;
  customerExperienceHours?: string;
  customerExperienceLocation?: string;
  footerManifestoEyebrow?: string;
  footerManifestoTitle?: string;
  footerManifestoAccent?: string;
  footerManifestoText?: string;
  footerFeatureCards?: { title?: string; text?: string }[];
  footerGallery?: { caption?: string; href?: string; image?: SanityImageValue }[];
  lookbookGallery?: { title?: string; caption?: string; image?: SanityImageValue }[];
  footerColumns?: { title?: string; links?: RawLink[] }[];
  studioHeading?: string;
  studioAddress?: string;
  studioContactLabel?: string;
  studioPhone?: string;
  studioWhatsappUrl?: string;
  legalText?: string;
  legalLinks?: RawLink[];
};

type RawHomepage = {
  heroEyebrow?: string;
  heroTitle?: string;
  heroAccent?: string;
  heroText?: string;
  heroImage?: SanityImageValue;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  heroStats?: { label?: string }[];
  seasonalFocusEyebrow?: string;
  seasonalFocusText?: string;
  seasonalFocusLinkLabel?: string;
  seasonalFocusLinkHref?: string;
  featuredProductsEyebrow?: string;
  featuredProductsTitle?: string;
  featuredProductsLinkLabel?: string;
  featuredProductsLinkHref?: string;
  featuredCollectionsEyebrow?: string;
  featuredCollectionsTitle?: string;
};

const fallbackHeroImage = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop";

const defaultLinks: LinkItem[] = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop All" },
  { href: "/new-arrivals", label: "New Arrivals" },
];

export const defaultSiteSettings: SiteSettingsContent = {
  title: "Aurea Nairobi",
  brandName: "Aurea",
  description: "Premium editorial fashion ecommerce.",
  announcement: "",
  navigation: defaultLinks,
  mobileNavigation: [
    ...defaultLinks,
    { href: "/delivery-returns", label: "Delivery Returns" },
    { href: "/contact", label: "Contact" },
  ],
  trustIndicators: [
    { title: "Premium Quality", description: "Premium finishing & quality materials" },
    { title: "Easy Returns", description: "Easy returns within 14 days" },
    { title: "Secure Payments", description: "M-Pesa, card & bank transfers" },
    { title: "Fast Delivery", description: "Same-day in Nairobi, next-day nationwide" },
  ],
  customerExperienceLabel: "Customer Experience:",
  customerExperiencePhone: "0700 AUREA FASHION",
  customerExperienceHours: "Mon - Sat, 9:00 AM - 6:00 PM",
  customerExperienceLocation: "NAIROBI, KENYA",
  footerManifestoEyebrow: "Our Manifesto",
  footerManifestoTitle: "We believe in clothing that breathes, flows,",
  footerManifestoAccent: "and feels like home.",
  footerManifestoText:
    "Each Aurea garment is carefully designed and tailored in limited releases. We craft garments that drape beautifully and age gracefully with you.",
  footerFeatureCards: [
    {
      title: "Nairobi Design",
      text: "Our designs are conceptualized in the heart of Nairobi, merging clean, minimalist architecture with practical day-to-day comfort.",
    },
    {
      title: "Premium Materials",
      text: "We select lightweight, breathable fabrics that feel cool on the skin and hold their premium editorial drape for years.",
    },
  ],
  footerGallery: [],
  footerColumns: [
    {
      title: "Shop",
      links: [
        { label: "Shop New Arrivals", href: "/new-arrivals" },
        { label: "Draped Dresses", href: "/shop" },
        { label: "Linen Separates", href: "/shop" },
        { label: "Knitwear & Sweaters", href: "/shop" },
      ],
    },
    {
      title: "Guidelines",
      links: [
        { label: "Sizing Blueprint", href: "/shop" },
        { label: "Delivery & Couriers", href: "/delivery-returns" },
        { label: "14-Day Free Returns", href: "/delivery-returns" },
        { label: "Care Manual", href: "/delivery-returns" },
      ],
    },
  ],
  studioHeading: "Studio",
  studioAddress: "Westlands Commercial Centre, Ring Rd",
  studioContactLabel: "Customer Care & WhatsApp:",
  studioPhone: "+254 700 000 000",
  studioWhatsappUrl: "https://wa.me/254700000000",
  legalText: "© 2026 AUREA FASHION CO. Designed in Nairobi, Kenya.",
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
  ],
};

export const defaultHomepage: HomepageContent = {
  heroEyebrow: "Aurea Nairobi",
  heroTitle: "Refined Style.",
  heroAccent: "Designed for You.",
  heroText:
    "An elegant curation of lightweight linen blends, soft satins, and cotton separates. Beautifully styled, comfortable for everyday wear, and selected with care for your wardrobe.",
  heroImage: fallbackHeroImage,
  primaryCtaLabel: "Shop New Arrivals",
  primaryCtaHref: "/new-arrivals",
  secondaryCtaLabel: "Explore Collections",
  secondaryCtaHref: "/shop",
  heroStats: ["Quality Fabrics", "Premium Design", "Local Delivery"],
  seasonalFocusEyebrow: "Seasonal Focus",
  seasonalFocusText: "Flax-linen breathes life into summer structure.",
  seasonalFocusLinkLabel: "Discover",
  seasonalFocusLinkHref: "/new-arrivals",
  featuredProductsEyebrow: "Curated Masterpieces",
  featuredProductsTitle: "The Editorial Collection",
  featuredProductsLinkLabel: "View All Masterpieces",
  featuredProductsLinkHref: "/shop",
  featuredCollectionsEyebrow: "Curations",
  featuredCollectionsTitle: "Explore Curated Collections",
};

function mapLinks(links: RawLink[] | undefined): LinkItem[] {
  return (links ?? [])
    .filter(link => link.label && link.href && !isPrivateStorePath(link.href))
    .map(link => ({ label: link.label!, href: link.href! }));
}

function mapFooterGallery(settings: RawSiteSettings): FooterGalleryItem[] {
  const footerGallery =
    settings.footerGallery
      ?.map(item => ({
        caption: item.caption || "",
        href: item.href || "/shop",
        image: item.image?.asset?.url || "",
      }))
      .filter(item => item.image && !isPrivateStorePath(item.href)) ?? [];

  if (footerGallery.length > 0) return footerGallery;

  return (
    settings.lookbookGallery
      ?.map(item => ({
        caption: item.caption || item.title || "Aurea Lookbook",
        href: "/shop",
        image: item.image?.asset?.url || "",
      }))
      .filter(item => item.image) ?? []
  );
}

export function mapSiteSettings(settings: RawSiteSettings | null | undefined): SiteSettingsContent {
  if (!settings) return defaultSiteSettings;

  const navigation = mapLinks(settings.navigation);
  const mobileNavigation = mapLinks(settings.mobileNavigation);

  return {
    ...defaultSiteSettings,
    title: settings.title || defaultSiteSettings.title,
    brandName: settings.brandName || settings.title || defaultSiteSettings.brandName,
    description: settings.description || defaultSiteSettings.description,
    announcement: settings.announcement || "",
    navigation: navigation.length > 0 ? navigation : defaultSiteSettings.navigation,
    mobileNavigation: mobileNavigation.length > 0 ? mobileNavigation : navigation.length > 0 ? navigation : defaultSiteSettings.mobileNavigation,
    trustIndicators:
      settings.trustIndicators?.map(item => ({ title: item.title || "", description: item.description || "" })).filter(item => item.title) ??
      defaultSiteSettings.trustIndicators,
    customerExperienceLabel: settings.customerExperienceLabel || defaultSiteSettings.customerExperienceLabel,
    customerExperiencePhone: settings.customerExperiencePhone || defaultSiteSettings.customerExperiencePhone,
    customerExperienceHours: settings.customerExperienceHours || defaultSiteSettings.customerExperienceHours,
    customerExperienceLocation: settings.customerExperienceLocation || defaultSiteSettings.customerExperienceLocation,
    footerManifestoEyebrow: settings.footerManifestoEyebrow || defaultSiteSettings.footerManifestoEyebrow,
    footerManifestoTitle: settings.footerManifestoTitle || defaultSiteSettings.footerManifestoTitle,
    footerManifestoAccent: settings.footerManifestoAccent || defaultSiteSettings.footerManifestoAccent,
    footerManifestoText: settings.footerManifestoText || defaultSiteSettings.footerManifestoText,
    footerFeatureCards:
      settings.footerFeatureCards?.map(card => ({ title: card.title || "", text: card.text || "" })).filter(card => card.title) ??
      defaultSiteSettings.footerFeatureCards,
    footerGallery: mapFooterGallery(settings),
    footerColumns:
      settings.footerColumns
        ?.map(column => ({ title: column.title || "", links: mapLinks(column.links) }))
        .filter(column => column.title && column.links.length > 0) ?? defaultSiteSettings.footerColumns,
    studioHeading: settings.studioHeading || defaultSiteSettings.studioHeading,
    studioAddress: settings.studioAddress || defaultSiteSettings.studioAddress,
    studioContactLabel: settings.studioContactLabel || defaultSiteSettings.studioContactLabel,
    studioPhone: settings.studioPhone || defaultSiteSettings.studioPhone,
    studioWhatsappUrl: settings.studioWhatsappUrl || defaultSiteSettings.studioWhatsappUrl,
    legalText: settings.legalText || defaultSiteSettings.legalText,
    legalLinks: normalizeLegalLinks(settings.legalLinks),
  };
}

function normalizeLegalLinks(links: RawLink[] | undefined) {
  const mappedLinks = mapLinks(links).map(link => {
    const label = link.label.toLowerCase();
    if (label.includes("privacy")) return { ...link, href: "/privacy-policy" };
    if (label.includes("terms")) return { ...link, href: "/terms-of-service" };
    return link;
  });

  return mappedLinks.length > 0 ? mappedLinks : defaultSiteSettings.legalLinks;
}

export function mapHomepage(homepage: RawHomepage | null | undefined): HomepageContent {
  if (!homepage) return defaultHomepage;

  return {
    ...defaultHomepage,
    heroEyebrow: homepage.heroEyebrow || defaultHomepage.heroEyebrow,
    heroTitle: homepage.heroTitle || defaultHomepage.heroTitle,
    heroAccent: homepage.heroAccent || defaultHomepage.heroAccent,
    heroText: homepage.heroText || defaultHomepage.heroText,
    heroImage: homepage.heroImage?.asset?.url || defaultHomepage.heroImage,
    primaryCtaLabel: homepage.primaryCtaLabel || defaultHomepage.primaryCtaLabel,
    primaryCtaHref: homepage.primaryCtaHref || defaultHomepage.primaryCtaHref,
    secondaryCtaLabel: homepage.secondaryCtaLabel || defaultHomepage.secondaryCtaLabel,
    secondaryCtaHref: homepage.secondaryCtaHref || defaultHomepage.secondaryCtaHref,
    heroStats: homepage.heroStats?.map(item => item.label).filter((label): label is string => Boolean(label)).slice(0, 3) ?? defaultHomepage.heroStats,
    seasonalFocusEyebrow: homepage.seasonalFocusEyebrow || defaultHomepage.seasonalFocusEyebrow,
    seasonalFocusText: homepage.seasonalFocusText || defaultHomepage.seasonalFocusText,
    seasonalFocusLinkLabel: homepage.seasonalFocusLinkLabel || defaultHomepage.seasonalFocusLinkLabel,
    seasonalFocusLinkHref: homepage.seasonalFocusLinkHref || defaultHomepage.seasonalFocusLinkHref,
    featuredProductsEyebrow: homepage.featuredProductsEyebrow || defaultHomepage.featuredProductsEyebrow,
    featuredProductsTitle: homepage.featuredProductsTitle || defaultHomepage.featuredProductsTitle,
    featuredProductsLinkLabel: homepage.featuredProductsLinkLabel || defaultHomepage.featuredProductsLinkLabel,
    featuredProductsLinkHref: homepage.featuredProductsLinkHref || defaultHomepage.featuredProductsLinkHref,
    featuredCollectionsEyebrow: homepage.featuredCollectionsEyebrow || defaultHomepage.featuredCollectionsEyebrow,
    featuredCollectionsTitle: homepage.featuredCollectionsTitle || defaultHomepage.featuredCollectionsTitle,
  };
}
