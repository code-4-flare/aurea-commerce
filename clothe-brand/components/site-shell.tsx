"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";

import CartDrawer from "@/components/cart-drawer";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import SearchOverlay from "@/components/search-overlay";
import { Toaster } from "@/components/ui/sonner";
import { SiteSettingsContent } from "@/src/sanity/lib/site";

export default function SiteShell({ children, settings }: { children: React.ReactNode; settings: SiteSettingsContent }) {
  const pathname = usePathname();

  return (
    <div className="relative flex min-h-screen flex-col bg-brand-cream selection:bg-brand-gold/30 selection:text-brand-dark">
      <SiteHeader currentPath={pathname} settings={settings} />
      <CartDrawer />
      <SearchOverlay />
      <main className="flex-grow overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <SiteFooter settings={settings} />
      <Toaster />
    </div>
  );
}
