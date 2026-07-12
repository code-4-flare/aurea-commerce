import { defineArrayMember, defineField, defineType } from "sanity";

export const deliveryPolicy = defineType({
  name: "deliveryPolicy",
  title: "Delivery Policy",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: rule => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "heading", title: "Heading", type: "string", validation: rule => rule.required() }),
            defineField({ name: "body", title: "Body", type: "array", of: [defineArrayMember({ type: "block" })] }),
          ],
        }),
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoFields",
    }),
  ],
});
