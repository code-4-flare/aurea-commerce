import { defineArrayMember, defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
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
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "active",
      options: {
        layout: "radio",
        list: [
          { title: "Active", value: "active" },
          { title: "Draft", value: "draft" },
          { title: "Archived", value: "archived" },
        ],
      },
      validation: rule => rule.required(),
    }),
    defineField({
      name: "sku",
      title: "SKU",
      type: "string",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: rule => rule.required().min(0),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare-at Price",
      type: "number",
      validation: rule => rule.min(0),
    }),
    defineField({
      name: "isNewArrival",
      title: "New Arrival",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "details",
      title: "Details",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [defineArrayMember({ type: "productImage" })],
      validation: rule => rule.required().min(1),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: rule => rule.required(),
    }),
    defineField({
      name: "collections",
      title: "Collections",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "collection" }] })],
    }),
    defineField({
      name: "colors",
      title: "Colors",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "color" }] })],
    }),
    defineField({
      name: "sizes",
      title: "Sizes",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "size" }] })],
    }),
    defineField({
      name: "relatedProducts",
      title: "Related Products",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "product" }] })],
      validation: rule => rule.unique(),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoFields",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "images.0.image",
      subtitle: "category.title",
    },
  },
});
