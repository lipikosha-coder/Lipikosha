import React from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-[#FAF7F0] border border-[#E6DEC8] flex items-center justify-center mx-auto text-[#0E3B23]">
        <Compass className="w-10 h-10 text-[#C6923A]" />
      </div>

      <div className="space-y-2">
        <h1 className="font-cinzel text-3xl font-bold text-[#0E3B23]">
          404 — Resource Not Found
        </h1>
        <p className="text-sm text-[#5C5343]">
          The digital archive or page you are looking for has been relocated or does not exist in our treasury.
        </p>
      </div>

      <div>
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0E3B23] text-white text-sm font-semibold hover:bg-[#165534] transition-colors"
        >
          <span>Return to All Resources</span>
          <ArrowRight className="w-4 h-4 text-[#C6923A]" />
        </Link>
      </div>
    </div>
  );
}
