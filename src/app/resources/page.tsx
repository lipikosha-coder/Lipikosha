"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS, Category, CATEGORIES } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Search, Sparkles, Filter } from "lucide-react";

function ResourcesContent() {
  const searchParams = useSearchParams();
  const spotlightItemId = searchParams.get("item");
  const initialCategoryParam = searchParams.get("category");

  const [activeCategory, setActiveCategory] = useState<Category>(() => {
    if (initialCategoryParam && CATEGORIES.includes(initialCategoryParam as Category)) {
      return initialCategoryParam as Category;
    }
    return "All (12)";
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Scroll to spotlight item if present
  useEffect(() => {
    if (spotlightItemId) {
      const element = document.getElementById(`product-${spotlightItemId}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);
      }
    }
  }, [spotlightItemId]);

  // Filter products
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory =
      activeCategory === "All (12)" || product.category === activeCategory;

    const matchesSearch =
      searchQuery.trim() === "" ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.hook.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Intro */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#0E3B23]">
              All Resources
            </h1>
            <p className="text-sm text-[#5C5343] mt-1">
              Explore our master treasury of digital bundles, ChatGPT prompt treasuries,
              marketing databases, and creator suites.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A7E6B]" />
            <input
              type="text"
              placeholder="Search bundles, files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#E6DEC8] rounded-full focus:outline-none focus:border-[#C6923A] focus:ring-1 focus:ring-[#C6923A] transition-colors placeholder:text-[#8A7E6B]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A7E6B] hover:text-[#0E3B23]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category filter pills: All Resources (12), Bundles, AI & Prompts, Marketing & Data, Videos & Animation, Software & Tools */}
        <div className="pt-2">
          <CategoryFilter
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </div>
      </div>

      {/* Spotlight notice banner if item query param is present */}
      {spotlightItemId && (
        <div className="flex items-center gap-2 p-3 bg-[#FAF7F0] border border-[#C6923A] rounded-xl text-xs text-[#8C6118] font-medium animate-in fade-in">
          <Sparkles className="w-4 h-4 text-[#C6923A] flex-shrink-0" />
          <span>
            Highlighting requested resource:{" "}
            <strong>{PRODUCTS.find((p) => p.id === spotlightItemId)?.title || spotlightItemId}</strong>
          </span>
        </div>
      )}

      {/* 3-column responsive product grid matching wireframe */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSpotlighted={product.id === spotlightItemId}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E6DEC8] p-12 text-center space-y-4">
          <Filter className="w-10 h-10 text-[#C6923A] mx-auto opacity-70" />
          <h3 className="font-heading text-lg font-bold text-[#0E3B23]">
            No resources found
          </h3>
          <p className="text-xs text-[#5C5343] max-w-sm mx-auto">
            We couldn&apos;t find any assets matching your search &ldquo;{searchQuery}&rdquo; in {activeCategory}.
          </p>
          <button
            onClick={() => {
              setActiveCategory("All (12)");
              setSearchQuery("");
            }}
            className="px-4 py-2 bg-[#0E3B23] text-white text-xs font-semibold rounded-full hover:bg-[#165534] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Counter matching wireframe: "Showing X of 12 resources" */}
      <div className="pt-8 pb-4 text-center border-t border-[#E6DEC8]">
        <p className="text-sm font-medium text-[#6B5E49]">
          Showing {filteredProducts.length} of {PRODUCTS.length} resources
        </p>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-[#6B5E49]">
          Loading Treasury Resources...
        </div>
      }
    >
      <ResourcesContent />
    </Suspense>
  );
}
