import { defineArrayMember, defineField, defineType } from "sanity";

export const lookbookItem = defineType({
  name: "lookbookItem",
  title: "Lookbook Item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: rule => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: rule => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: rule => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "taggedProducts",
      title: "Tagged Products",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "product" }] })],
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),
  ],
});
