import { createReadStream } from "node:fs";
import { access, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createClient } from "@sanity/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const studioRoot = path.resolve(__dirname, "..");
const appRoot = path.resolve(studioRoot, "../clothe-brand");
const imageDir = path.join(appRoot, "images");

const projectId = process.env.SANITY_PROJECT_ID || "18w15i18";
const dataset = process.env.SANITY_DATASET || "production";
const token = process.env.SANITY_AUTH_TOKEN;

if (!token) {
  console.error("Missing SANITY_AUTH_TOKEN. Create a Sanity token with write access and rerun this script.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-07-12",
  token,
  useCdn: false,
});

const products = [
  {
    id: "sig-bomber",
    name: "Signature Bomber Jacket",
    category: "Outerwear",
    price: 13500,
    badge: "Best Seller",
    colors: [
      { name: "Charcoal Black", value: "#1C1A17" },
      { name: "Olive Drab", value: "#4B5320" },
      { name: "Raw Umber", value: "#735135" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "An elevated interpretation of a classic military silhouette. Crafted from water-resistant satin-finish twill with premium ribbed trim, bespoke hardware, and an incredibly soft interior lining.",
    details: [
      "Water-resistant nylon-satin outer shell",
      "Two-way heavy-gauge metal zip closure with storm flap",
      "Concealed snap-button side welt pockets",
      "Rib-knit collar, cuffs, and bottom band",
      "Fully lined with internal utility pocket",
      "Dry clean only",
    ],
    collections: ["urban-outerwear"],
  },
  {
    id: "linen-blazer",
    name: "Linen Blend Blazer",
    category: "Outerwear",
    price: 12000,
    badge: "New In",
    colors: [
      { name: "Oatmeal Cream", value: "#EFECE4" },
      { name: "Soft Sand", value: "#D1C7BD" },
      { name: "Charcoal Black", value: "#1C1A17" },
    ],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Unstructured, relaxed elegance designed for warm afternoons and breezy dinners. Crafted in a lightweight linen-blend fabric with a natural crinkle texture.",
    details: [
      "Unlined construction for maximum breathability",
      "Double back vents for comfort",
      "Patch pockets at hip; single chest pocket",
      "Three-button cuff detailing",
      "65% Linen, 35% Cotton Blend",
    ],
    collections: ["summer-linen-series", "urban-outerwear"],
  },
  {
    id: "drape-midi",
    name: "Drape Midi Dress",
    category: "Dresses",
    price: 11200,
    badge: "Editorial Pick",
    colors: [
      { name: "Champagne Silk", value: "#E9DCC9" },
      { name: "Forest Moss", value: "#2C3E35" },
      { name: "Midnight Navy", value: "#1A2536" },
    ],
    sizes: ["XS", "S", "M", "L"],
    description:
      "An elegant, fluid wrap-style midi dress that contours beautifully. Spun from double-faced satin with delicate drape detailing.",
    details: [
      "Concealed side zipper closure",
      "Gathered shoulder draping and sash detail",
      "Lined bodice for comfort and security",
      "High-grade premium satin fibers",
      "100% Premium Satin",
    ],
    collections: ["tailored-essentials"],
  },
  {
    id: "rib-polo",
    name: "Ribbed Polo Knit",
    category: "Knitwear",
    price: 8500,
    badge: "New In",
    colors: [
      { name: "Soft Sage", value: "#B4C4B8" },
      { name: "Oatmeal Cream", value: "#EFECE4" },
      { name: "Charcoal Black", value: "#1C1A17" },
    ],
    sizes: ["S", "M", "L", "XL"],
    description:
      "A luxurious knitwear staple featuring a deep rib construction and an unstructured collar.",
    details: [
      "Super-soft ribbed textured weave",
      "Open collar design without buttons",
      "Fitted sleeves and straight hem",
      "100% Premium Soft Cotton",
    ],
    collections: ["tailored-essentials"],
  },
  {
    id: "wide-trousers",
    name: "Wide Leg Trousers",
    category: "Trousers",
    price: 9800,
    colors: [
      { name: "Soft Sand", value: "#D1C7BD" },
      { name: "Charcoal Black", value: "#1C1A17" },
      { name: "Soft Sage", value: "#B4C4B8" },
    ],
    sizes: ["26", "28", "30", "32", "34"],
    description:
      "Modern tailored pants featuring double pleats and an ultra-chic wide leg drape.",
    details: [
      "High-rise with clean waistband",
      "Front pleats and pressed creases",
      "Slanted side pockets and back welt pockets",
      "Premium hook-and-bar internal closure",
      "Linen-blend premium weave",
    ],
    collections: ["tailored-essentials"],
  },
  {
    id: "relaxed-shirt",
    name: "Relaxed Shirt",
    category: "Shirts",
    price: 7200,
    colors: [
      { name: "Pure White", value: "#FFFFFF" },
      { name: "Sky Blue", value: "#D4E6F1" },
      { name: "Soft Sand", value: "#D1C7BD" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "An understated button-down with dropped shoulders and a curved long hem.",
    details: [
      "Dropped shoulder seams",
      "Mother-of-pearl buttons",
      "Single oversized chest patch pocket",
      "100% Cotton Poplin",
    ],
    collections: ["summer-linen-series"],
  },
  {
    id: "leather-sneakers",
    name: "Minimal Leather Sneakers",
    category: "Accessories",
    price: 14500,
    badge: "Limited Edition",
    colors: [
      { name: "Alabaster White", value: "#FAF5EF" },
      { name: "Charcoal Black", value: "#1C1A17" },
    ],
    sizes: ["39", "40", "41", "42", "43", "44"],
    description:
      "Stripped of visual noise, these sleek sneakers are crafted from full-grain leather in a low-top silhouette.",
    details: [
      "Full-grain leather upper and interior",
      "Robust rubber cup-soles",
      "Embossed minimal serial code in gold leaf lettering",
      "Crafted in premium small batches",
    ],
    collections: ["tailored-essentials"],
  },
  {
    id: "crop-jacket",
    name: "Structured Crop Jacket",
    category: "Outerwear",
    price: 15000,
    badge: "Editorial Pick",
    colors: [
      { name: "Oatmeal Cream", value: "#EFECE4" },
      { name: "Forest Moss", value: "#2C3E35" },
    ],
    sizes: ["XS", "S", "M", "L"],
    description:
      "A tailored statement item designed with architectural padded shoulders, a high standing collar, and an elegant cropped waistline.",
    details: [
      "Broad structured shoulders",
      "Concealed snap-button wrap closure",
      "High cropped hem",
      "80% Wool, 20% Soft Blend",
    ],
    collections: ["urban-outerwear"],
  },
  {
    id: "satin-skirt",
    name: "Satin Slip Skirt",
    category: "Skirts",
    price: 8900,
    colors: [
      { name: "Forest Moss", value: "#2C3E35" },
      { name: "Champagne Silk", value: "#E9DCC9" },
      { name: "Charcoal Black", value: "#1C1A17" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "Cut on the bias for a natural stretch that skims the silhouette elegantly.",
    details: [
      "Bias cut fabric for beautiful flow",
      "Internal elastic flat-lay waist band",
      "Hits mid-calf",
      "95% Polyester Satin, 5% Elastane",
    ],
    collections: ["tailored-essentials"],
  },
  {
    id: "oversized-shirt",
    name: "Oversized Cotton Shirt",
    category: "Shirts",
    price: 6800,
    badge: "New In",
    colors: [
      { name: "Pure White", value: "#FFFFFF" },
      { name: "Sky Blue", value: "#D4E6F1" },
      { name: "Charcoal Black", value: "#1C1A17" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description:
      "An effortlessly oversized casual staple, woven in a fine cotton slub texture.",
    details: [
      "Oversized boyfriend fit with broad cuffs",
      "Chest pocket detailing",
      "Slightly longer back curved hem",
      "100% Cotton yarn",
    ],
    collections: ["summer-linen-series"],
  },
];

const collections = [
  {
    name: "The Summer Linen Series",
    description: "Breezy silhouettes and pure flax weaves crafted for sunset warmth.",
    slug: "summer-linen-series",
  },
  {
    name: "Urban Outerwear",
    description: "Structured lines and rich premium hardware for seasonal shifts.",
    slug: "urban-outerwear",
  },
  {
    name: "Tailored Essentials",
    description: "Fluid trousers and draped silk midi dresses. Minimalist sculpture.",
    slug: "tailored-essentials",
  },
];

const lookbookItems = [
  {
    title: "The Quiet Escape",
    slug: "the-quiet-escape",
    caption: "Soft tailoring, relaxed cotton, and warm neutrals for slow Nairobi afternoons.",
    taggedProducts: ["relaxed-shirt", "wide-trousers", "linen-blazer"],
  },
  {
    title: "Textural Pleats",
    slug: "textural-pleats",
    caption: "Structured movement across satin, pleated tailoring, and muted earthy tones.",
    taggedProducts: ["satin-skirt", "drape-midi", "crop-jacket"],
  },
  {
    title: "Summer Linens",
    slug: "summer-linens",
    caption: "Breathable linen blends and lightweight layers designed for warm-weather ease.",
    taggedProducts: ["linen-blazer", "relaxed-shirt", "oversized-shirt"],
  },
  {
    title: "Tailored Simplicity",
    slug: "tailored-simplicity",
    caption: "Minimal silhouettes grounded by wide-leg trousers, ribbed knitwear, and clean accessories.",
    taggedProducts: ["wide-trousers", "rib-polo", "leather-sneakers"],
  },
];

const slugify = value =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const reference = (doc, key) => ({
  _key: key || doc._id.replace(/[^a-zA-Z0-9]/g, ""),
  _type: "reference",
  _ref: doc._id,
});

async function existingBySlug(type, slug) {
  return client.fetch(`*[_type == $type && slug.current == $slug][0]{_id}`, { type, slug });
}

async function upsertBySlug(type, slug, document) {
  const existing = await existingBySlug(type, slug);
  if (existing?._id) {
    await client.patch(existing._id).set(document).commit();
    return { _id: existing._id, ...document };
  }

  const created = await client.create({ _type: type, ...document });
  return { _id: created._id, ...document };
}

async function existingSingleton(type) {
  return client.fetch(`*[_type == $type][0]{_id}`, { type });
}

async function upsertSingleton(type, document) {
  const existing = await existingSingleton(type);
  if (existing?._id) {
    await client.patch(existing._id).set(document).commit();
    return { _id: existing._id, ...document };
  }

  const created = await client.create({ _type: type, ...document });
  return { _id: created._id, ...document };
}

async function localImages() {
  await access(imageDir);
  const files = await readdir(imageDir);
  const images = files
    .filter(file => /\.(avif|jpe?g|png|webp)$/i.test(file))
    .sort()
    .map(file => path.join(imageDir, file));

  if (images.length === 0) {
    throw new Error(`No sample images found in ${imageDir}`);
  }

  return images;
}

async function getOrUploadImage(filePath) {
  const filename = path.basename(filePath);
  const existing = await client.fetch(`*[_type == "sanity.imageAsset" && originalFilename == $filename][0]{_id}`, {
    filename,
  });

  if (existing?._id) return existing;

  return client.assets.upload("image", createReadStream(filePath), { filename });
}

async function main() {
  const imagePaths = await localImages();
  const assets = [];

  console.log(`Using ${imagePaths.length} local sample image(s) from ${imageDir}`);
  for (const imagePath of imagePaths) {
    const asset = await getOrUploadImage(imagePath);
    assets.push(asset);
    console.log(`Image ready: ${path.basename(imagePath)}`);
  }

  const categoriesByName = new Map();
  const colorsByName = new Map();
  const sizesByLabel = new Map();
  const collectionsBySlug = new Map();

  for (const category of [...new Set(products.map(product => product.category))]) {
    const slug = slugify(category);
    const doc = await upsertBySlug("category", slug, {
      title: category,
      slug: { _type: "slug", current: slug },
    });
    categoriesByName.set(category, doc);
    console.log(`Category ready: ${category}`);
  }

  for (const color of products.flatMap(product => product.colors)) {
    if (colorsByName.has(color.name)) continue;
    const slug = slugify(color.name);
    const doc = await upsertBySlug("color", slug, {
      name: color.name,
      slug: { _type: "slug", current: slug },
      hex: color.value,
    });
    colorsByName.set(color.name, doc);
    console.log(`Color ready: ${color.name}`);
  }

  const allSizes = [...new Set(products.flatMap(product => product.sizes))];
  for (const [index, size] of allSizes.entries()) {
    const slug = slugify(size);
    const doc = await upsertBySlug("size", slug, {
      label: size,
      slug: { _type: "slug", current: slug },
      sortOrder: index,
    });
    sizesByLabel.set(size, doc);
    console.log(`Size ready: ${size}`);
  }

  for (const [index, collection] of collections.entries()) {
    const asset = assets[index % assets.length];
    const doc = await upsertBySlug("collection", collection.slug, {
      title: collection.name,
      slug: { _type: "slug", current: collection.slug },
      description: collection.description,
      heroImage: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      },
    });
    collectionsBySlug.set(collection.slug, doc);
    console.log(`Collection ready: ${collection.name}`);
  }

  const productsBySlug = new Map();
  for (const [index, product] of products.entries()) {
    const productAssets = [assets[index % assets.length], assets[(index + 1) % assets.length]];
    const productDoc = await upsertBySlug("product", product.id, {
      title: product.name,
      slug: { _type: "slug", current: product.id },
      status: product.inStock === false ? "archived" : "active",
      sku: product.id.toUpperCase(),
      price: product.price,
      isNewArrival: product.badge === "New In",
      publishedAt: new Date(Date.UTC(2026, 6, 12, 8, index)).toISOString(),
      description: product.description,
      details: product.details,
      images: productAssets.map((asset, imageIndex) => ({
        _key: `${product.id}-image-${imageIndex}`,
        _type: "productImage",
        image: {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
        },
        alt: `${product.name} ${imageIndex + 1}`,
      })),
      category: reference(categoriesByName.get(product.category), `${product.id}-category`),
      collections: product.collections.map(slug => reference(collectionsBySlug.get(slug), `${product.id}-${slug}`)),
      colors: product.colors.map(color => reference(colorsByName.get(color.name), `${product.id}-${slugify(color.name)}`)),
      sizes: product.sizes.map(size => reference(sizesByLabel.get(size), `${product.id}-${slugify(size)}`)),
      seo: {
        _type: "seoFields",
        title: product.name,
        description: product.description.slice(0, 160),
      },
    });
    productsBySlug.set(product.id, productDoc);
    console.log(`Product ready: ${product.name}`);
  }

  for (const [index, item] of lookbookItems.entries()) {
    const asset = assets[index % assets.length];
    await upsertBySlug("lookbookItem", item.slug, {
      title: item.title,
      slug: { _type: "slug", current: item.slug },
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      },
      caption: item.caption,
      taggedProducts: item.taggedProducts
        .map(slug => productsBySlug.get(slug))
        .filter(Boolean)
        .map(product => reference(product, `${item.slug}-${product.slug.current}`)),
      publishedAt: new Date(Date.UTC(2026, 6, 12, 10, index)).toISOString(),
    });
    console.log(`Lookbook item ready: ${item.title}`);
  }

  const featuredProducts = ["linen-blazer", "drape-midi", "wide-trousers", "oversized-shirt"]
    .map(slug => productsBySlug.get(slug))
    .filter(Boolean)
    .map(product => reference(product, `featured-${product.slug.current}`));

  await upsertSingleton("homepage", {
    title: "Homepage",
    heroEyebrow: "Aurea Nairobi",
    heroTitle: "Aurea Nairobi",
    heroAccent: "Designed for You.",
    heroText: "Editorial fashion essentials in linen, satin, cotton, and tailored separates.",
    heroImage: {
      _type: "image",
      asset: { _type: "reference", _ref: assets[0]._id },
    },
    primaryCtaLabel: "Shop New Arrivals",
    primaryCtaHref: "/new-arrivals",
    secondaryCtaLabel: "Explore Collections",
    secondaryCtaHref: "/shop",
    heroStats: [
      { _key: "quality-fabrics", label: "Quality Fabrics" },
      { _key: "premium-design", label: "Premium Design" },
      { _key: "local-delivery", label: "Local Delivery" },
    ],
    seasonalFocusEyebrow: "Seasonal Focus",
    seasonalFocusText: "Flax-linen breathes life into summer structure.",
    seasonalFocusLinkLabel: "Discover",
    seasonalFocusLinkHref: "/new-arrivals",
    featuredProductsEyebrow: "Curated Masterpieces",
    featuredProductsTitle: "The Editorial Collection",
    featuredProductsLinkLabel: "View All Masterpieces",
    featuredProductsLinkHref: "/shop",
    featuredProducts,
    featuredCollections: collections.map(collection =>
      reference(collectionsBySlug.get(collection.slug), `featured-${collection.slug}`),
    ),
    featuredCollectionsEyebrow: "Curations",
    featuredCollectionsTitle: "Explore Curated Collections",
    seo: {
      _type: "seoFields",
      title: "Aurea Nairobi",
      description: "Editorial fashion essentials in linen, satin, cotton, and tailored separates.",
    },
  });
  console.log("Homepage ready");

  await upsertSingleton("siteSettings", {
    title: "Aurea Nairobi",
    brandName: "Aurea",
    description: "Premium fashion ecommerce in Nairobi.",
    announcement: "Same-day delivery in Nairobi on selected pieces.",
    trustIndicators: [
      { _key: "premium-quality", title: "Premium Quality", description: "Premium finishing & quality materials" },
      { _key: "easy-returns", title: "Easy Returns", description: "Easy returns within 14 days" },
      { _key: "secure-payments", title: "Secure Payments", description: "M-Pesa, card & bank transfers" },
      { _key: "fast-delivery", title: "Fast Delivery", description: "Same-day in Nairobi, next-day nationwide" },
    ],
    navigation: [
      { _key: "home", label: "Home", href: "/" },
      { _key: "shop", label: "Shop", href: "/shop" },
      { _key: "new-arrivals", label: "New Arrivals", href: "/new-arrivals" },
    ],
    mobileNavigation: [
      { _key: "mobile-home", label: "Home", href: "/" },
      { _key: "mobile-shop", label: "Shop", href: "/shop" },
      { _key: "mobile-new-arrivals", label: "New Arrivals", href: "/new-arrivals" },
      { _key: "delivery", label: "Delivery", href: "/delivery-returns" },
      { _key: "contact", label: "Contact", href: "/contact" },
    ],
    customerExperienceLabel: "Customer Experience:",
    customerExperiencePhone: "0700 AUREA FASHION",
    customerExperienceHours: "Mon - Sat, 9:00 AM - 6:00 PM",
    customerExperienceLocation: "NAIROBI, KENYA",
    footerManifestoEyebrow: "Our Manifesto",
    footerManifestoTitle: "We believe in clothing that breathes, flows,",
    footerManifestoAccent: "and feels like home.",
    footerManifestoText:
      "Each Aurea garment is carefully designed and tailored in limited releases. By working with high-quality, lightweight linen blends, premium satins, and extra-long cotton, we craft garments that drape beautifully and age gracefully with you.",
    footerFeatureCards: [
      {
        _key: "nairobi-design",
        title: "Nairobi Design",
        text: "Our designs are conceptualized in the heart of Nairobi, merging clean, minimalist architecture with practical day-to-day comfort.",
      },
      {
        _key: "premium-materials",
        title: "Premium Materials",
        text: "We select lightweight, breathable fabrics that feel cool on the skin and hold their premium editorial drape for years.",
      },
    ],
    footerGallery: assets.slice(0, 4).map((asset, index) => ({
      _key: `footer-gallery-${index}`,
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      },
      caption: ["The Quiet Escape", "Textural Pleats", "Summer Linens", "Tailored Simplicity"][index] || "Aurea Lookbook",
      href: "/shop",
    })),
    newsletterEyebrow: "The Aurea Chronicle",
    newsletterTitle: "Subscribe to receive limited batch release alerts and private studio previews.",
    footerColumns: [
      {
        _key: "footer-shop",
        title: "Shop",
        links: [
          { _key: "footer-new", label: "Shop New Arrivals", href: "/new-arrivals" },
          { _key: "footer-dresses", label: "Draped Dresses", href: "/shop" },
          { _key: "footer-linen", label: "Linen Separates", href: "/shop" },
          { _key: "footer-knitwear", label: "Knitwear & Sweaters", href: "/shop" },
        ],
      },
      {
        _key: "footer-guidelines",
        title: "Guidelines",
        links: [
          { _key: "footer-sizing", label: "Sizing Blueprint", href: "/shop" },
          { _key: "footer-delivery", label: "Delivery & Couriers", href: "/delivery-returns" },
          { _key: "footer-returns", label: "14-Day Free Returns", href: "/delivery-returns" },
          { _key: "footer-care", label: "Care Manual", href: "/delivery-returns" },
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
      { _key: "privacy", label: "Privacy Policy", href: "/delivery-returns" },
      { _key: "terms", label: "Terms of Service", href: "/contact" },
    ],
  });
  console.log("Site settings ready");

  await upsertSingleton("deliveryPolicy", {
    title: "Delivery & Returns",
    summary: "Same-day Nairobi delivery and nationwide courier options.",
    sections: [
      {
        _key: "delivery",
        heading: "Delivery",
        body: [
          {
            _key: "delivery-block",
            _type: "block",
            style: "normal",
            children: [
              {
                _key: "delivery-span",
                _type: "span",
                text: "Nairobi orders are delivered same day where available. Nationwide orders ship through trusted courier partners.",
                marks: [],
              },
            ],
            markDefs: [],
          },
        ],
      },
      {
        _key: "returns",
        heading: "Returns",
        body: [
          {
            _key: "returns-block",
            _type: "block",
            style: "normal",
            children: [
              {
                _key: "returns-span",
                _type: "span",
                text: "Items returned within 14 days in original unworn condition are eligible for exchange or refund.",
                marks: [],
              },
            ],
            markDefs: [],
          },
        ],
      },
    ],
  });
  console.log("Delivery policy ready");
  console.log("Seed complete");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
