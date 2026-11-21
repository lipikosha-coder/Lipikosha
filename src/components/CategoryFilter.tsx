"use client";

import React from "react";
import { CATEGORIES, Category } from "@/lib/products";

interface CategoryFilterProps {
  activeCategory: Category;
  onSelectCategory: (category: Category) => void;
}

export function CategoryFilter({
  activeCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none py-1">
      {CATEGORIES.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 flex-shrink-0 ${
              isActive
                ? "bg-[#0E3B23] text-white shadow-sm border border-[#0E3B23]"
                : "bg-white text-[#5C5343] border border-[#E6DEC8] hover:border-[#C6923A] hover:bg-[#FAF7F0] hover:text-[#0E3B23]"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
