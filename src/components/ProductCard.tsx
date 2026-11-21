"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import {
  Lock,
  Check,
  ShoppingBag,
  Sparkles,
  BookOpen,
  FileText,
} from "lucide-react";

interface ProductCardProps {
  product: Product;
  isSpotlighted?: boolean;
}

export function ProductCard({ product, isSpotlighted = false }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, isInCart, setDirectBuyProduct, setPeekProduct } = useCart();
  const inCart = isInCart(product.id);

  // 3D Card / Book Tilt State
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Subtle tilt within -7 to +7 degrees
    const rX = ((y - centerY) / centerY) * -7;
    const rY = ((x - centerX) / centerX) * 7;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleDirectBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDirectBuyProduct(product);
    router.push("/checkout");
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handlePeekInside = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPeekProduct(product);
  };

  return (
    <div
      id={`product-${product.id}`}
      className={`group relative flex flex-col justify-between bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
        isSpotlighted
          ? "border-[#C6923A] ring-2 ring-[#C6923A] shadow-gold-glow spotlight-active"
          : "border-[#E6DEC8] hover:border-[#C6923A] hover:shadow-card-hover"
      }`}
    >
      {/* Top Banner if Spotlighted */}
      {isSpotlighted && (
        <div className="bg-[#C6923A] text-white text-[11px] font-bold text-center py-1 tracking-wider uppercase flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3" /> Selected Spotlight Item
        </div>
      )}

      {/* Clickable Card Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Interactive 3D Book-Cover Preview Box */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full h-52 rounded-xl bg-gradient-to-b from-[#F7F4EB] to-[#ECE5D4] border border-[#E6DEC8] p-4 mb-4 flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={() => router.push(`/resources/${product.slug}`)}
          style={{
            perspective: "800px",
          }}
        >
          {/* Subtle parchment grain */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0E3B23_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* 3D Book Cover Object */}
          <div
            className="relative w-36 h-44 rounded-r-lg rounded-l-xs bg-[#0E3B23] text-white shadow-xl border-t border-b border-r border-[#C6923A]/50 p-3 flex flex-col justify-between transition-transform duration-100 ease-out select-none"
            style={{
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`,
              boxShadow: "5px 10px 25px rgba(14, 59, 35, 0.28), -2px 0 6px rgba(0,0,0,0.3)",
            }}
          >
            {/* Book Spine Gold Accent */}
            <div className="absolute left-0 inset-y-0 w-2.5 bg-gradient-to-r from-[#A37424] via-[#C6923A] to-[#8C6118] border-r border-black/20" />

            {/* Top Badge */}
            <div className="pl-2 flex items-center justify-between">
              <span className="text-[8px] font-mono tracking-widest uppercase text-[#FAF7F0]/80">
                Lipi Kosha
              </span>
              <span className="text-[7px] font-bold uppercase bg-[#C6923A] text-white px-1.5 py-0.5 rounded">
                PDF
              </span>
            </div>

            {/* Center Book Crest / Emblem */}
            <div className="my-auto pl-2 text-center space-y-1">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-[#C6923A] mx-auto flex items-center justify-center p-1">
                <FileText className="w-4 h-4 text-[#C6923A]" />
              </div>
              <p className="font-cinzel text-[10px] font-bold leading-tight text-[#FAF7F0] line-clamp-2">
                {product.title}
              </p>
            </div>

            {/* Bottom Book Foil Stamp */}
            <div className="pl-2 pt-1 border-t border-[#C6923A]/40 flex items-center justify-between text-[8px] text-[#FAF7F0]/80 font-mono">
              <span>{product.category}</span>
              <span className="font-bold text-[#C6923A]">₹{product.price}</span>
            </div>
          </div>

          {/* Badge top-left */}
          {product.badge && (
            <div className="absolute top-3 left-3 bg-[#FAF7F0] border border-[#C6923A] text-[#8C6118] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              ★ {product.badge}
            </div>
          )}

          {/* Quick Peek Inside overlay button */}
          <button
            onClick={handlePeekInside}
            className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md bg-white/90 hover:bg-white text-[#0E3B23] border border-[#E6DEC8] hover:border-[#C6923A] text-[11px] font-semibold flex items-center gap-1 shadow-xs transition-all backdrop-blur-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#C6923A]" />
            <span>Peek Inside</span>
          </button>
        </div>

        {/* Category Header */}
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#C6923A] mb-1">
          {product.category}
        </p>

        {/* Product Title */}
        <Link
          href={`/resources/${product.slug}`}
          className="font-heading text-base font-bold text-[#0E3B23] hover:text-[#165534] transition-colors leading-snug line-clamp-1 mb-1.5"
        >
          {product.title}
        </Link>

        {/* Short Hook matching Blueprint */}
        <p className="text-xs text-[#5C5343] line-clamp-2 leading-relaxed mb-3">
          {product.hook}
        </p>

        {/* 3 Visual Spec Pills matching Blueprint */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.specPills.map((pill, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium text-[#0E3B23] bg-[#FAF7F0] border border-[#E6DEC8] px-2 py-0.5 rounded-md"
            >
              {pill}
            </span>
          ))}
        </div>

        {/* Price & MRP Row */}
        <div className="mt-auto pt-3 border-t border-[#E6DEC8]/60 flex items-baseline gap-2">
          <span className="font-heading text-xl font-extrabold text-[#0E3B23] tabular-price">
            ₹{product.price}
          </span>
          <span className="text-xs text-[#8A7E6B] line-through tabular-price">
            ₹{product.mrp}
          </span>
          <span className="text-[10px] font-bold text-[#059669] bg-[#E8F5EE] px-2 py-0.5 rounded-full ml-auto">
            {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
          </span>
        </div>
      </div>

      {/* 3 CTAs matching blueprint: [🔒 Pay ₹Price & Download] [Peek Inside] [+ Cart] */}
      <div className="px-5 pb-5 pt-1 space-y-2">
        <button
          onClick={handleDirectBuy}
          className="w-full flex items-center justify-center gap-1.5 bg-[#0E3B23] hover:bg-[#165534] text-white text-xs font-semibold py-2.5 px-3 rounded-xl shadow-xs transition-all active:scale-[0.99]"
        >
          <Lock className="w-3.5 h-3.5 text-[#C6923A]" />
          <span>Pay ₹{product.price} &amp; Download</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handlePeekInside}
            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-white hover:bg-[#FAF7F0] text-[#0E3B23] border border-[#E6DEC8] hover:border-[#C6923A] text-xs font-medium transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#C6923A]" />
            <span>Peek Inside</span>
          </button>

          <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border text-xs font-medium transition-all ${
              inCart
                ? "bg-[#E8F5EE] text-[#059669] border-[#059669]/40"
                : "bg-white hover:bg-[#FAF7F0] text-[#5C5343] border-[#E6DEC8] hover:border-[#C6923A]"
            }`}
          >
            {inCart ? (
              <>
                <Check className="w-3 h-3 text-[#059669]" />
                <span>In Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3" />
                <span>+ Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
