import { MessageCircle } from "lucide-react";
import Image from "next/image";

import SmartLink from "@/components/smart-link";
import { SiteSettingsContent } from "@/src/sanity/lib/site";

type SocialPlatform = "x" | "tiktok" | "github" | "instagram" | "whatsapp";
type SocialLink = { platform: SocialPlatform; label: string; href: string };

const socialOrder: SocialPlatform[] = ["x", "tiktok", "github", "instagram", "whatsapp"];

export default function SiteFooter({ settings }: { settings: SiteSettingsContent }) {
  const socialLinks = collectSocialLinks(settings);

  return (
    <footer className="border-t border-white/5 bg-brand-dark text-brand-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-12 lg:px-12 lg:py-24">
        <div className="space-y-6 lg:col-span-5">
          <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">{settings.footerManifestoEyebrow}</span>
          <h2 className="font-serif text-3xl font-light leading-[1.2] tracking-tight text-brand-cream sm:text-4xl lg:text-5xl">
            {settings.footerManifestoTitle} <br />
            <span className="font-light italic text-brand-gold">{settings.footerManifestoAccent}</span>
          </h2>
          <p className="text-xs font-light leading-relaxed text-stone-400 sm:text-sm">{settings.footerManifestoText}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
          {settings.footerFeatureCards.map((card, index) => (
            <div key={card.title} className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-gold">0{index + 1} / {card.title}</h3>
              <p className="text-[11px] font-light leading-relaxed text-stone-400">{card.text}</p>
            </div>
          ))}
        </div>
      </div>

      {settings.footerGallery.length > 0 && (
        <div className="w-full border-y border-white/10">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {settings.footerGallery.map(image => (
              <SmartLink key={`${image.caption}-${image.image}`} href={image.href} className="group relative aspect-square w-full overflow-hidden">
                <Image src={image.image} alt={image.caption} width={800} height={800} className="h-full w-full object-cover object-center transition-all duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 flex flex-col justify-end bg-brand-dark/40 p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="mb-1 block text-[9px] font-bold uppercase tracking-widest text-brand-gold">Aurea Lookbook</span>
                  <p className="font-serif text-xs italic tracking-wide text-brand-cream">{image.caption}</p>
                </div>
              </SmartLink>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-12 lg:px-12">
        <div className="space-y-4 md:col-span-5">
          <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">Connect with Aurea</span>
          <h3 className="max-w-md font-serif text-lg font-light text-brand-cream">Follow new releases or continue your order with our Nairobi studio.</h3>
          <div className="flex flex-wrap gap-2 pt-2">
            {socialLinks.map(link => (
              <SmartLink
                key={link.platform}
                href={link.href}
                ariaLabel={`${link.label} (opens in a new tab)`}
                className="grid size-10 place-items-center rounded-full border border-white/15 text-stone-300 transition-colors hover:border-brand-gold hover:text-brand-gold"
              >
                <SocialIcon platform={link.platform} />
              </SmartLink>
            ))}
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3 md:col-span-7">
          {settings.footerColumns.map(column => (
            <FooterColumn key={column.title} title={column.title} links={column.links} />
          ))}
          <div className="space-y-4 sm:col-span-1">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">{settings.studioHeading}</h4>
            <div className="space-y-2 text-xs font-light leading-relaxed text-stone-400">
              <p>Nairobi Studio:</p>
              <p className="font-semibold text-brand-cream">{settings.studioAddress}</p>
              <p>{settings.studioContactLabel}</p>
              <SmartLink href={settings.studioWhatsappUrl} className="block font-semibold text-brand-gold hover:underline">
                {settings.studioPhone}
              </SmartLink>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/5 px-6 py-8 text-[10px] uppercase tracking-wider text-stone-500 sm:flex-row lg:px-12">
        <p>{settings.legalText} <span className="text-stone-400">Designed &amp; built by Code4Flare</span></p>
        <div className="flex gap-4">
          {settings.legalLinks.map((link, index) => (
            <span key={link.href} className="flex gap-4">
              {index > 0 && <span>•</span>}
              <SmartLink href={link.href} className="transition-colors hover:text-brand-gold">{link.label}</SmartLink>
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">{title}</h4>
      <ul className="flex flex-col gap-2.5 text-xs font-light text-stone-400">
        {links.map(({ label, href }) => (
          <li key={`${label}-${href}`}>
            <SmartLink href={href} className="transition-colors hover:text-brand-gold">{label}</SmartLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function collectSocialLinks(settings: SiteSettingsContent): SocialLink[] {
  const candidates = [
    ...settings.footerColumns.flatMap(column => column.links),
    { label: "WhatsApp", href: settings.studioWhatsappUrl },
  ];
  const byPlatform = new Map<SocialPlatform, SocialLink>();

  for (const candidate of candidates) {
    const platform = identifySocialPlatform(candidate);
    if (platform && !byPlatform.has(platform)) byPlatform.set(platform, { platform, ...candidate });
  }

  return socialOrder.flatMap(platform => {
    const link = byPlatform.get(platform);
    return link ? [link] : [];
  });
}

function identifySocialPlatform(link: { label: string; href: string }): SocialPlatform | undefined {
  const value = `${link.label} ${link.href}`.toLowerCase();
  if (value.includes("wa.me") || value.includes("whatsapp.com") || value.includes("whatsapp")) return "whatsapp";
  if (value.includes("instagram")) return "instagram";
  if (value.includes("github")) return "github";
  if (value.includes("tiktok")) return "tiktok";
  if (value.includes("twitter.com") || value.includes("x.com") || /^x(?:\s|$)/.test(value)) return "x";
  return undefined;
}

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === "whatsapp") return <MessageCircle className="size-4" aria-hidden="true" />;

  if (platform === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (platform === "github") {
    return (
      <svg viewBox="0 0 16 16" className="size-4" fill="currentColor" aria-hidden="true">
        <path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.49c-2.23.49-2.7-1.08-2.7-1.08-.37-.93-.9-1.18-.9-1.18-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.51-1.07-1.78-.2-3.65-.89-3.65-3.96 0-.88.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.22 2.2.82A7.64 7.64 0 0 1 8 3.73c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.08-1.88 3.75-3.66 3.95.29.25.54.74.54 1.5v2.31c0 .21.15.46.55.38A8 8 0 0 0 8 0Z" />
      </svg>
    );
  }

  if (platform === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2-2.76V9.4a6.33 6.33 0 1 0 5.45 6.27V8.73a8.16 8.16 0 0 0 4.77 1.52V6.81c-.35 0-.68-.04-1-.12Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 4l16 16M20 4 4 20" />
    </svg>
  );
}
