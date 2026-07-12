import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "../clothe-brand/src/sanity/schemaTypes";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

if (!projectId) {
  throw new Error("Missing required environment variable: SANITY_STUDIO_PROJECT_ID or SANITY_PROJECT_ID");
}

export default defineConfig({
  name: "default",
  title: "Clothe Brand",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
