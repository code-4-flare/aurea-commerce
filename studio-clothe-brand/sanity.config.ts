import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "../clothe-brand/src/sanity/schemaTypes";

export default defineConfig({
  name: "default",
  title: "Clothe Brand",
  projectId: "18w15i18",
  dataset: "production",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
