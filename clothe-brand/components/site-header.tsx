"use client";

import { Menu, Search, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { SiteSettingsContent } from "@/src/sanity/lib/site";
import { useCommerceStore } from "@/store/use-commerce-store";

export default function SiteHeader({ currentPath, settings }: { currentPath: string; settings: SiteSettingsContent }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartCount = useCommerceStore(state => state.cartItems.reduce((total, item) => total + item.quantity, 0));
  const openCart = useCommerceStore(state => state.openCart);
  const openSearch = useCommerceStore(state => state.openSearch);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-brand-dark/5 bg-brand-cream/80 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open mobile menu">
            <Menu />
          </Button>

          <nav className="hidden items-center gap-8 text-xs font-medium uppercase tracking-widest md:flex">
            {settings.navigation.map(item => {
              const active = currentPath === item.href;
              return (
                <Link key={item.href} href={item.href} className={`relative py-2 transition-colors hover:text-brand-gold ${active ? "text-brand-gold font-semibold" : "text-brand-dark"}`}>
                  {item.label}
                  {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold" />}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-1 justify-center md:flex-initial">
            <Link href="/" className="flex items-center transition-opacity hover:opacity-80" aria-label={`${settings.brandName} home`}>
              <Image src="/aurea-logo.svg" alt={settings.brandName} width={168} height={38} priority className="h-10 w-auto" />
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" onClick={openSearch} aria-label="Search">
              <Search />
            </Button>
            <Button variant="ghost" size="icon" onClick={openCart} aria-label="Cart" className="relative">
              <ShoppingBag />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-dark px-1 text-[10px] font-semibold text-brand-cream">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <button className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm" aria-label="Close menu" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative z-10 flex w-full max-w-xs flex-col bg-brand-cream p-8 shadow-2xl">
            <div className="mb-12 flex items-center justify-between">
              <Image src="/aurea-logo.svg" alt={settings.brandName} width={146} height={34} className="h-9 w-auto" />
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                <X />
              </Button>
            </div>
            <div className="flex flex-col gap-6 text-sm font-medium uppercase tracking-[0.2em]">
              {settings.mobileNavigation.map(item => (
                <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="text-left transition-colors hover:text-brand-gold">
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-auto border-t border-brand-dark/10 pt-6">
              <div className="flex flex-col gap-4 text-xs tracking-wider text-stone-500">
                <p>{settings.customerExperienceLabel}</p>
                <p className="font-semibold text-brand-dark">{settings.customerExperiencePhone}</p>
                <p>{settings.customerExperienceHours}</p>
                <p className="text-[10px]">{settings.customerExperienceLocation}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
