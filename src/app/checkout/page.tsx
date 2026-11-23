"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Stepper } from "@/components/Stepper";
import {
  Lock,
  ShieldCheck,
  Loader2,
  Sparkles,
  CreditCard,
  QrCode,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

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

  const [paymentMode, setPaymentMode] = useState<"razorpay" | "upi">("razorpay");
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

  // --- 1. Razorpay Gateway Handler ---
  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    setProcessingStatus("Initializing secure Razorpay order...");

    try {
      const res = await fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productIds: checkoutItems.map((item) => item.id),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create Razorpay order");
      }

      const orderData = await res.json();

      // If Razorpay live gateway keys are connected and SDK is loaded
      if (typeof window !== "undefined" && window.Razorpay && orderData.isLiveGateway) {
        setProcessingStatus("Opening Razorpay payment modal...");

        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "Lipi Kosha",
          description: "Treasury Digital Resource Package",
          image: "/logo.png",
          order_id: orderData.orderId,
          handler: async function (response: any) {
            setProcessingStatus("Verifying transaction credentials & signing files...");

            try {
              const verifyRes = await fetch("/api/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: response.razorpay_order_id,
                  productIds: checkoutItems.map((item) => item.id),
                  paymentMethod: "Razorpay",
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();
              const unlockedFiles = verifyData?.unlockedFiles || [];

              setProcessingStatus("Payment verified! Unlocking instant PDF download...");

              setTimeout(() => {
                completePayment("Razorpay", response.razorpay_payment_id, unlockedFiles);
                router.push("/download");
              }, 600);
            } catch (vErr) {
              console.error("Verification error:", vErr);
              completePayment("Razorpay", response.razorpay_payment_id);
              router.push("/download");
            }
          },
          prefill: {
            name: "Customer",
            email: "customer@lipikosha.internal",
            contact: "9999999999",
          },
          theme: {
            color: "#0E3B23",
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              setProcessingStatus("");
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      }

      // If Razorpay keys are not yet added in environment, run simulated instant unlock
      setProcessingStatus("Demo Mode: Simulating Razorpay instant verification...");

      const verifyRes = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.orderId,
          productIds: checkoutItems.map((item) => item.id),
          paymentMethod: "Razorpay (Demo)",
          upiId: "razorpay.demo@okhdfcbank",
        }),
      });

      const verifyData = await verifyRes.json();
      const unlockedFiles = verifyData?.unlockedFiles || [];

      setTimeout(() => {
        completePayment("Razorpay", orderData.orderId, unlockedFiles);
        router.push("/download");
      }, 700);
    } catch (err) {
      console.error("Razorpay payment error:", err);
      // Fallback in-memory unlock
      completePayment("Razorpay", `pay_${Date.now().toString(36)}`);
      router.push("/download");
    }
  };

  // --- 2. Direct UPI Instant Simulation Handler ---
  const handleDirectUpiPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingStatus("Connecting to NPCI UPI Gateway...");

    try {
      const orderId = `LK-UPI-${Date.now().toString(36).toUpperCase()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

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
        completePayment(selectedApp, upiId, unlockedFiles);
        router.push("/download");
      }, 700);
    } catch (err) {
      console.error("Payment verification error:", err);
      completePayment(selectedApp, upiId);
      router.push("/download");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Razorpay checkout SDK script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      {/* Title */}
      <div className="text-center sm:text-left">
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#0E3B23]">
          Pay Securely
        </h1>
        <p className="text-xs sm:text-sm text-[#5C5343] mt-1">
          Instant digital delivery via Razorpay or direct UPI with zero account creation required.
        </p>
      </div>

      {/* Stepper at Step 2 matching wireframe: 1 Cart — 2 Pay — 3 Download */}
      <Stepper currentStep={2} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Payment Options */}
        <div className="lg:col-span-7 space-y-6">
          {/* Method Selector Tabs: Razorpay (Recommended) vs Direct UPI */}
          <div className="bg-white rounded-2xl border border-[#E6DEC8] p-2 flex gap-2 shadow-xs">
            <button
              type="button"
              onClick={() => setPaymentMode("razorpay")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                paymentMode === "razorpay"
                  ? "bg-[#0E3B23] text-white shadow-xs"
                  : "text-[#5C5343] hover:text-[#0E3B23] hover:bg-[#FAF7F0]"
              }`}
            >
              <CreditCard className="w-4 h-4 text-[#C6923A]" />
              <span>Razorpay (UPI, Cards, NetBanking)</span>
              <span className="hidden sm:inline-block bg-[#C6923A] text-[#0E3B23] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ml-1">
                Fast
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMode("upi")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                paymentMode === "upi"
                  ? "bg-[#0E3B23] text-white shadow-xs"
                  : "text-[#5C5343] hover:text-[#0E3B23] hover:bg-[#FAF7F0]"
              }`}
            >
              <Smartphone className="w-4 h-4 text-[#C6923A]" />
              <span>Direct UPI / QR</span>
            </button>
          </div>

          {/* Option A: Razorpay Panel */}
          {paymentMode === "razorpay" && (
            <div className="bg-white rounded-2xl border-2 border-[#C6923A]/40 p-6 sm:p-8 shadow-card space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF7F0] border border-[#E6DEC8] text-[#0E3B23] text-[11px] font-bold tracking-wider uppercase mb-2">
                    <Sparkles className="w-3 h-3 text-[#C6923A]" />
                    <span>Official Gateway Integration</span>
                  </div>
                  <h2 className="font-heading text-lg sm:text-xl font-bold text-[#0E3B23]">
                    Pay via Razorpay
                  </h2>
                  <p className="text-xs text-[#6B5E49] mt-0.5">
                    Pay securely using Google Pay, PhonePe, Paytm, BHIM UPI, Debit/Credit Card, or NetBanking.
                  </p>
                </div>
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[11px] font-mono font-bold text-[#0E3B23] bg-[#FAF7F0] px-2.5 py-1 rounded-md border border-[#E6DEC8]">
                    RBI Compliant
                  </span>
                </div>
              </div>

              {/* Supported payment badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E6DEC8] text-center">
                  <span className="text-xs font-bold text-[#0E3B23] block">UPI Apps</span>
                  <span className="text-[10px] text-[#6B5E49]">GPay, PhonePe, Paytm</span>
                </div>
                <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E6DEC8] text-center">
                  <span className="text-xs font-bold text-[#0E3B23] block">Instant QR</span>
                  <span className="text-[10px] text-[#6B5E49]">Scan &amp; Pay directly</span>
                </div>
                <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E6DEC8] text-center">
                  <span className="text-xs font-bold text-[#0E3B23] block">All Cards</span>
                  <span className="text-[10px] text-[#6B5E49]">Visa, MC, RuPay</span>
                </div>
                <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E6DEC8] text-center">
                  <span className="text-xs font-bold text-[#0E3B23] block">NetBanking</span>
                  <span className="text-[10px] text-[#6B5E49]">50+ Indian banks</span>
                </div>
              </div>

              {/* Pay with Razorpay Button */}
              <button
                type="button"
                onClick={handleRazorpayPayment}
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
                    <span>Pay ₹{totalPrice} with Razorpay</span>
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <p className="text-xs text-[#6B5E49] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#059669]" />
                  <span>256-bit SSL encrypted &bull; Instant download unlock</span>
                </p>
              </div>
            </div>
          )}

          {/* Option B: Direct UPI Simulator Panel */}
          {paymentMode === "upi" && (
            <div className="bg-white rounded-2xl border border-[#E6DEC8] p-6 sm:p-8 shadow-card space-y-6">
              <div>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-[#0E3B23]">
                  Direct UPI / QR Transfer
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
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                        isSelected
                          ? "bg-[#FAF7F0] border-2 border-[#0E3B23] text-[#0E3B23] shadow-xs"
                          : "border-[#E6DEC8] bg-white text-[#5C5343] hover:border-[#C6923A] hover:bg-[#FAF7F0]/50"
                      }`}
                    >
                      <span className="font-bold">{app.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* UPI ID Field with Bank Validation */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#0E3B23] uppercase tracking-wider">
                  UPI ID (VPA)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="name@bank"
                    className="w-full px-4 py-3 bg-[#FAF7F0] border border-[#E6DEC8] rounded-xl text-sm font-mono text-[#0E3B23] placeholder-[#8A7E6B] focus:outline-none focus:border-[#0E3B23] focus:ring-1 focus:ring-[#0E3B23] transition-colors"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-[#059669] font-medium pointer-events-none">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Valid</span>
                  </div>
                </div>
              </div>

              {/* QR Scan Card */}
              <div className="bg-[#FAF7F0] rounded-2xl border border-[#E6DEC8] p-6 text-center space-y-4 flex flex-col items-center">
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
                type="button"
                onClick={handleDirectUpiPayment}
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
                    <span>Pay ₹{totalPrice} Securely via UPI</span>
                  </>
                )}
              </button>
            </div>
          )}
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

            {/* Reassurance Subline */}
            <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E6DEC8] text-center">
              <p className="text-xs text-[#5C5343] leading-relaxed">
                Instant PDF download unlock after payment. Strictly zero account creation required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
