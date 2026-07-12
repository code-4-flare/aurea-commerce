"use client";

import { SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import FilterSidebar from "@/components/filter-sidebar";
import ProductGrid from "@/components/product-grid";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ColorSwatch, FilterState, Product } from "@/utils/types";

const initialFilters: FilterState = {
  category: [],
  color: [],
  size: [],
  priceRange: [0, 20000],
  availability: "all",
};

type ShopClientProps = {
  products: Product[];
  title?: string;
  onlyNew?: boolean;
};

export default function ShopClient({ products, title = "New Arrivals", onlyNew = false }: ShopClientProps) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const baseProducts = useMemo(() => (onlyNew ? products.filter(product => product.badge === "New In") : products), [onlyNew, products]);
  const filterOptions = useMemo(() => {
    const categories = Array.from(new Set(products.map(product => product.category).filter(Boolean))).sort();
    const colorsByName = new Map<string, ColorSwatch>();
    const sizes = new Set<string>();

    products.forEach(product => {
      product.colors.forEach(color => colorsByName.set(color.name, color));
      product.sizes.forEach(size => sizes.add(size));
    });

    return {
      categories,
      colors: Array.from(colorsByName.values()),
      sizes: Array.from(sizes).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    };
  }, [products]);

  const resetFilters = () => {
    setFilters(initialFilters);
    setSearchTerm("");
  };

  const filteredProducts = useMemo(() => {
    let result = [...baseProducts];
    const term = searchTerm.trim().toLowerCase();

    if (term) result = result.filter(product => product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term));
    if (filters.category.length > 0) result = result.filter(product => filters.category.includes(product.category));
    if (filters.color.length > 0) result = result.filter(product => product.colors.some(color => filters.color.includes(color.name)));
    if (filters.size.length > 0) result = result.filter(product => product.sizes.some(size => filters.size.includes(size)));
    result = result.filter(product => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]);
    if (filters.availability === "inStock") result = result.filter(product => product.inStock);
    if (filters.availability === "outOfStock") result = result.filter(product => !product.inStock);
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [baseProducts, filters, searchTerm, sortBy]);

  const hasActiveFilters = filters.category.length > 0 || filters.color.length > 0 || filters.size.length > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 20000 || filters.availability !== "all" || searchTerm !== "";

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
      <nav className="mb-6 flex items-center gap-2 text-xs uppercase tracking-wider text-stone-500">
        <Link href="/" className="hover:text-brand-gold">Home</Link>
        <span>/</span>
        <span className="font-medium text-brand-dark">{title}</span>
      </nav>

      <div className="mb-10 flex flex-col gap-6 border-b border-brand-dark/10 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-serif text-4xl font-normal tracking-tight text-brand-dark lg:text-5xl">{title}</h1>
          <p className="mt-2 text-xs font-light text-stone-500">Showing {filteredProducts.length} of {baseProducts.length} premium creations.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setIsMobileFiltersOpen(true)} className="md:hidden">
            <SlidersHorizontal data-icon="inline-start" /> Filters
          </Button>
          {hasActiveFilters && <button onClick={resetFilters} className="text-xs font-semibold uppercase tracking-wider text-brand-gold underline underline-offset-4 hover:text-brand-dark">Clear All Filters</button>}
          <div className="flex items-center gap-2 rounded-full border border-brand-dark/15 bg-white px-5 py-2.5 text-xs">
            <span className="uppercase text-stone-400">Sort By:</span>
            <Select value={sortBy} onValueChange={value => setSortBy(value as typeof sortBy)} className="border-0 p-0">
              <SelectItem value="featured">Featured Picks</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
        <aside className="hidden rounded-2xl border border-brand-dark/5 bg-white/40 p-6 backdrop-blur-sm md:sticky md:top-28 md:col-span-3 md:block">
          <div className="mb-6 flex items-center justify-between border-b border-brand-dark/10 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-dark">Filter Selection</span>
            {hasActiveFilters && <button onClick={resetFilters} className="text-[10px] font-semibold uppercase text-brand-gold hover:text-brand-dark">Reset</button>}
          </div>
          <FilterSidebar filters={filters} setFilters={setFilters} searchTerm={searchTerm} setSearchTerm={setSearchTerm} options={filterOptions} />
        </aside>
        <section className="md:col-span-9">
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="rounded-2xl border border-brand-dark/5 bg-white px-4 py-20 text-center">
              <p className="mb-4 font-serif text-lg italic text-brand-dark">No matching pieces found.</p>
              <p className="mx-auto mb-6 max-w-sm text-xs font-light text-stone-500">Try widening your price filters, selecting a different color, or clearing active searches to explore the full collection.</p>
              <Button onClick={resetFilters}>Reset Store Selection</Button>
            </div>
          )}
        </section>
      </div>

      <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
        <SheetContent>
          <button className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm" aria-label="Close filters" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className="relative z-10 ml-auto flex h-full w-full max-w-sm flex-col overflow-y-auto bg-brand-cream p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between border-b border-brand-dark/10 pb-4">
              <SheetTitle className="text-sm font-bold uppercase tracking-widest text-brand-dark">Filters</SheetTitle>
              <div className="flex items-center gap-3">
                {hasActiveFilters && <button onClick={resetFilters} className="text-xs font-semibold uppercase text-brand-gold">Clear</button>}
                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-1.5 transition-colors hover:text-brand-gold" aria-label="Close filters"><X className="h-6 w-6" /></button>
              </div>
            </div>
            <FilterSidebar filters={filters} setFilters={setFilters} searchTerm={searchTerm} setSearchTerm={setSearchTerm} options={filterOptions} />
            <div className="sticky bottom-0 -mx-6 mt-8 border-t border-brand-dark/10 bg-brand-cream p-4">
              <Button onClick={() => setIsMobileFiltersOpen(false)} className="w-full">Apply Filters ({filteredProducts.length} items)</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
