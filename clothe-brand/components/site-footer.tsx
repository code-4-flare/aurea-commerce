"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

import { SiteSettingsContent } from "@/src/sanity/lib/site";

export default function SiteFooter({ settings }: { settings: SiteSettingsContent }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (event: FormEvent) => {
    event.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

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
              <Link key={`${image.caption}-${image.image}`} href={image.href} className="group relative aspect-square w-full overflow-hidden">
                <Image src={image.image} alt={image.caption} width={800} height={800} className="h-full w-full object-cover object-center transition-all duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 flex flex-col justify-end bg-brand-dark/40 p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="mb-1 block text-[9px] font-bold uppercase tracking-widest text-brand-gold">Aurea Lookbook</span>
                  <p className="font-serif text-xs italic tracking-wide text-brand-cream">{image.caption}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-12 lg:px-12">
        <div className="space-y-4 md:col-span-5">
          <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">{settings.newsletterEyebrow}</span>
          <h3 className="font-serif text-lg font-light text-brand-cream">{settings.newsletterTitle}</h3>
          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex max-w-md gap-2 pt-2">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={event => setEmail(event.target.value)}
                className="flex-grow border-b border-white/20 bg-transparent py-2.5 pl-1 pr-6 text-xs text-brand-cream placeholder:text-stone-500 focus:border-brand-gold focus:outline-none"
              />
              <button type="submit" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand-gold transition-colors hover:text-brand-cream">
                Enroll <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          ) : (
            <div className="max-w-md rounded-xl border border-brand-gold/35 bg-brand-gold/10 p-4 text-xs font-semibold text-brand-gold">
              Thank you. You are enrolled for our private seasonal previews.
            </div>
          )}
        </div>

        <div className="grid gap-8 md:col-span-7 sm:grid-cols-3">
          {settings.footerColumns.map(column => (
            <FooterColumn key={column.title} title={column.title} links={column.links} />
          ))}
          <div className="space-y-4 sm:col-span-1">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">{settings.studioHeading}</h4>
            <div className="space-y-2 text-xs font-light leading-relaxed text-stone-400">
              <p>Nairobi Studio:</p>
              <p className="font-semibold text-brand-cream">{settings.studioAddress}</p>
              <p>{settings.studioContactLabel}</p>
              <a href={settings.studioWhatsappUrl} target="_blank" rel="noreferrer" className="block font-semibold text-brand-gold hover:underline">
                {settings.studioPhone}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/5 px-6 py-8 text-[10px] uppercase tracking-wider text-stone-500 sm:flex-row lg:px-12">
        <p>{settings.legalText}</p>
        <div className="flex gap-4">
          {settings.legalLinks.map((link, index) => (
            <span key={link.href} className="flex gap-4">
              {index > 0 && <span>•</span>}
              <Link href={link.href} className="transition-colors hover:text-brand-gold">{link.label}</Link>
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
          <li key={label}>
            <Link href={href} className="transition-colors hover:text-brand-gold">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
