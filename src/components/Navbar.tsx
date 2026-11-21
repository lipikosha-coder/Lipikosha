"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Menu, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { cartCount, setIsCartDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "All Resources", href: "/resources" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F0]/95 backdrop-blur-md border-b border-[#E6DEC8] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-3.5 group focus:outline-none"
        >
          <div className="relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden border border-[#E6DEC8] bg-white p-1 shadow-sm group-hover:border-[#C6923A] transition-colors">
            <Image
              src="/logo.png"
              alt="Lipi Kosha Emblem"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider text-[#0E3B23] group-hover:text-[#165534] transition-colors leading-none">
              LIPI KOSHA
            </span>
            <span className="text-[11px] sm:text-xs text-[#6B5E49] italic tracking-wide mt-1 hidden sm:inline">
              A Treasury of Digital Resources.
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "text-[#0E3B23] font-semibold border-b-2 border-[#0E3B23] pb-1"
                  : "text-[#5C5343] hover:text-[#0E3B23]"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Cart Button with Slide-over Drawer Trigger */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#E6DEC8] bg-white hover:border-[#C6923A] hover:bg-[#FAF7F0] text-[#0E3B23] transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-sm font-medium">Cart ({cartCount})</span>
            {cartCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#C6923A] animate-pulse" />
            )}
          </button>
        </nav>

        {/* Mobile menu button */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E6DEC8] text-[#0E3B23] text-xs font-semibold"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>({cartCount})</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-[#0E3B23] hover:bg-[#F3EDE0] transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E6DEC8] bg-[#FAF7F0] px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                isActive(link.href)
                  ? "bg-[#0E3B23] text-white"
                  : "text-[#5C5343] hover:bg-[#F3EDE0]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setIsCartDrawerOpen(true);
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-white border border-[#E6DEC8] text-[#0E3B23] font-medium text-left"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Your Cart</span>
            </div>
            <span className="bg-[#0E3B23] text-white text-xs px-2.5 py-0.5 rounded-full">
              {cartCount} items
            </span>
          </button>
        </div>
      )}
    </header>
  );
}
