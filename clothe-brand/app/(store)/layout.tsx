import SiteShell from "@/components/site-shell";
import { sanityFetch } from "@/src/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/src/sanity/lib/queries";
import { mapSiteSettings } from "@/src/sanity/lib/site";

export default async function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = mapSiteSettings(await sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ["siteSettings", "lookbookItem"] }));

  return <SiteShell settings={settings}>{children}</SiteShell>;
}
