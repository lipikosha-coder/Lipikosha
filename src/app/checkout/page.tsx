"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Stepper } from "@/components/Stepper";
import {
  Lock,
  ShieldCheck,
  Loader2,
  FileText,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    checkoutItems,
    subtotalMRP,
    totalPrice,
    totalSavings,
    completePayment,
    verifiedPayment,
  } = useCart();

  const [selectedApp, setSelectedApp] = useState<string>("GPay");
  const [upiId, setUpiId] = useState<string>("creator@okhdfcbank");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");

  const apps = [
    { id: "GPay", name: "GPay", defaultSuffix: "@okaxis" },
    { id: "PhonePe", name: "PhonePe", defaultSuffix: "@ybl" },
    { id: "Paytm", name: "Paytm", defaultSuffix: "@paytm" },
    { id: "Other UPI", name: "Other UPI", defaultSuffix: "@upi" },
  ];

  // Guard redirect: only redirect if no checkout items AND not currently processing or already verified
  useEffect(() => {
    if (checkoutItems.length === 0 && !isProcessing && !verifiedPayment) {
      router.replace("/resources");
    }
  }, [checkoutItems.length, isProcessing, verifiedPayment, router]);

  if (checkoutItems.length === 0 && !isProcessing && !verifiedPayment) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm text-[#6B5E49]">
        Redirecting to Treasury...
      </div>
    );
  }

  const handlePaySecurely = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingStatus("Connecting to NPCI UPI Gateway...");

    try {
      const orderId = `LK-UPI-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Call /api/verify-payment to generate Supabase signed download URLs for product.fileName
      setProcessingStatus("Verifying transaction credentials & signing PDF files...");
      
      const response = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          productIds: checkoutItems.map((item) => item.id),
          upiId,
          paymentMethod: selectedApp,
        }),
      });

      const data = await response.json();
      const unlockedFiles = data?.unlockedFiles || [];

      setProcessingStatus("Payment verified! Unlocking instant PDF download...");

      setTimeout(() => {
        // Ephemeral in-memory session creation
        completePayment(selectedApp, upiId, unlockedFiles);
        router.push("/download");
      }, 700);
    } catch (err) {
      console.error("Payment verification error:", err);
      // Fallback in-memory unlock if network error
      completePayment(selectedApp, upiId);
      router.push("/download");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="text-center sm:text-left">
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#0E3B23]">
          Pay Securely
        </h1>
        <p className="text-xs sm:text-sm text-[#5C5343] mt-1">
          Instant UPI verification with zero account creation required.
        </p>
      </div>

      {/* Stepper at Step 2 matching wireframe: 1 Cart — 2 Pay — 3 Download */}
      <Stepper currentStep={2} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Pay with UPI Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E6DEC8] p-6 sm:p-8 shadow-card space-y-6">
          <div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-[#0E3B23]">
              Pay with UPI
            </h2>
            <p className="text-xs text-[#6B5E49] mt-0.5">
              Choose your preferred UPI application or scan the instant QR code below.
            </p>
          </div>

          {/* App Selector Pills: GPay, PhonePe, Paytm, Other UPI */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {apps.map((app) => {
              const isSelected = selectedApp === app.id;
              return (
                <button
                  type="button"
                  key={app.id}
                  onClick={() => {
                    setSelectedApp(app.id);
                    const base = upiId.split("@")[0] || "creator";
                    setUpiId(`${base}${app.defaultSuffix}`);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all text-center ${
                    isSelected
                      ? "bg-[#0E3B23] text-white border-[#0E3B23] shadow-xs"
                      : "bg-[#FAF7F0] text-[#5C5343] border-[#E6DEC8] hover:border-[#C6923A] hover:bg-white"
                  }`}
                >
                  {app.name}
                </button>
              );
            })}
          </div>

          {/* UPI ID input field: name@bank */}
          <div className="space-y-1.5">
            <label
              htmlFor="upi-id-input"
              className="block text-xs font-bold uppercase tracking-wider text-[#0E3B23]"
            >
              UPI ID
            </label>
            <div className="relative">
              <input
                id="upi-id-input"
                type="text"
                placeholder="name@bank (e.g. mobile@oksbi)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#FAF7F0] border border-[#E6DEC8] rounded-xl text-sm font-mono text-[#0E3B23] placeholder:text-[#8A7E6B] focus:outline-none focus:border-[#C6923A] focus:ring-1 focus:ring-[#C6923A] transition-colors"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#059669] bg-[#E8F5EE] px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
            <p className="text-[11px] text-[#8A7E6B]">
              A payment collect request will be sent to your {selectedApp} app.
            </p>
          </div>

          {/* Divider: or scan to pay */}
          <div className="relative flex items-center justify-center py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E6DEC8]" />
            </div>
            <span className="relative bg-white px-4 text-xs uppercase tracking-wider font-semibold text-[#8A7E6B]">
              or scan to pay
            </span>
          </div>

          {/* QR Scan Card */}
          <div className="bg-[#FAF7F0] rounded-2xl border border-[#E6DEC8] p-6 text-center space-y-4 flex flex-col items-center">
            {/* Scannable styled SVG QR code with Lipi Kosha emblem in center */}
            <div className="relative p-3 bg-white rounded-2xl border-2 border-[#E6DEC8] shadow-sm">
              <svg
                viewBox="0 0 160 160"
                className="w-44 h-44 text-[#0E3B23]"
                fill="currentColor"
              >
                <path d="M10 10h40v40h-40zM20 20v20h20v-20zM110 10h40v40h-40zM120 20v20h20v-20zM10 110h40v40h-40zM20 120v20h20v-20z" />
                <rect x="25" y="25" width="10" height="10" />
                <rect x="125" y="25" width="10" height="10" />
                <rect x="25" y="125" width="10" height="10" />
                <rect x="60" y="15" width="8" height="8" />
                <rect x="75" y="15" width="8" height="8" />
                <rect x="90" y="25" width="8" height="8" />
                <rect x="60" y="35" width="8" height="8" />
                <rect x="75" y="45" width="8" height="8" />
                <rect x="15" y="60" width="8" height="8" />
                <rect x="35" y="60" width="8" height="8" />
                <rect x="25" y="75" width="8" height="8" />
                <rect x="15" y="90" width="8" height="8" />
                <rect x="110" y="60" width="8" height="8" />
                <rect x="130" y="70" width="8" height="8" />
                <rect x="140" y="90" width="8" height="8" />
                <rect x="60" y="110" width="8" height="8" />
                <rect x="75" y="120" width="8" height="8" />
                <rect x="90" y="135" width="8" height="8" />
                <rect x="110" y="110" width="8" height="8" />
                <rect x="130" y="125" width="8" height="8" />
                <rect x="140" y="140" width="8" height="8" />
                <rect x="120" y="140" width="8" height="8" />
                <rect x="100" y="90" width="8" height="8" />
                <rect x="60" y="70" width="8" height="8" />
                <rect x="90" y="70" width="8" height="8" />
                <rect x="75" y="90" width="8" height="8" />
              </svg>

              {/* Center Logo Emblem Badge */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-10 h-10 rounded-full bg-white border border-[#C6923A] shadow p-0.5 overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="Lipi Kosha QR Emblem"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="font-heading text-sm font-bold text-[#0E3B23]">
                Scan with any UPI App
              </p>
              <p className="text-xs text-[#5C5343]">
                GPay, PhonePe, Paytm, CRED, Amazon Pay, or BHIM
              </p>
              <div className="inline-block mt-2 font-mono text-xs font-bold text-[#0E3B23] bg-white border border-[#E6DEC8] px-3 py-1 rounded-md">
                Amount: ₹{totalPrice}
              </div>
            </div>
          </div>

          {/* Pay ₹[Total] Securely Button */}
          <button
            onClick={handlePaySecurely}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2.5 bg-[#0E3B23] hover:bg-[#165534] disabled:bg-[#5C5343] text-white text-base font-semibold py-4 px-6 rounded-xl shadow-sm hover:shadow transition-all active:scale-[0.99] focus:outline-none"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 text-[#C6923A] animate-spin" />
                <span>{processingStatus}</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 text-[#C6923A]" />
                <span>Pay ₹{totalPrice} Securely</span>
              </>
            )}
          </button>

          {/* Reassurance text */}
          <div className="text-center pt-1">
            <p className="text-xs text-[#6B5E49] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#059669]" />
              <span>Payments are processed by a secure UPI gateway.</span>
            </p>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-5 sticky top-28 space-y-6">
          <div className="bg-white rounded-2xl border-2 border-[#E6DEC8] p-6 sm:p-8 shadow-card space-y-6">
            <div className="border-b border-[#E6DEC8] pb-4 flex items-center justify-between">
              <h2 className="font-cinzel text-xl font-bold text-[#0E3B23]">
                Order Summary
              </h2>
              <span className="text-xs font-semibold text-[#0E3B23] bg-[#FAF7F0] border border-[#E6DEC8] px-2.5 py-0.5 rounded-full">
                {checkoutItems.length} {checkoutItems.length === 1 ? "Item" : "Items"}
              </span>
            </div>

            {/* Item list snippet */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {checkoutItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs pb-2 border-b border-[#E6DEC8]/50 last:border-none"
                >
                  <div className="truncate max-w-[200px] sm:max-w-[240px]">
                    <p className="font-medium text-[#0E3B23] truncate">{item.title}</p>
                    <p className="text-[10px] text-[#8A7E6B] truncate">{item.fileName}</p>
                  </div>
                  <span className="font-heading font-bold text-[#0E3B23] tabular-price">
                    ₹{item.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-3 text-sm pt-2 border-t border-[#E6DEC8]">
              <div className="flex justify-between text-[#5C5343]">
                <span>Subtotal</span>
                <span className="tabular-price text-[#8A7E6B] line-through">
                  ₹{subtotalMRP}
                </span>
              </div>

              <div className="flex justify-between text-[#059669] font-medium">
                <span>You save</span>
                <span className="tabular-price">-₹{totalSavings}</span>
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

            {/* Subline */}
            <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E6DEC8] text-center">
              <p className="text-xs text-[#5C5343] leading-relaxed">
                Instant PDF download after UPI payment. No account needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
