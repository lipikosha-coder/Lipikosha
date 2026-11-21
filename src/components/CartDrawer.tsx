"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { X, Trash2, ArrowRight, ShoppingBag, Plus, Zap, ShieldCheck } from "lucide-react";

export function CartDrawer() {
  const router = useRouter();
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    subtotalMRP,
    totalPrice,
    totalSavings,
    availableAddons,
    addToCart,
    setDirectBuyProduct,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  const handleCheckout = () => {
    setDirectBuyProduct(null);
    setIsCartDrawerOpen(false);
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F0] border-l border-[#E6DEC8] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 bg-white border-b border-[#E6DEC8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#0E3B23]" />
              <h3 className="font-cinzel text-lg font-bold text-[#0E3B23]">
                Your Treasury Cart ({cart.length})
              </h3>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-full hover:bg-[#F3EDE0] text-[#5C5343] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length > 0 ? (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-white border border-[#E6DEC8] flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="truncate flex-1">
                      <h4 className="font-heading text-xs font-bold text-[#0E3B23] truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-[#6B5E49] truncate font-mono">
                        {item.fileName}
                      </p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-heading font-extrabold text-xs text-[#0E3B23] tabular-price">
                          ₹{item.price}
                        </span>
                        <span className="text-[10px] text-[#8A7E6B] line-through tabular-price">
                          ₹{item.mrp}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-[#9E3A3A] hover:bg-[#FDF2F2] rounded-md transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center space-y-3">
                <ShoppingBag className="w-10 h-10 text-[#C6923A] mx-auto opacity-70" />
                <p className="font-heading text-sm font-bold text-[#0E3B23]">
                  Your cart is empty
                </p>
                <p className="text-xs text-[#5C5343] max-w-xs mx-auto">
                  Add instant-download PDF bundles to unlock direct UPI checkout.
                </p>
              </div>
            )}

            {/* Instant 1-Click Add-on Chips (One-Tap Bundle Builder) */}
            {availableAddons.length > 0 && (
              <div className="pt-4 border-t border-[#E6DEC8] space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#C6923A]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0E3B23]">
                    1-Click Bundle Add-Ons
                  </span>
                </div>
                <div className="space-y-2">
                  {availableAddons.map((addon) => (
                    <button
                      key={addon.id}
                      onClick={() => addToCart(addon)}
                      className="w-full text-left p-2.5 rounded-xl bg-white border border-[#E6DEC8] hover:border-[#C6923A] flex items-center justify-between text-xs transition-all group"
                    >
                      <div className="truncate pr-2">
                        <p className="font-medium text-[#0E3B23] truncate group-hover:text-[#165534]">
                          + {addon.title}
                        </p>
                        <p className="text-[10px] text-[#6B5E49]">{addon.hook}</p>
                      </div>
                      <span className="font-bold text-[#0E3B23] bg-[#FAF7F0] px-2 py-1 rounded-md border border-[#E6DEC8] flex-shrink-0">
                        +₹{addon.price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer with Live Savings Calculator */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-[#E6DEC8] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#5C5343]">
                  <span>Subtotal</span>
                  <span className="tabular-price line-through text-[#8A7E6B]">
                    ₹{subtotalMRP}
                  </span>
                </div>
                <div className="flex justify-between text-[#059669] font-bold">
                  <span>You save</span>
                  <span className="tabular-price">-₹{totalSavings}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#0E3B23] pt-2 border-t border-[#E6DEC8]">
                  <span>Total</span>
                  <span className="font-extrabold text-xl tabular-price">
                    ₹{totalPrice}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 bg-[#0E3B23] hover:bg-[#165534] text-white text-sm font-semibold py-3.5 px-4 rounded-xl shadow-xs transition-all active:scale-[0.99]"
              >
                <span>Proceed to Pay</span>
                <ArrowRight className="w-4 h-4 text-[#C6923A]" />
              </button>

              <p className="text-[11px] text-center text-[#6B5E49]">
                Instant PDF unlock. Zero account needed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
