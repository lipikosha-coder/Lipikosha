"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Stepper } from "@/components/Stepper";
import {
  Lock,
  ShieldCheck,
  Loader2,
  Sparkles,
  CreditCard,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Building2,
  QrCode,
  ArrowRight,
} from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Dynamic script loader for Razorpay checkout.js
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
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

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Guard redirect: redirect to treasury if cart is empty and no active verification
  useEffect(() => {
    if (checkoutItems.length === 0 && !isProcessing && !verifiedPayment) {
      router.replace("/resources");
    }
  }, [checkoutItems.length, isProcessing, verifiedPayment, router]);

  // Pre-load Razorpay checkout script on mount
  useEffect(() => {
    loadRazorpayScript();
  }, []);

  if (checkoutItems.length === 0 && !isProcessing && !verifiedPayment) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm text-[#6B5E49]">
        Redirecting to Treasury...
      </div>
    );
  }

  // --- Strict Official Razorpay Gateway Handler ---
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsProcessing(true);
    setProcessingStatus("Initializing secure checkout...");

    try {
      // 1. Ensure Razorpay SDK is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded || typeof window.Razorpay === "undefined") {
        throw new Error(
          "Could not load Razorpay payment gateway SDK. Please check your internet connection."
        );
      }

      // 2. Create authentic Razorpay order on the server
      setProcessingStatus("Generating order on Razorpay...");
      const res = await fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productIds: checkoutItems.map((item) => item.id),
        }),
      });

      const orderData = await res.json();

      if (!res.ok || !orderData.success) {
        throw new Error(
          orderData.error || "Failed to initialize payment order with gateway"
        );
      }

      setProcessingStatus("Opening payment gateway...");

      // 3. Configure Razorpay modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "Lipi Kosha",
        description: "Treasury Digital Resource Package",
        image: "/logo.png",
        order_id: orderData.orderId,
        prefill: {
          name: customerName.trim() || undefined,
          email: customerEmail.trim() || undefined,
          contact: customerPhone.trim() || undefined,
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
        handler: async function (response: any) {
          setProcessingStatus("Verifying transaction credentials with bank...");

          try {
            // 4. Strict server-side cryptographic HMAC SHA256 verification
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

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(
                verifyData.error ||
                  "Payment signature verification failed. Please contact support."
              );
            }

            setProcessingStatus("Payment verified! Unlocking instant downloads...");

            // ONLY UNLOCK UPON CONFIRMED CRYPTOGRAPHIC VERIFICATION
            setTimeout(() => {
              completePayment(
                "Razorpay",
                response.razorpay_payment_id,
                verifyData.unlockedFiles
              );
              router.push("/download");
            }, 600);
          } catch (vErr: any) {
            console.error("Payment verification failure:", vErr);
            setIsProcessing(false);
            setProcessingStatus("");
            setErrorMessage(
              vErr.message ||
                "Payment verification failed. If money was deducted, please contact support with your Payment ID."
            );
          }
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (resp: any) {
        console.error("Razorpay payment failed:", resp.error);
        setIsProcessing(false);
        setProcessingStatus("");
        setErrorMessage(
          resp.error?.description ||
            "Payment transaction was declined or failed. Please try another method."
        );
      });

      rzp.open();
    } catch (err: any) {
      console.error("Checkout initiation error:", err);
      setIsProcessing(false);
      setProcessingStatus("");
      setErrorMessage(
        err.message ||
          "Unable to start checkout. Please verify your internet connection or try again."
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Heading */}
      <div className="text-center sm:text-left">
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#0E3B23]">
          Pay Securely
        </h1>
        <p className="text-xs sm:text-sm text-[#5C5343] mt-1">
          Instant digital delivery via Razorpay with UPI, QR, Cards, or NetBanking.
        </p>
      </div>

      {/* Stepper at Step 2: 1 Cart — 2 Pay — 3 Download */}
      <Stepper currentStep={2} />

      {/* Error Notice Banner */}
      {errorMessage && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-red-800 flex-1">
            <strong className="font-bold block text-red-900 mb-0.5">
              Payment Error:
            </strong>
            {errorMessage}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Official Gateway Payment Form */}
        <div className="lg:col-span-7 space-y-6">
          <form
            onSubmit={handlePayment}
            className="bg-white rounded-2xl border-2 border-[#C6923A]/40 p-6 sm:p-8 shadow-card space-y-6"
          >
            {/* Header Badge */}
            <div className="flex items-start justify-between gap-4 border-b border-[#E6DEC8] pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF7F0] border border-[#E6DEC8] text-[#0E3B23] text-[11px] font-bold tracking-wider uppercase mb-1">
                  <Sparkles className="w-3 h-3 text-[#C6923A]" />
                  <span>Official Razorpay Payment Gateway</span>
                </div>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-[#0E3B23]">
                  Select Payment Method
                </h2>
                <p className="text-xs text-[#6B5E49] mt-0.5">
                  UPI, Instant Dynamic QR, Debit/Credit Card, or NetBanking
                </p>
              </div>
              <span className="hidden sm:inline-block text-[11px] font-mono font-bold text-[#0E3B23] bg-[#FAF7F0] px-2.5 py-1 rounded-md border border-[#E6DEC8]">
                RBI Compliant
              </span>
            </div>

            {/* Supported Payment Options Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E6DEC8] text-center">
                <Smartphone className="w-4 h-4 text-[#0E3B23] mx-auto mb-1" />
                <span className="text-xs font-bold text-[#0E3B23] block">UPI Apps</span>
                <span className="text-[10px] text-[#6B5E49]">GPay, PhonePe, Paytm</span>
              </div>
              <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E6DEC8] text-center">
                <QrCode className="w-4 h-4 text-[#0E3B23] mx-auto mb-1" />
                <span className="text-xs font-bold text-[#0E3B23] block">Dynamic QR</span>
                <span className="text-[10px] text-[#6B5E49]">Scan with any app</span>
              </div>
              <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E6DEC8] text-center">
                <CreditCard className="w-4 h-4 text-[#0E3B23] mx-auto mb-1" />
                <span className="text-xs font-bold text-[#0E3B23] block">Cards</span>
                <span className="text-[10px] text-[#6B5E49]">Visa, MC, RuPay</span>
              </div>
              <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E6DEC8] text-center">
                <Building2 className="w-4 h-4 text-[#0E3B23] mx-auto mb-1" />
                <span className="text-xs font-bold text-[#0E3B23] block">NetBanking</span>
                <span className="text-[10px] text-[#6B5E49]">50+ Indian banks</span>
              </div>
            </div>

            {/* Customer Details (Optional for convenience) */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#0E3B23] uppercase tracking-wider">
                    Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 bg-[#FAF7F0] border border-[#E6DEC8] rounded-xl text-sm text-[#0E3B23] placeholder-[#8A7E6B] focus:outline-none focus:border-[#0E3B23] focus:ring-1 focus:ring-[#0E3B23] transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#0E3B23] uppercase tracking-wider">
                    Email for Invoice (Optional)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 bg-[#FAF7F0] border border-[#E6DEC8] rounded-xl text-sm text-[#0E3B23] placeholder-[#8A7E6B] focus:outline-none focus:border-[#0E3B23] focus:ring-1 focus:ring-[#0E3B23] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#0E3B23] uppercase tracking-wider">
                  Mobile Number (Optional)
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-4 py-2.5 bg-[#FAF7F0] border border-[#E6DEC8] rounded-xl text-sm text-[#0E3B23] placeholder-[#8A7E6B] focus:outline-none focus:border-[#0E3B23] focus:ring-1 focus:ring-[#0E3B23] transition-colors"
                />
              </div>
            </div>

            {/* Official Razorpay Payment Trigger Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2.5 bg-[#0E3B23] hover:bg-[#165534] disabled:bg-[#5C5343] text-white text-base sm:text-lg font-bold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.99] focus:outline-none cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 text-[#C6923A] animate-spin" />
                    <span>{processingStatus}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 text-[#C6923A]" />
                    <span>Pay ₹{totalPrice} via Razorpay</span>
                  </>
                )}
              </button>
            </div>

            {/* Trust Footnote */}
            <div className="pt-2 border-t border-[#E6DEC8]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B5E49] gap-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#059669]" />
                <span>256-bit SSL encrypted &bull; Zero storage of card/UPI credentials</span>
              </span>
              <span className="font-mono text-[11px] text-[#8A7E6B]">
                Immediate download unlock upon payment confirmation
              </span>
            </div>
          </form>
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

            {/* Item list */}
            <div className="divide-y divide-[#E6DEC8] max-h-72 overflow-y-auto pr-1">
              {checkoutItems.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-3">
                  <div className="relative w-12 aspect-[3/4] rounded-lg overflow-hidden border border-[#E6DEC8] flex-shrink-0 shadow-xs">
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0E3B23] truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-[#6B5E49]">
                      Verified PDF Resource
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#0E3B23]">
                      ₹{item.price}
                    </span>
                    <span className="text-[11px] text-[#8A7E6B] line-through block">
                      ₹{item.mrp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-[#E6DEC8] pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-[#6B5E49]">
                <span>Total Catalog MRP</span>
                <span className="line-through font-mono">₹{subtotalMRP}</span>
              </div>

              {totalSavings > 0 && (
                <div className="flex justify-between text-[#059669] font-medium">
                  <span>Vault Special Discount</span>
                  <span className="font-mono">-₹{totalSavings}</span>
                </div>
              )}

              <div className="flex justify-between text-[#6B5E49]">
                <span>Delivery &amp; Tax</span>
                <span className="text-[#059669] font-medium">₹0 (Instant Access)</span>
              </div>

              <div className="border-t border-[#E6DEC8] pt-3 flex justify-between items-baseline">
                <div>
                  <span className="font-heading font-bold text-base text-[#0E3B23] block">
                    Final Amount
                  </span>
                  <span className="text-[11px] text-[#6B5E49]">
                    Inclusive of all taxes
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-2xl font-black text-[#0E3B23]">
                    ₹{totalPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="bg-[#FAF7F0] border border-[#E6DEC8] rounded-xl p-3.5 flex items-center gap-3 text-xs text-[#0E3B23]">
              <CheckCircle2 className="w-5 h-5 text-[#059669] flex-shrink-0" />
              <span>
                100% Secure Transaction. Real-time bank confirmation with instant PDF delivery.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
