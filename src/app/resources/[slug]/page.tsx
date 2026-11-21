import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS, getProductById, getRelatedProducts } from "@/lib/products";
import { ProductDetailClient } from "./ProductDetailClient";
import { ChevronRight } from "lucide-react";

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductById(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product.id, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb matching wireframe */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#8A7E6B]">
        <Link href="/" className="hover:text-[#0E3B23] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#C6923A]" />
        <Link href="/resources" className="hover:text-[#0E3B23] transition-colors">
          All Resources
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#C6923A]" />
        <span className="font-semibold text-[#0E3B23] truncate max-w-xs sm:max-w-md">
          {product.title}
        </span>
      </nav>

      {/* Interactive 2-Column Product Detail Client */}
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </div>
  );
}
