"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCommerceStore } from "@/store/use-commerce-store";

export default function SearchOverlay() {
  const router = useRouter();
  const isOpen = useCommerceStore(state => state.isSearchOpen);
  const closeSearch = useCommerceStore(state => state.closeSearch);
  const [searchQuery, setSearchQuery] = useState("");

  const goToSearch = (query: string) => {
    const params = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";
    router.push(`/shop${params}`);
    closeSearch();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    goToSearch(searchQuery);
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && closeSearch()}>
      <DialogContent>
        <button className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm" aria-label="Close search" onClick={closeSearch} />
        <div className="relative bg-brand-cream px-6 py-10 shadow-xl">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center justify-between">
              <DialogTitle className="font-serif text-lg uppercase tracking-widest text-brand-dark">Search Aurea</DialogTitle>
              <button onClick={closeSearch} className="p-2 transition-colors hover:text-brand-gold" aria-label="Close search">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <Input
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                placeholder="Search Linen Blazer, Bomber Jacket, Wide Leg Trousers..."
                className="rounded-none border-x-0 border-t-0 bg-transparent py-4 pl-2 pr-12 text-lg tracking-wide"
                autoFocus
              />
              <button type="submit" className="absolute right-2 p-2 text-brand-dark transition-colors hover:text-brand-gold">
                <Search className="h-6 w-6" />
              </button>
            </form>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs tracking-wider">
              <span className="uppercase text-stone-500">Suggested:</span>
              {["Blazer", "Bomber Jacket", "Midi Dress", "Linen"].map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => goToSearch(tag)}
                  className="rounded-full border border-brand-dark/10 bg-white/50 px-3 py-1 transition-colors hover:border-brand-gold hover:text-brand-gold"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
