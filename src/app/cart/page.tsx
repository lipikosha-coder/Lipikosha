"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Stepper } from "@/components/Stepper";
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Zap, FileText } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    clearCart,
    subtotalMRP,
    totalPrice,
    totalSavings,
    setDirectBuyProduct,
  } = useCart();

  const handleProceedToPay = () => {
    // Clear any previous direct-buy override so cart items are checked out
    setDirectBuyProduct(null);
    router.push("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="text-center sm:text-left">
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#0E3B23]">
          Your Cart
        </h1>
        <p className="text-xs sm:text-sm text-[#5C5343] mt-1">
          Review your selected PDF bundles before entering secure UPI checkout.
        </p>
      </div>

      {/* Stepper at Step 1 matching wireframe: 1 Cart — 2 Pay — 3 Download */}
      <Stepper currentStep={1} />

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6DEC8]">
              <span className="text-sm font-semibold text-[#0E3B23]">
                Items in Cart ({cart.length})
              </span>
              <button
                onClick={clearCart}
                className="text-xs text-[#8A7E6B] hover:text-[#0E3B23] transition-colors"
              >
                Clear all
              </button>
            </div>

            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E6DEC8] p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#C6923A] transition-colors"
              >
                {/* Thumbnail & Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative w-14 sm:w-16 aspect-[3/4] rounded-lg overflow-hidden border border-[#E6DEC8] shadow-xs flex-shrink-0">
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <Link
                      href={`/resources/${item.slug}`}
                      className="font-heading text-base sm:text-lg font-bold text-[#0E3B23] hover:text-[#165534] transition-colors leading-snug line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-[#6B5E49]">
                      PDF • {item.formats}
                    </p>
                    <span className="inline-block text-[10px] font-mono text-[#8A7E6B] bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#E6DEC8]">
                      {item.fileName}
                    </span>
                  </div>
                </div>

                {/* Price & Remove button */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E6DEC8]/60">
                  <div className="text-left sm:text-right">
                    <div className="font-heading text-xl font-bold text-[#0E3B23] tabular-price">
                      ₹{item.price}
                    </div>
                    <div className="text-xs text-[#8A7E6B] line-through tabular-price">
                      ₹{item.mrp}
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-[#9E3A3A] hover:text-[#c42d2d] flex items-center gap-1 font-medium transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-4">
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0E3B23] hover:text-[#C6923A] transition-colors"
              >
                <span>← Continue exploring Treasury</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="bg-white rounded-2xl border-2 border-[#E6DEC8] p-6 sm:p-8 shadow-card space-y-6">
              <h2 className="font-cinzel text-xl font-bold text-[#0E3B23] border-b border-[#E6DEC8] pb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#5C5343]">
                  <span>Subtotal</span>
                  <span className="tabular-price text-[#8A7E6B] line-through">
                    ₹{subtotalMRP}
                  </span>
                </div>

                <div className="flex justify-between text-[#059669] font-medium">
                  <span>You save</span>
                  <span className="tabular-price">
                    -₹{totalSavings}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#E6DEC8] flex justify-between items-baseline">
                  <span className="font-heading text-base font-bold text-[#0E3B23]">
                    Total
                  </span>
                  <span className="font-heading text-3xl font-extrabold text-[#0E3B23] tabular-price">
                    ₹{totalPrice}
                  </span>
                </div>
              </div>

              {/* Proceed to Pay CTA */}
              <button
                onClick={handleProceedToPay}
                className="w-full flex items-center justify-center gap-2.5 bg-[#0E3B23] hover:bg-[#165534] text-white text-base font-semibold py-4 px-6 rounded-xl shadow-sm hover:shadow transition-all active:scale-[0.99]"
              >
                <span>Proceed to Pay</span>
                <ArrowRight className="w-4 h-4 text-[#C6923A]" />
              </button>

              {/* Notice line */}
              <p className="text-xs text-center text-[#6B5E49] leading-relaxed">
                Instant PDF download after UPI payment. No account needed.
              </p>

              {/* Mini trust points */}
              <div className="pt-4 border-t border-[#E6DEC8] space-y-2 text-xs text-[#5C5343]">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#C6923A]" />
                  <span>Supports GPay, PhonePe, Paytm, CRED &amp; BHIM</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Encrypted peer-to-peer UPI token validation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-[#E6DEC8] p-12 sm:p-20 text-center max-w-2xl mx-auto shadow-sm space-y-6">
          <div className="w-20 h-20 rounded-full bg-[#FAF7F0] border border-[#E6DEC8] flex items-center justify-center mx-auto text-[#0E3B23]">
            <ShoppingBag className="w-8 h-8 text-[#0E3B23]" />
          </div>

          <div className="space-y-2">
            <h2 className="font-cinzel text-2xl font-bold text-[#0E3B23]">
              Your cart is empty
            </h2>
            <p className="text-sm text-[#5C5343] max-w-md mx-auto">
              You haven&apos;t added any digital PDF bundles to your cart yet. Discover
              our master bundles, ChatGPT prompt treasuries, and marketing databases.
            </p>
          </div>

          <div>
            <Link
              href="/resources"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#0E3B23] hover:bg-[#165534] text-white font-semibold text-sm shadow-sm transition-all"
            >
              <span>Browse the Treasury</span>
              <ArrowRight className="w-4 h-4 text-[#C6923A]" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
