"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { PRODUCTS, Category, Product, getProductById } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { useCart } from "@/context/CartContext";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Lock,
  BookOpen,
  Check,
} from "lucide-react";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const spotlightSlug = searchParams.get("item");
  const spotlightProduct = spotlightSlug ? getProductById(spotlightSlug) : null;

  const { setDirectBuyProduct, setPeekProduct } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<Category>("All (12)");

  const filteredProducts = PRODUCTS.filter((product) => {
    if (selectedCategory === "All (12)") return product.isFeatured;
    return product.category === selectedCategory;
  }).slice(0, 3);

  const scrollToHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("how-it-works");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSpotlightBuy = () => {
    if (!spotlightProduct) return;
    setDirectBuyProduct(spotlightProduct);
    router.push("/checkout");
  };

  return (
    <div className="space-y-14 sm:space-y-20 py-6 sm:py-10">
      {/* Ad-Landing Spotlight Mode (/?item=<slug>) */}
      {spotlightProduct && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#FFFDF8] via-[#FAF7F0] to-[#F5ECE0] border-2 border-[#C6923A] rounded-3xl p-6 sm:p-10 shadow-gold-glow relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center gap-8 justify-between">
              <div className="flex flex-col sm:flex-row items-center gap-6 max-w-2xl">
                <div className="relative w-36 sm:w-44 aspect-[3/4] rounded-xl overflow-hidden border border-[#C6923A]/50 shadow-xl flex-shrink-0">
                  <Image
                    src={spotlightProduct.coverImage}
                    alt={spotlightProduct.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute left-0 inset-y-0 w-2.5 bg-gradient-to-r from-[#A37424] via-[#C6923A] to-[#8C6118] border-r border-black/20" />
                </div>
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#C6923A] rounded-full text-xs font-bold text-[#8C6118]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C6923A]" />
                    <span>Spotlight Ad Access • 1-Click UPI Unlock</span>
                  </div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0E3B23] leading-tight">
                    {spotlightProduct.title}
                  </h2>
                  <p className="text-sm text-[#5C5343] leading-relaxed">
                    {spotlightProduct.hook}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {spotlightProduct.specPills.map((pill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white border border-[#E6DEC8] rounded-md text-xs font-medium text-[#0E3B23]"
                      >
                        ✓ {pill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & CTA Action */}
              <div className="bg-white p-6 rounded-2xl border border-[#E6DEC8] shadow-sm text-center min-w-[280px] space-y-4">
                <div>
                  <span className="font-heading text-4xl font-extrabold text-[#0E3B23] tabular-price">
                    ₹{spotlightProduct.price}
                  </span>
                  <span className="text-base text-[#8A7E6B] line-through tabular-price ml-2">
                    ₹{spotlightProduct.mrp}
                  </span>
                  <p className="text-xs text-[#059669] font-bold mt-1">
                    Instant PDF Unlock • Zero Login
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleSpotlightBuy}
                    className="w-full flex items-center justify-center gap-2 bg-[#0E3B23] hover:bg-[#165534] text-white text-sm font-semibold py-3.5 px-4 rounded-xl shadow-xs transition-all"
                  >
                    <Lock className="w-4 h-4 text-[#C6923A]" />
                    <span>Pay ₹{spotlightProduct.price} &amp; Unlock PDF</span>
                  </button>

                  <button
                    onClick={() => setPeekProduct(spotlightProduct)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#0E3B23] hover:bg-[#FAF7F0] rounded-lg transition-colors border border-transparent hover:border-[#E6DEC8]"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#C6923A]" />
                    <span>Peek Inside the PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 1. Hero Section matching exact blueprint micro-copy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Eyebrow + Headline + Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill: ⚡ Instant PDF Unlock • No Login */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#C6923A] text-[#8C6118] text-xs font-bold tracking-wide shadow-xs">
              <span>⚡</span>
              <span>Instant PDF Unlock • No Login</span>
            </div>

            {/* Headline: Pay Once. Unlock Your Digital Treasury. */}
            <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0E3B23] tracking-tight leading-[1.12]">
              Pay Once. Unlock Your Digital Treasury.
            </h1>

            {/* Subtext: Curated AI prompt vaults, 8,000+ cartoon videos, databases & templates—delivered the second UPI clears. */}
            <p className="text-base sm:text-lg text-[#5C5343] leading-relaxed max-w-2xl">
              Curated AI prompt vaults, 8,000+ cartoon videos, databases &amp; templates—delivered
              the second UPI clears.
            </p>

            {/* CTAs: [Browse Treasury] [How It Works] */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                href="/resources"
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#0E3B23] hover:bg-[#165534] text-white font-semibold text-sm sm:text-base shadow-sm hover:shadow transition-all group"
              >
                <span>Browse Treasury</span>
                <ArrowRight className="w-4 h-4 text-[#C6923A] group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={scrollToHowItWorks}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-[#FAF7F0] text-[#0E3B23] border border-[#E6DEC8] hover:border-[#C6923A] font-semibold text-sm sm:text-base transition-all"
              >
                <span>How It Works</span>
              </button>
            </div>
          </div>

          {/* Right Column: Crest Emblem Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm aspect-square rounded-3xl bg-white border border-[#E6DEC8] p-8 shadow-card flex flex-col items-center justify-center text-center overflow-hidden group hover:border-[#C6923A] transition-all">
              <div className="absolute inset-0 bg-[radial-gradient(#E6DEC8_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />

              <div className="relative z-10 w-44 h-44 rounded-full bg-[#FAF7F0] border-2 border-[#C6923A]/40 p-4 shadow-inner mb-5 group-hover:scale-105 transition-transform duration-300">
                <div className="relative w-full h-full">
                  <Image
                    src="/logo.png"
                    alt="Lipi Kosha Crest Emblem"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <div className="relative z-10 space-y-1">
                <p className="font-cinzel text-xl font-bold text-[#0E3B23]">
                  LIPI KOSHA
                </p>
                <p className="text-xs text-[#8C6118] font-medium tracking-wide italic">
                  “A Treasury of Digital Resources.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Browse by category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-[#E6DEC8] pb-4">
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#0E3B23] mb-4">
            Browse Treasury Categories
          </h2>
          <CategoryFilter
            activeCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </section>

      {/* 3. Featured bundles (3-card grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C6923A]">
              Handcrafted Vaults
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#0E3B23] mt-1">
              Featured Bundles
            </h2>
          </div>
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0E3B23] hover:text-[#C6923A] transition-colors"
          >
            <span>View all 12 resources</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. How It Works (3 Visual Steps matching blueprint micro-copy) */}
      <section
        id="how-it-works"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8"
      >
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C6923A]">
            Zero Contact • Immediate Fulfillment
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#0E3B23]">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1: 01 Pick a Vault */}
          <div className="bg-white rounded-2xl border border-[#E6DEC8] p-6 shadow-xs hover:border-[#C6923A] transition-colors space-y-3">
            <span className="font-cinzel text-2xl font-bold text-[#C6923A]">01</span>
            <h3 className="font-heading text-lg font-bold text-[#0E3B23]">
              Pick a Vault
            </h3>
            <p className="text-xs text-[#5C5343] leading-relaxed">
              Choose from 12 curated PDF bundles starting at ₹49.
            </p>
          </div>

          {/* Step 2: 02 Pay via UPI */}
          <div className="bg-white rounded-2xl border border-[#E6DEC8] p-6 shadow-xs hover:border-[#C6923A] transition-colors space-y-3">
            <span className="font-cinzel text-2xl font-bold text-[#C6923A]">02</span>
            <h3 className="font-heading text-lg font-bold text-[#0E3B23]">
              Pay via UPI
            </h3>
            <p className="text-xs text-[#5C5343] leading-relaxed">
              One-tap checkout via GPay, PhonePe, or Paytm—no signup.
            </p>
          </div>

          {/* Step 3: 03 Download Now */}
          <div className="bg-white rounded-2xl border border-[#E6DEC8] p-6 shadow-xs hover:border-[#C6923A] transition-colors space-y-3">
            <span className="font-cinzel text-2xl font-bold text-[#C6923A]">03</span>
            <h3 className="font-heading text-lg font-bold text-[#0E3B23]">
              Download Now
            </h3>
            <p className="text-xs text-[#5C5343] leading-relaxed">
              Your PDF unlocks immediately on screen. Save it right away.
            </p>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Bar for Spotlight mode on mobile */}
      {spotlightProduct && (
        <div className="fixed bottom-0 inset-x-0 z-40 p-3 bg-white/95 backdrop-blur-md border-t border-[#E6DEC8] flex items-center justify-between sm:hidden shadow-lg animate-in slide-in-from-bottom duration-200">
          <div>
            <p className="font-bold text-xs text-[#0E3B23] truncate max-w-[180px]">
              {spotlightProduct.title}
            </p>
            <p className="font-extrabold text-sm text-[#0E3B23]">
              ₹{spotlightProduct.price}
            </p>
          </div>
          <button
            onClick={handleSpotlightBuy}
            className="px-5 py-2.5 bg-[#0E3B23] text-white text-xs font-bold rounded-full shadow-xs"
          >
            Pay ₹{spotlightProduct.price} &amp; Unlock PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-[#6B5E49]">Loading Treasury...</div>}>
      <HomeContent />
    </Suspense>
  );
}
