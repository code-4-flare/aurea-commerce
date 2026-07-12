import { defineField, defineType } from "sanity";

export const color = defineType({
  name: "color",
  title: "Color",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: rule => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: rule => rule.required(),
    }),
    defineField({
      name: "hex",
      title: "Hex Value",
      type: "string",
      validation: rule => rule.regex(/^#([0-9A-Fa-f]{3}){1,2}$/).warning("Use a valid hex color like #1F2937."),
    }),
  ],
});
