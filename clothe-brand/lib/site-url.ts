const localSiteUrl = "http://localhost:3000";

export function getSiteUrl() {
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const vercelSiteUrl = vercelUrl ? (/^https?:\/\//i.test(vercelUrl) ? vercelUrl : `https://${vercelUrl}`) : undefined;
  const configuredUrl = process.env.SITE_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim() || vercelSiteUrl || localSiteUrl;

  try {
    return new URL(configuredUrl);
  } catch {
    throw new Error("SITE_URL must be a valid absolute URL.");
  }
}

export function absoluteSiteUrl(path = "/") {
  return new URL(path, getSiteUrl()).toString();
}
