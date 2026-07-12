import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SiteShell from "@/components/site-shell";
import { sanityFetch } from "@/src/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "@/src/sanity/lib/queries";
import { mapSiteSettings } from "@/src/sanity/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aurea.example"),
  title: {
    default: "Aurea Nairobi | Premium Fashion Ecommerce",
    template: "%s",
  },
  description: "Premium editorial fashion ecommerce.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = mapSiteSettings(await sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ["siteSettings", "lookbookItem"] }));

  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <SiteShell settings={settings}>{children}</SiteShell>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
