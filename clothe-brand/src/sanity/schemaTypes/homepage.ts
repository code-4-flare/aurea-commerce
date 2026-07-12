import { defineArrayMember, defineField, defineType } from "sanity";

export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Internal Title",
      type: "string",
      initialValue: "Homepage",
      validation: rule => rule.required(),
    }),
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      type: "string",
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      validation: rule => rule.required(),
    }),
    defineField({
      name: "heroAccent",
      title: "Hero Accent",
      type: "string",
    }),
    defineField({
      name: "heroText",
      title: "Hero Text",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "primaryCtaLabel",
      title: "Primary CTA Label",
      type: "string",
    }),
    defineField({
      name: "primaryCtaHref",
      title: "Primary CTA Link",
      type: "string",
    }),
    defineField({
      name: "secondaryCtaLabel",
      title: "Secondary CTA Label",
      type: "string",
    }),
    defineField({
      name: "secondaryCtaHref",
      title: "Secondary CTA Link",
      type: "string",
    }),
    defineField({
      name: "heroStats",
      title: "Hero Stats",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: rule => rule.required() }),
          ],
        }),
      ],
    }),
    defineField({
      name: "seasonalFocusEyebrow",
      title: "Seasonal Focus Eyebrow",
      type: "string",
    }),
    defineField({
      name: "seasonalFocusText",
      title: "Seasonal Focus Text",
      type: "string",
    }),
    defineField({
      name: "seasonalFocusLinkLabel",
      title: "Seasonal Focus Link Label",
      type: "string",
    }),
    defineField({
      name: "seasonalFocusLinkHref",
      title: "Seasonal Focus Link",
      type: "string",
    }),
    defineField({
      name: "featuredProductsEyebrow",
      title: "Featured Products Eyebrow",
      type: "string",
    }),
    defineField({
      name: "featuredProductsTitle",
      title: "Featured Products Title",
      type: "string",
    }),
    defineField({
      name: "featuredProductsLinkLabel",
      title: "Featured Products Link Label",
      type: "string",
    }),
    defineField({
      name: "featuredProductsLinkHref",
      title: "Featured Products Link",
      type: "string",
    }),
    defineField({
      name: "featuredProducts",
      title: "Featured Products",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "product" }] })],
    }),
    defineField({
      name: "featuredCollections",
      title: "Featured Collections",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "collection" }] })],
    }),
    defineField({
      name: "featuredCollectionsEyebrow",
      title: "Featured Collections Eyebrow",
      type: "string",
    }),
    defineField({
      name: "featuredCollectionsTitle",
      title: "Featured Collections Title",
      type: "string",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoFields",
    }),
  ],
});
