import { defineCliConfig } from "sanity/cli";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || "production";

if (!projectId) {
  throw new Error("Missing required environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID");
}

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
});
