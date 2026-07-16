import { NextStudio } from "next-sanity/studio";
import type { Metadata } from "next";
import { viewport } from "next-sanity/studio";

import config from "@/sanity.config";

export const dynamic = "force-static";

export { viewport };

export const metadata: Metadata = {
  title: "Aurea Content Studio",
  robots: { index: false, follow: false, nocache: true },
};

export default function StudioPage() {
  return <NextStudio config={config} />;
}
