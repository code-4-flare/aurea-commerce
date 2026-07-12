import { defineField, defineType } from "sanity";

export const size = defineType({
  name: "size",
  title: "Size",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: rule => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "label", maxLength: 96 },
      validation: rule => rule.required(),
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
    }),
  ],
});
