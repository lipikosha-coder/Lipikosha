"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart, UnlockedProductItem } from "@/context/CartContext";
import { Stepper } from "@/components/Stepper";
import { generateProductPdfBlob, triggerDownloadPdfBlob } from "@/lib/pdfGenerator";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Download,
  AlertTriangle,
  ShieldCheck,
  FileText,
  ArrowRight,
  Loader2,
  FileCheck,
  ExternalLink,
} from "lucide-react";

export default function DownloadPage() {
  const router = useRouter();
  const { verifiedPayment } = useCart();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);

  // CRITICAL REQUIREMENT:
  // Strictly ephemeral session. If refreshed (F5) or opened without active in-memory state,
  // redirect immediately to /resources.
  useEffect(() => {
    if (!verifiedPayment || !verifiedPayment.items || verifiedPayment.items.length === 0) {
      router.replace("/resources");
    } else {
      // Fire victory confetti on initial successful load
      try {
        confetti({
          particleCount: 85,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#0E3B23", "#C6923A", "#059669", "#F3EDE0"],
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [verifiedPayment, router]);

  // If redirecting or no session
  if (!verifiedPayment || !verifiedPayment.items || verifiedPayment.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm text-[#6B5E49]">
        Redirecting to Treasury...
      </div>
    );
  }

  const handleDownload = async (product: UnlockedProductItem) => {
    setDownloadingId(product.id);
    try {
      // If we have an authentic live Supabase storage URL (not placeholder)
      if (
        product.downloadUrl &&
        product.downloadUrl.startsWith("http") &&
        !product.downloadUrl.includes("example.supabase.co")
      ) {
        const link = document.createElement("a");
        link.href = product.downloadUrl;
        link.download = product.fileName;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Instant download: generate authentic PDF document with order certificate & deliverables
        const blob = generateProductPdfBlob(product, verifiedPayment.orderId);
        triggerDownloadPdfBlob(blob, product.fileName);
      }

      setDownloadedIds((prev) => [...prev, product.id]);

      // Celebratory mini confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#059669", "#C6923A", "#FAF7F0"],
        });
      } catch (e) {}
    } catch (err) {
      console.error("PDF Download error:", err);
      // Fallback
      const blob = generateProductPdfBlob(product, verifiedPayment.orderId);
      triggerDownloadPdfBlob(blob, product.fileName);
      setDownloadedIds((prev) => [...prev, product.id]);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadAll = async () => {
    for (const item of verifiedPayment.items) {
      await handleDownload(item);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Stepper at Step 3 matching wireframe: 1 Cart — 2 Pay — 3 Download */}
      <Stepper currentStep={3} />

      {/* Verified Header matching wireframe */}
      <div className="text-center space-y-4">
        {/* Emerald Green Success Icon */}
        <div className="w-16 h-16 rounded-full bg-[#059669] text-white flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
        </div>

        <div className="space-y-1">
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#0E3B23]">
            Payment Verified
          </h1>
          <p className="text-xs sm:text-sm text-[#5C5343]">
            Order Ref: <span className="font-mono font-semibold text-[#0E3B23]">{verifiedPayment.orderId}</span>
            {" • "}
            Paid ₹{verifiedPayment.totalPaid} via {verifiedPayment.paymentMethod}
          </p>
        </div>
      </div>

      {/* Critical Ephemeral Session Warning Alert */}
      <div className="bg-[#FFFBEB] border-2 border-[#C6923A] rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-[#C6923A] flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-[#78350F] leading-relaxed">
          <strong className="font-bold block text-[#92400E] mb-0.5">
            Strictly Ephemeral Session Notice:
          </strong>
          Download your PDF now. Refreshing or closing this page will end your
          session and require paying again. No tokens or cookies are persisted on your device.
        </div>
      </div>

      {/* Purchased Items Download Cards matching wireframe */}
      <div className="space-y-6">
        {verifiedPayment.items.map((product) => {
          const isDownloaded = downloadedIds.includes(product.id);
          const isCurrentDownloading = downloadingId === product.id;

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border-2 border-[#059669]/30 p-6 sm:p-8 shadow-card space-y-6 hover:border-[#059669] transition-all"
            >
              {/* Product Info Row */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 sm:w-20 aspect-[3/4] rounded-xl overflow-hidden border border-[#E6DEC8] shadow-md flex-shrink-0">
                  <Image
                    src={product.coverImage}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-1 flex-1 min-w-0">
                  <span className="text-[11px] font-semibold text-[#059669] bg-[#E8F5EE] px-2.5 py-0.5 rounded-full">
                    Unlocked &amp; Ready
                  </span>
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-[#0E3B23] truncate">
                    {product.title}
                  </h3>
                  <p className="text-xs text-[#6B5E49] truncate font-mono">
                    File: {product.fileName}
                  </p>
                </div>
              </div>

              {/* Download CTA Button: Download PDF Now */}
              <div>
                <button
                  onClick={() => handleDownload(product)}
                  disabled={isCurrentDownloading}
                  className="w-full flex items-center justify-center gap-2.5 bg-[#059669] hover:bg-[#047857] text-white text-base sm:text-lg font-bold py-4 px-6 rounded-xl shadow-md transition-all active:scale-[0.99] focus:outline-none"
                >
                  {isCurrentDownloading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating Direct PDF Download...</span>
                    </>
                  ) : isDownloaded ? (
                    <>
                      <FileCheck className="w-5 h-5" />
                      <span>Download PDF Again ({product.fileName})</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 stroke-[2.5]" />
                      <span>Download PDF Now</span>
                    </>
                  )}
                </button>
              </div>

              {/* Reassurance sub-copy */}
              <div className="pt-2 border-t border-[#E6DEC8]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B5E49] gap-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#059669]" />
                  <span>Verified Instant Access Document</span>
                </span>
                <span className="font-mono text-[11px] text-[#8A7E6B]">
                  License: {product.specs.license}
                </span>
              </div>
            </div>
          );
        })}

        {/* Download all button if multiple items */}
        {verifiedPayment.items.length > 1 && (
          <div className="text-center pt-2">
            <button
              onClick={handleDownloadAll}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0E3B23] text-white text-xs font-semibold rounded-xl hover:bg-[#165534] transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download All ({verifiedPayment.items.length} PDFs)</span>
            </button>
          </div>
        )}
      </div>

      {/* Return Navigation */}
      <div className="text-center pt-8 border-t border-[#E6DEC8]">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0E3B23] hover:text-[#C6923A] transition-colors"
        >
          <span>Return to Treasury</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
