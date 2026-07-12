import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import TrustStrip from "@/components/trust-strip";
import { Button } from "@/components/ui/button";
import { HomepageContent, SiteSettingsContent } from "@/src/sanity/lib/site";

export default function Hero({ content, siteSettings }: { content: HomepageContent; siteSettings: SiteSettingsContent }) {
  return (
    <section className="relative w-full">
      <div className="grid min-h-[calc(100vh-5rem)] grid-cols-1 overflow-hidden bg-brand-cream lg:grid-cols-12">
        <div className="z-10 flex flex-col justify-center px-6 py-12 sm:px-12 lg:col-span-5 lg:px-16 lg:py-20">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <span className="block text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">{content.heroEyebrow}</span>
              <h1 className="font-serif text-5xl font-normal leading-[1.1] tracking-tight text-brand-dark sm:text-6xl lg:text-7xl">
                {content.heroTitle}
                <br />
                <span className="font-light italic text-brand-gold/90">{content.heroAccent}</span>
              </h1>
            </div>
            <p className="max-w-md text-sm font-light leading-relaxed text-stone-600 sm:text-base">{content.heroText}</p>
            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Button className="group px-8 py-5">
                <Link href={content.primaryCtaHref} className="inline-flex items-center gap-2">
                  {content.primaryCtaLabel} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" className="px-8 py-5">
                <Link href={content.secondaryCtaHref}>{content.secondaryCtaLabel}</Link>
              </Button>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-6 border-t border-brand-dark/10 pt-8 lg:mt-24">
            {content.heroStats.map((label, index) => (
              <div key={label}>
                <span className="font-serif text-2xl font-light text-brand-gold">0{index + 1}</span>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-stone-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative min-h-[400px] overflow-hidden bg-stone-100 lg:col-span-7 lg:min-h-0">
          <Image
            src={content.heroImage}
            alt="Aurea Editorial Lookbook"
            className="absolute inset-0 h-full w-full object-cover object-center"
            referrerPolicy="no-referrer"
            width={1600}
            height={900}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/30 via-transparent to-brand-dark/10" />
          <div className="absolute bottom-8 right-8 hidden max-w-[240px] rounded-xl border border-white/40 bg-brand-cream/90 p-5 shadow-lg backdrop-blur-md sm:block">
            <span className="mb-1 block text-[9px] font-bold uppercase tracking-[0.25em] text-brand-gold">{content.seasonalFocusEyebrow}</span>
            <span className="mb-2 block font-serif text-sm italic leading-tight tracking-wide text-brand-dark">&ldquo;{content.seasonalFocusText}&rdquo;</span>
            <Link href={content.seasonalFocusLinkHref} className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-brand-dark transition-colors hover:text-brand-gold">
              {content.seasonalFocusLinkLabel} <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
      <TrustStrip items={siteSettings.trustIndicators} />
    </section>
  );
}
