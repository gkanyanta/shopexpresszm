"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ShopFiltersProps {
  categories: Category[];
  currentParams: Record<string, string | undefined>;
}

export function ShopFilters({ categories, currentParams }: ShopFiltersProps) {
  const router = useRouter();
  const [search, setSearch] = useState(currentParams.search || "");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  function updateFilter(key: string, value: string | undefined) {
    const params = new URLSearchParams();
    Object.entries(currentParams).forEach(([k, v]) => {
      if (v && k !== "page") params.set(k, v);
    });
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateFilter("search", search || undefined);
  }

  const filterContent = (
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearch}>
        <Label className="text-sm font-semibold mb-2 block">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="pl-9"
          />
        </div>
      </form>

      <Separator />

      {/* Categories */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Categories</Label>
        <div className="space-y-2">
          <button
            onClick={() => updateFilter("category", undefined)}
            className={`text-sm w-full text-left px-2 py-1 rounded ${!currentParams.category ? "bg-amber-50 text-amber-700 font-medium" : "text-zinc-600 hover:text-zinc-900"}`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter("category", cat.slug)}
              className={`text-sm w-full text-left px-2 py-1 rounded ${currentParams.category === cat.slug ? "bg-amber-50 text-amber-700 font-medium" : "text-zinc-600 hover:text-zinc-900"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Sort */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Sort By</Label>
        <select
          value={currentParams.sort || "newest"}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="popular">Popular</option>
        </select>
      </div>

      <Separator />

      {/* Source filter */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Source</Label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={!currentParams.local}
              onCheckedChange={() => updateFilter("local", undefined)}
            />
            All Products
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={currentParams.local === "true"}
              onCheckedChange={() => updateFilter("local", "true")}
            />
            Local Only
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={currentParams.local === "false"}
              onCheckedChange={() => updateFilter("local", "false")}
            />
            International Only
          </label>
        </div>
      </div>

      {/* Clear filters */}
      {Object.keys(currentParams).length > 0 && (
        <>
          <Separator />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/shop")}
          >
            Clear All Filters
          </Button>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          {showMobileFilters ? "Hide Filters" : "Show Filters"}
        </Button>
        {showMobileFilters && (
          <div className="mt-4 bg-white rounded-xl border p-4">
            {filterContent}
          </div>
        )}
      </div>

      {/* Desktop filters sidebar */}
      <aside className="hidden lg:block">
        <div className="bg-white rounded-xl border p-5 sticky top-24">
          <h3 className="font-semibold text-zinc-900 mb-4 flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </h3>
          {filterContent}
        </div>
      </aside>
    </>
  );
}
