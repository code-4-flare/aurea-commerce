"use client";

import { X } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ColorSwatch, FilterState } from "@/utils/types";

type FilterSidebarProps = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  options: {
    categories: string[];
    colors: ColorSwatch[];
    sizes: string[];
  };
};

export default function FilterSidebar({ filters, setFilters, searchTerm, setSearchTerm, options }: FilterSidebarProps) {
  const toggleFilter = (key: "category" | "color" | "size", value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter(item => item !== value) : [...prev[key], value],
    }));
  };

  return (
    <div className="flex flex-col gap-8 py-2">
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-dark">Search Store</h3>
        <div className="relative flex items-center">
          <Input value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Type keyword..." className="rounded-lg bg-white py-2" />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-3 text-stone-400 hover:text-brand-dark" aria-label="Clear search">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <FilterSection title="Categories">
        {options.categories.map(category => (
          <label key={category} className="flex cursor-pointer items-center justify-between text-xs text-stone-600 hover:text-brand-dark">
            <span className={filters.category.includes(category) ? "font-medium text-brand-dark" : ""}>{category}</span>
            <Checkbox checked={filters.category.includes(category)} onChange={() => toggleFilter("category", category)} />
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Colors">
        <div className="grid grid-cols-4 gap-2">
          {options.colors.map(color => (
            <button
              key={color.name}
              onClick={() => toggleFilter("color", color.name)}
              className={`flex flex-col items-center gap-1.5 rounded-lg border p-1.5 text-[9px] transition-colors hover:border-brand-dark/50 ${filters.color.includes(color.name) ? "border-brand-gold bg-brand-gold/5" : "border-brand-dark/5"}`}
              title={color.name}
            >
              <span className="size-4 rounded-full border border-brand-dark/10 shadow-inner" style={{ backgroundColor: color.value }} />
              <span className="max-w-full truncate text-[8px] font-light tracking-tight text-stone-600">{color.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Sizes">
        <div className="flex flex-wrap gap-1.5">
          {options.sizes.map(size => (
            <button
              key={size}
              onClick={() => toggleFilter("size", size)}
              className={`flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-[10px] font-semibold transition-all ${filters.size.includes(size) ? "border-brand-dark bg-brand-dark text-brand-cream shadow-sm" : "border-brand-dark/15 text-brand-dark hover:border-brand-dark"}`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-light text-stone-500">
            <span>Min: KSh {filters.priceRange[0].toLocaleString()}</span>
            <span>Max: KSh {filters.priceRange[1].toLocaleString()}</span>
          </div>
          <div className="flex gap-2">
            {[
              { label: "All Prices", value: [0, 20000] as [number, number] },
              { label: "Under 10k", value: [0, 10000] as [number, number] },
              { label: "10k - 15k", value: [10000, 15000] as [number, number] },
              { label: "Over 15k", value: [15000, 20000] as [number, number] },
            ].map(range => (
              <button
                key={range.label}
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, priceRange: range.value }))}
                className={`flex-1 rounded-md border py-1.5 text-center text-[10px] transition-all ${filters.priceRange[0] === range.value[0] && filters.priceRange[1] === range.value[1] ? "border-brand-gold bg-brand-gold font-medium text-brand-dark" : "border-brand-dark/10 text-stone-600 hover:border-brand-dark/30"}`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Availability">
        <RadioGroup>
          {[
            { id: "all", label: "Show All Products" },
            { id: "inStock", label: "In Stock Only" },
            { id: "outOfStock", label: "Out of Stock" },
          ].map(item => (
            <label key={item.id} className="flex cursor-pointer items-center gap-2.5 text-left text-xs text-stone-600 hover:text-brand-dark">
              <RadioGroupItem name="availability" checked={filters.availability === item.id} onChange={() => setFilters(prev => ({ ...prev, availability: item.id as FilterState["availability"] }))} />
              <span className={filters.availability === item.id ? "font-medium text-brand-dark" : ""}>{item.label}</span>
            </label>
          ))}
        </RadioGroup>
      </FilterSection>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-dark">{title}</h3>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}
