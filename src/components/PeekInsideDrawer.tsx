"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { X, Lock, Check, ShoppingBag, BookOpen, Layers, Sparkles } from "lucide-react";

export function PeekInsideDrawer() {
  const router = useRouter();
  const { peekProduct, setPeekProduct, addToCart, isInCart, setDirectBuyProduct } = useCart();

  if (!peekProduct) return null;

  const inCart = isInCart(peekProduct.id);

  const handleDirectBuy = () => {
    setDirectBuyProduct(peekProduct);
    setPeekProduct(null);
    router.push("/checkout");
  };

  const handleAddToCart = () => {
    addToCart(peekProduct);
    setPeekProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setPeekProduct(null)}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F0] border-l border-[#E6DEC8] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-6 bg-white border-b border-[#E6DEC8] flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#0E3B23]">
              <BookOpen className="w-5 h-5 text-[#C6923A]" />
              <h3 className="font-cinzel text-lg font-bold text-[#0E3B23]">
                Inside the PDF
              </h3>
            </div>
            <button
              onClick={() => setPeekProduct(null)}
              className="p-1.5 rounded-full hover:bg-[#F3EDE0] text-[#5C5343] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title & Category */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C6923A] bg-white border border-[#E6DEC8] px-2.5 py-0.5 rounded-full">
                {peekProduct.category}
              </span>
              <h2 className="font-heading text-xl font-bold text-[#0E3B23]">
                {peekProduct.title}
              </h2>
              <p className="text-xs text-[#5C5343]">{peekProduct.hook}</p>
            </div>

            {/* Spec Pills */}
            <div className="flex flex-wrap gap-2">
              {peekProduct.specPills.map((pill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-white border border-[#E6DEC8] rounded-md text-[11px] font-medium text-[#0E3B23]"
                >
                  {pill}
                </span>
              ))}
            </div>

            {/* Visual Table-of-Contents Drawer (Module Pills & Item Counts) */}
            <div className="space-y-3 pt-2 border-t border-[#E6DEC8]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0E3B23] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#C6923A]" />
                <span>Modules &amp; Table of Contents</span>
              </h4>

              <div className="space-y-3">
                {peekProduct.modules.map((mod, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white border border-[#E6DEC8] shadow-xs space-y-1.5 hover:border-[#C6923A] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-sm font-bold text-[#0E3B23]">
                        {mod.title}
                      </span>
                      <span className="text-[10px] font-bold text-[#059669] bg-[#E8F5EE] px-2 py-0.5 rounded-full">
                        {mod.itemCount}
                      </span>
                    </div>
                    <p className="text-xs text-[#5C5343] leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables Checklist */}
            <div className="space-y-2.5 pt-2 border-t border-[#E6DEC8]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0E3B23]">
                Included Deliverables:
              </h4>
              <ul className="space-y-2">
                {peekProduct.deliverables.map((deliv, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#4A4234]">
                    <Check className="w-3.5 h-3.5 text-[#059669] flex-shrink-0 mt-0.5" />
                    <span>{deliv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer CTAs */}
          <div className="p-6 bg-white border-t border-[#E6DEC8] space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="font-heading text-2xl font-extrabold text-[#0E3B23] tabular-price">
                  ₹{peekProduct.price}
                </span>
                <span className="text-xs text-[#8A7E6B] line-through tabular-price ml-2">
                  ₹{peekProduct.mrp}
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#059669] bg-[#E8F5EE] px-2.5 py-0.5 rounded-full">
                Instant PDF Unlock
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleDirectBuy}
                className="flex items-center justify-center gap-1.5 bg-[#0E3B23] hover:bg-[#165534] text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-xs transition-all active:scale-[0.99]"
              >
                <Lock className="w-3.5 h-3.5 text-[#C6923A]" />
                <span>Pay ₹{peekProduct.price}</span>
              </button>

              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-1.5 bg-[#FAF7F0] hover:bg-[#F3EDE0] text-[#0E3B23] border border-[#E6DEC8] text-xs font-semibold py-3 px-4 rounded-xl transition-all"
              >
                {inCart ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#059669]" />
                    <span>In Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>+ Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
