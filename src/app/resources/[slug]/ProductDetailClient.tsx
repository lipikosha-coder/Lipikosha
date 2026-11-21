"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/ProductCard";
import {
  Lock,
  Check,
  ShoppingBag,
  ShieldCheck,
  FileText,
  ArrowRight,
  FolderOpen,
} from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart, isInCart, setDirectBuyProduct } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = isInCart(product.id);

  const handlePayAndDownload = () => {
    setDirectBuyProduct(product);
    router.push("/checkout");
  };

  const handleAddToCart = () => {
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2500);
  };

  return (
    <div className="space-y-16">
      {/* 2-Column Product Layout matching wireframe */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Visual Preview + What's inside Checklist */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Visual Preview Box */}
          <div className="relative w-full aspect-video sm:aspect-[16/10] rounded-2xl border border-[#E6DEC8] bg-gradient-to-br from-[#FAF7F0] via-white to-[#F3EDE0] p-8 flex flex-col justify-between overflow-hidden shadow-card">
            {/* Background geometric overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#0E3B23_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

            {/* Top row badges */}
            <div className="relative z-10 flex items-center justify-between">
              {product.badge && (
                <span className="bg-[#FAF7F0] border border-[#C6923A] text-[#8C6118] text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                  {product.badge}
                </span>
              )}
              <span className="bg-white/90 border border-[#E6DEC8] text-[#5C5343] text-xs font-mono px-2.5 py-1 rounded-md flex items-center gap-1">
                <span className="font-bold text-[#0E3B23]">PDF</span>
                <span>Document</span>
              </span>
            </div>

            {/* Center icon / banner */}
            <div className="relative z-10 my-auto text-center py-6 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-white border border-[#E6DEC8] shadow-sm mx-auto flex items-center justify-center text-[#0E3B23]">
                <FileText className="w-8 h-8 text-[#0E3B23]" />
              </div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#0E3B23]">
                {product.title}
              </h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#E6DEC8] text-xs font-medium text-[#6B5E49]">
                <span>Delivered File:</span>
                <span className="font-mono text-[#0E3B23] font-semibold">{product.fileName}</span>
              </div>
            </div>

            {/* Bottom metadata strip */}
            <div className="relative z-10 flex items-center justify-between text-xs text-[#6B5E49] pt-4 border-t border-[#E6DEC8]/60">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#059669]" />
                <span>Verified Clean &amp; Instant Access</span>
              </span>
              <span>Updated {product.specs.updatedAt}</span>
            </div>
          </div>

          {/* What's inside Section matching wireframe */}
          <div className="bg-white rounded-2xl border border-[#E6DEC8] p-6 sm:p-8 shadow-card space-y-6">
            <div className="border-b border-[#E6DEC8] pb-4 flex items-center justify-between">
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#0E3B23]">
                What&apos;s inside
              </h3>
              <span className="text-xs font-semibold text-[#C6923A] bg-[#FAF7F0] border border-[#E6DEC8] px-3 py-1 rounded-full">
                {product.deliverables.length} Deliverables
              </span>
            </div>

            {/* Checklist items with checkmarks */}
            <ul className="space-y-3.5">
              {product.deliverables.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-[#4A4234]">
                  <div className="w-5 h-5 rounded-full bg-[#E8F5EE] border border-[#059669]/30 text-[#059669] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span className="leading-relaxed font-medium">{item}</span>
                </li>
              ))}
            </ul>

            {/* PDF File Details */}
            <div className="pt-4 border-t border-[#E6DEC8]">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6B5E49] mb-3 flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5 text-[#0E3B23]" />
                Instant Download Deliverable
              </p>
              <div className="p-3 rounded-lg bg-[#FAF7F0] border border-[#E6DEC8] font-mono text-xs flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-[#0E3B23] flex-shrink-0" />
                  <span className="text-[#0E3B23] font-semibold truncate">{product.fileName}</span>
                </div>
                <span className="text-[11px] font-bold text-[#059669] bg-[#E8F5EE] px-2 py-0.5 rounded flex-shrink-0 ml-2">
                  Ready to Download
                </span>
              </div>
            </div>

            {/* Specifications Details */}
            <div className="pt-4 border-t border-[#E6DEC8] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E6DEC8]">
                <span className="font-semibold text-[#0E3B23] block mb-1">Commercial License</span>
                <span className="text-[#5C5343]">{product.specs.license}</span>
              </div>
              <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E6DEC8]">
                <span className="font-semibold text-[#0E3B23] block mb-1">Compatibility</span>
                <span className="text-[#5C5343]">{product.specs.compatibility}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Purchase Panel matching wireframe */}
        <div className="lg:col-span-5 sticky top-28 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E6DEC8] p-6 sm:p-8 shadow-card space-y-6">
            {/* Badge top */}
            {product.badge && (
              <div className="inline-block bg-[#FAF7F0] border border-[#C6923A] text-[#8C6118] text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                {product.badge}
              </div>
            )}

            {/* Product Title */}
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#0E3B23] leading-tight">
                {product.title}
              </h1>
              <p className="text-xs font-semibold text-[#6B5E49] mt-2 tracking-wide">
                {product.category} · PDF • {product.formats || product.fileName}
              </p>
            </div>

            {/* Spec Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {product.specPills?.map((pill, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-[#FAF7F0] border border-[#E6DEC8] rounded-md text-[11px] font-medium text-[#0E3B23]"
                >
                  {pill}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-sm text-[#5C5343] leading-relaxed">
              {product.description || product.hook}
            </p>

            {/* Pricing Section matching wireframe */}
            <div className="pt-4 border-t border-[#E6DEC8]">
              <div className="flex items-baseline gap-3">
                <span className="font-heading text-4xl font-extrabold text-[#0E3B23] tabular-price">
                  ₹{product.price}
                </span>
                <span className="text-lg text-[#8A7E6B] line-through tabular-price">
                  ₹{product.mrp}
                </span>
                <span className="text-xs font-bold text-[#059669] bg-[#E8F5EE] border border-[#059669]/20 px-2.5 py-0.5 rounded-full">
                  Save ₹{product.mrp - product.price} (
                  {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF)
                </span>
              </div>
              <p className="text-[11px] text-[#8A7E6B] mt-1">
                Inclusive of all taxes. One-time payment, perpetual usage.
              </p>
            </div>

            {/* Primary & Secondary Action CTAs matching wireframe */}
            <div className="space-y-3 pt-2">
              {/* Primary: Pay ₹[Price] & Download */}
              <button
                onClick={handlePayAndDownload}
                className="w-full flex items-center justify-center gap-2.5 bg-[#0E3B23] hover:bg-[#165534] text-white text-base font-semibold py-4 px-6 rounded-xl shadow-sm hover:shadow transition-all active:scale-[0.99] focus:outline-none"
              >
                <Lock className="w-5 h-5 text-[#C6923A]" />
                <span>Pay ₹{product.price} &amp; Download</span>
              </button>

              {/* Secondary: Add to Cart */}
              <button
                onClick={handleAddToCart}
                className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl border text-sm font-semibold transition-all ${
                  inCart || justAdded
                    ? "bg-[#E8F5EE] text-[#059669] border-[#059669]/40"
                    : "bg-white hover:bg-[#FAF7F0] text-[#0E3B23] border-[#E6DEC8] hover:border-[#C6923A]"
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4 text-[#059669]" />
                    <span>Added to Cart!</span>
                  </>
                ) : inCart ? (
                  <>
                    <Check className="w-4 h-4 text-[#059669]" />
                    <span>Already in Cart (View Cart)</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#0E3B23]" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>

            {/* Reassurance text matching wireframe: Instant PDF download • Secure UPI payment */}
            <div className="pt-2 text-center">
              <p className="text-xs font-semibold text-[#0E3B23] flex items-center justify-center gap-2">
                <span>Instant PDF download</span>
                <span className="text-[#C6923A]">•</span>
                <span>Secure UPI payment</span>
              </p>
            </div>

            {/* Trust Points Mini List */}
            <div className="pt-4 border-t border-[#E6DEC8] space-y-2 text-xs text-[#5C5343]">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#059669]" />
                <span>Direct browser PDF download immediately upon payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#059669]" />
                <span>No account required • Ephemeral zero-friction checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#059669]" />
                <span>Works on all UPI apps (GPay, PhonePe, Paytm, CRED)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* More from the Treasury */}
      <section className="pt-12 border-t border-[#E6DEC8] space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="font-cinzel text-2xl font-bold text-[#0E3B23]">
            More from the Treasury
          </h2>
          <Link
            href="/resources"
            className="text-xs font-semibold text-[#0E3B23] hover:text-[#C6923A] flex items-center gap-1 transition-colors"
          >
            <span>View all 12 resources</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedProducts.map((rel) => (
            <ProductCard key={rel.id} product={rel} />
          ))}
        </div>
      </section>
    </div>
  );
}
