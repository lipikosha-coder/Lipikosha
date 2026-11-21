import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Zap, FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#FAF7F0] border-t border-[#E6DEC8] mt-20">
      {/* Value Pillars Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-[#E6DEC8]/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-[#4A4234]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white border border-[#E6DEC8] flex items-center justify-center text-[#0E3B23] flex-shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-[#0E3B23]">Instant Direct PDF Delivery</p>
              <p className="text-xs text-[#6B5E49]">No account creation or waiting required</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white border border-[#E6DEC8] flex items-center justify-center text-[#0E3B23] flex-shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-[#0E3B23]">Frictionless UPI Checkout</p>
              <p className="text-xs text-[#6B5E49]">Pay in seconds with GPay, PhonePe or Paytm</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white border border-[#E6DEC8] flex items-center justify-center text-[#0E3B23] flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-[#0E3B23]">100% Virus-Free &amp; Verified</p>
              <p className="text-xs text-[#6B5E49]">Perpetual commercial &amp; personal license</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
        {/* Left: Brand Logo & Copyright */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#E6DEC8] bg-white p-0.5 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Lipi Kosha"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-[#5C5343]">
            <span className="font-cinzel font-semibold text-[#0E3B23]">© Lipi Kosha</span>
            {" · "}
            <span className="italic text-[#6B5E49]">A Treasury of Digital Resources.</span>
          </p>
        </div>

        {/* Right: Policy Links matching wireframe */}
        <div className="flex items-center gap-6 text-sm text-[#5C5343]">
          <Link
            href="/policies?tab=terms"
            className="hover:text-[#0E3B23] transition-colors"
          >
            Terms
          </Link>
          <span className="text-[#C6923A]">•</span>
          <Link
            href="/policies?tab=refund"
            className="hover:text-[#0E3B23] transition-colors"
          >
            Refund Policy
          </Link>
          <span className="text-[#C6923A]">•</span>
          <Link
            href="/policies?tab=privacy"
            className="hover:text-[#0E3B23] transition-colors"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
