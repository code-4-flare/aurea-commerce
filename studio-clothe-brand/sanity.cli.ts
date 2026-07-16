import { defineCliConfig } from "sanity/cli";

try {
  process.loadEnvFile?.();
} catch {
  // Deployed environments provide these values directly instead of through .env.
}

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET || "production";

if (!projectId) {
  throw new Error("Missing required environment variable: SANITY_STUDIO_PROJECT_ID or SANITY_PROJECT_ID");
}

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
});
