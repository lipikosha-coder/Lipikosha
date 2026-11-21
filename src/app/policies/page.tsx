"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, FileText, RefreshCw, Lock, HelpCircle } from "lucide-react";

type PolicyTab = "terms" | "refund" | "privacy";

function PoliciesContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as PolicyTab | null;

  const [activeTab, setActiveTab] = useState<PolicyTab>("terms");

  useEffect(() => {
    if (tabParam && ["terms", "refund", "privacy"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const tabs: { id: PolicyTab; label: string; icon: React.ReactNode }[] = [
    { id: "terms", label: "Terms", icon: <FileText className="w-4 h-4" /> },
    { id: "refund", label: "Refund Policy", icon: <RefreshCw className="w-4 h-4" /> },
    { id: "privacy", label: "Privacy", icon: <Lock className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title matching wireframe */}
      <div className="space-y-2">
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#0E3B23]">
          Terms &amp; Policies
        </h1>
        <p className="text-xs sm:text-sm text-[#5C5343]">
          Legal assurances, licensing rights, zero-contact delivery framework, and digital goods regulations.
        </p>
      </div>

      {/* Interactive Pill Tabs matching wireframe: Terms | Refund Policy | Privacy */}
      <div className="flex items-center gap-3 border-b border-[#E6DEC8] pb-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? "bg-[#0E3B23] text-white shadow-sm border border-[#0E3B23]"
                  : "bg-white text-[#5C5343] border border-[#E6DEC8] hover:border-[#C6923A] hover:bg-[#FAF7F0]"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Policies Panel matching wireframe border box */}
      <div className="bg-white rounded-3xl border border-[#E6DEC8] p-6 sm:p-10 shadow-card space-y-10 leading-relaxed text-sm text-[#4A4234]">
        {/* TAB 1: TERMS */}
        {activeTab === "terms" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="border-b border-[#E6DEC8] pb-4">
              <h2 className="font-cinzel text-2xl font-bold text-[#0E3B23]">
                Terms of Service &amp; Commercial Licensing
              </h2>
              <p className="text-xs text-[#8A7E6B] mt-1 font-mono">
                Effective Date: November 2026 • Version 2.4
              </p>
            </div>

            <section className="space-y-3">
              <h3 className="font-heading text-lg font-bold text-[#0E3B23]">
                1. Nature of Digital Goods &amp; Instant Delivery
              </h3>
              <p className="text-[#5C5343]">
                Lipi Kosha provides high-performance digital downloadable resources including,
                but not limited to, 2D motion graphics source projects, Adobe After Effects (.aep)
                files, generative AI prompt engineering libraries, Figma design systems, and
                marketing intelligence spreadsheets. All products are delivered immediately upon
                successful Unified Payments Interface (UPI) transaction confirmation as direct,
                uncompressed PDF documents and digital bundles.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-heading text-lg font-bold text-[#0E3B23]">
                2. Commercial &amp; Personal License Grant
              </h3>
              <p className="text-[#5C5343]">
                Upon verified payment, Lipi Kosha grants you a perpetual, worldwide, non-exclusive,
                royalty-free commercial and personal license:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#5C5343]">
                <li>
                  <strong>Permitted:</strong> You may freely incorporate, adapt, and build upon
                  these assets in unlimited personal, client, and commercial end-products (e.g.,
                  YouTube videos, commercial advertisements, client web applications, SaaS
                  platforms, and social media campaigns).
                </li>
                <li>
                  <strong>Prohibited:</strong> You may not sub-license, resell, redistribute,
                  rent, or make available the raw asset source files (e.g., sharing raw .aep,
                  .fig, .csv prompt databases) on any public repository, marketplace, or file-sharing site.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="font-heading text-lg font-bold text-[#0E3B23]">
                3. Zero-Contact Delivery &amp; Ephemeral In-Memory Sessions
              </h3>
              <p className="text-[#5C5343]">
                Lipi Kosha operates an ephemeral, privacy-first storefront. We deliberately do
                not require user account registrations, usernames, or persistent logins.
                Consequently, the download token and unlocked resource link are maintained
                strictly in temporary browser memory during your active checkout session. You are
                instructed to download and store your PDF files locally on your device immediately
                upon payment completion.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-heading text-lg font-bold text-[#0E3B23]">
                4. Software Compatibility &amp; Requirements
              </h3>
              <p className="text-[#5C5343]">
                Customers are solely responsible for ensuring they possess the necessary software
                and hardware to open and edit the purchased file formats (such as Adobe After
                Effects 2021+, Figma, DaVinci Resolve, or Microsoft Excel/Google Sheets). Specific
                compatibility details are outlined on each product specification sheet.
              </p>
            </section>
          </div>
        )}

        {/* TAB 2: REFUND POLICY */}
        {activeTab === "refund" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="border-b border-[#E6DEC8] pb-4">
              <h2 className="font-cinzel text-2xl font-bold text-[#0E3B23]">
                Refund &amp; Cancellation Policy
              </h2>
              <p className="text-xs text-[#8A7E6B] mt-1 font-mono">
                Mandatory Indian Consumer Protection (E-Commerce) Rules Disclosure
              </p>
            </div>

            <section className="space-y-3">
              <h3 className="font-heading text-lg font-bold text-[#0E3B23]">
                1. Strict Non-Refundable Digital Goods Principle
              </h3>
              <p className="text-[#5C5343]">
                Due to the intangible and irrevocable nature of digital downloads, all sales
                conducted on Lipi Kosha are <strong>final and non-refundable</strong>. Once a UPI
                payment is authorized and the instant PDF download token is unlocked in your
                session, the transaction cannot be reversed, returned, or canceled.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-heading text-lg font-bold text-[#0E3B23]">
                2. Corrupted Archive &amp; Integrity Guarantee
              </h3>
              <p className="text-[#5C5343]">
                We rigorously verify each PDF bundle prior to publishing.
                In the rare event that a downloaded archive fails extraction due to server-side
                corruption:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#5C5343]">
                <li>
                  Provide your UPI transaction reference ID and timestamp to our support team
                  within 7 days of payment.
                </li>
                <li>
                  We will issue an authenticated replacement download link or deliver the raw
                  unpacked source files directly to your verified email address within 24 business hours.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="font-heading text-lg font-bold text-[#0E3B23]">
                3. Duplicate Transaction Redressal
              </h3>
              <p className="text-[#5C5343]">
                If your bank or UPI application inadvertently executes a duplicate charge for the
                same transaction reference, please notify us immediately. Upon reconciliation
                with the NPCI settlement gateway, duplicate amounts will be reversed to the source
                bank account within 48 to 72 bank working hours.
              </p>
            </section>
          </div>
        )}

        {/* TAB 3: PRIVACY */}
        {activeTab === "privacy" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="border-b border-[#E6DEC8] pb-4">
              <h2 className="font-cinzel text-2xl font-bold text-[#0E3B23]">
                Privacy &amp; Data Minimization Policy
              </h2>
              <p className="text-xs text-[#8A7E6B] mt-1 font-mono">
                Zero-Retention Architecture • Digital Personal Data Protection (DPDP) Compliant
              </p>
            </div>

            <section className="space-y-3">
              <h3 className="font-heading text-lg font-bold text-[#0E3B23]">
                1. Zero Account &amp; Zero Tracking Philosophy
              </h3>
              <p className="text-[#5C5343]">
                Lipi Kosha is architected around absolute data minimization. We do not maintain
                user accounts, passwords, or personal profile databases. We do not use intrusive
                third-party tracking pixels or behavioral ad cookies.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-heading text-lg font-bold text-[#0E3B23]">
                2. UPI Payment Security &amp; NPCI Compliance
              </h3>
              <p className="text-[#5C5343]">
                All transactions are processed through certified Unified Payments Interface (UPI)
                gateways overseen by the National Payments Corporation of India (NPCI) and
                regulated by the Reserve Bank of India (RBI).
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#5C5343]">
                <li>Lipi Kosha never accesses or stores your 4 or 6-digit UPI MPIN.</li>
                <li>We do not record debit card numbers, CVVs, or internet banking passwords.</li>
                <li>
                  Ephemeral in-memory session tokens are discarded immediately when you close or
                  refresh your browser.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="font-heading text-lg font-bold text-[#0E3B23]">
                3. Customer Support &amp; Grievances
              </h3>
              <p className="text-[#5C5343]">
                For any licensing questions, transaction verification, or asset queries, contact
                our compliance team at:
              </p>
              <div className="p-4 bg-[#FAF7F0] border border-[#E6DEC8] rounded-xl font-mono text-xs text-[#0E3B23] space-y-1">
                <p><strong>Lipi Kosha Digital Assets Directorate</strong></p>
                <p>Support &amp; Inquiries: contact@lipikosha.internal</p>
                <p>Grievance Officer: Bengaluru, Karnataka, India</p>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PoliciesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto px-4 py-16 text-center text-sm text-[#6B5E49]">
          Loading Terms &amp; Policies...
        </div>
      }
    >
      <PoliciesContent />
    </Suspense>
  );
}
