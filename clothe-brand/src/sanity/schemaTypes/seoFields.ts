import { defineField, defineType } from "sanity";

export const seoFields = defineType({
  name: "seoFields",
  title: "SEO Fields",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "SEO Title",
      type: "string",
      validation: rule => rule.max(60),
    }),
    defineField({
      name: "description",
      title: "SEO Description",
      type: "text",
      rows: 3,
      validation: rule => rule.max(160),
    }),
    defineField({
      name: "image",
      title: "Social Image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
});
