import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || "production";

if (!projectId) {
  throw new Error("Missing required environment variable: SANITY_PROJECT_ID");
}

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
});
