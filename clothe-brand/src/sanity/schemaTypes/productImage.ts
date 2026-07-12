import { defineField, defineType } from "sanity";

export const productImage = defineType({
  name: "productImage",
  title: "Product Image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: rule => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alternative Text",
      type: "string",
      validation: rule => rule.required().warning("Alt text helps accessibility and SEO."),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
  ],
});
