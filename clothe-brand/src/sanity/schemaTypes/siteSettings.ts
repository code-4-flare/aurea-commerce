import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
      validation: rule => rule.required(),
    }),
    defineField({
      name: "brandName",
      title: "Brand Name",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Site Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "announcement",
      title: "Announcement",
      type: "string",
    }),
    defineField({
      name: "trustIndicators",
      title: "Trust Indicators",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: rule => rule.required() }),
            defineField({ name: "description", title: "Description", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "navigation",
      title: "Navigation",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: rule => rule.required() }),
            defineField({ name: "href", title: "Href", type: "string", validation: rule => rule.required() }),
          ],
        }),
      ],
    }),
    defineField({
      name: "mobileNavigation",
      title: "Mobile Navigation",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: rule => rule.required() }),
            defineField({ name: "href", title: "Href", type: "string", validation: rule => rule.required() }),
          ],
        }),
      ],
    }),
    defineField({
      name: "customerExperienceLabel",
      title: "Customer Experience Label",
      type: "string",
    }),
    defineField({
      name: "customerExperiencePhone",
      title: "Customer Experience Phone",
      type: "string",
    }),
    defineField({
      name: "customerExperienceHours",
      title: "Customer Experience Hours",
      type: "string",
    }),
    defineField({
      name: "customerExperienceLocation",
      title: "Customer Experience Location",
      type: "string",
    }),
    defineField({
      name: "footerManifestoEyebrow",
      title: "Footer Manifesto Eyebrow",
      type: "string",
    }),
    defineField({
      name: "footerManifestoTitle",
      title: "Footer Manifesto Title",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "footerManifestoAccent",
      title: "Footer Manifesto Accent",
      type: "string",
    }),
    defineField({
      name: "footerManifestoText",
      title: "Footer Manifesto Text",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "footerFeatureCards",
      title: "Footer Feature Cards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: rule => rule.required() }),
            defineField({ name: "text", title: "Text", type: "text", rows: 3 }),
          ],
        }),
      ],
    }),
    defineField({
      name: "footerGallery",
      title: "Footer Gallery",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
            defineField({ name: "href", title: "Link", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "newsletterEyebrow",
      title: "Newsletter Eyebrow",
      type: "string",
    }),
    defineField({
      name: "newsletterTitle",
      title: "Newsletter Title",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "footerColumns",
      title: "Footer Columns",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: rule => rule.required() }),
            defineField({
              name: "links",
              title: "Links",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({ name: "label", title: "Label", type: "string", validation: rule => rule.required() }),
                    defineField({ name: "href", title: "Href", type: "string", validation: rule => rule.required() }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "studioHeading",
      title: "Studio Heading",
      type: "string",
    }),
    defineField({
      name: "studioAddress",
      title: "Studio Address",
      type: "string",
    }),
    defineField({
      name: "studioContactLabel",
      title: "Studio Contact Label",
      type: "string",
    }),
    defineField({
      name: "studioPhone",
      title: "Studio Phone",
      type: "string",
    }),
    defineField({
      name: "studioWhatsappUrl",
      title: "Studio WhatsApp URL",
      type: "url",
    }),
    defineField({
      name: "legalText",
      title: "Legal Text",
      type: "string",
    }),
    defineField({
      name: "legalLinks",
      title: "Legal Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: rule => rule.required() }),
            defineField({ name: "href", title: "Href", type: "string", validation: rule => rule.required() }),
          ],
        }),
      ],
    }),
    defineField({
      name: "seo",
      title: "Default SEO",
      type: "seoFields",
    }),
  ],
});
