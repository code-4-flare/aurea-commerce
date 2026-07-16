import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { brandName } from "@/lib/metadata";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "Aurea Nairobi | Refined Fashion for Everyday Living",
    template: "%s",
  },
  description: "Shop refined fashion and curated wardrobe essentials from Aurea Nairobi, with secure payments and delivery across Kenya.",
  applicationName: brandName,
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: brandName,
    title: "Aurea Nairobi | Refined Fashion for Everyday Living",
    description: "Shop refined fashion and curated wardrobe essentials from Aurea Nairobi, with secure payments and delivery across Kenya.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurea Nairobi | Refined Fashion for Everyday Living",
    description: "Shop refined fashion and curated wardrobe essentials from Aurea Nairobi, with secure payments and delivery across Kenya.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
