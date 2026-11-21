import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { PeekInsideDrawer } from "@/components/PeekInsideDrawer";

export const metadata: Metadata = {
  title: "Lipi Kosha — A Treasury of Digital Resources",
  description:
    "Curated vault of 12 digital bundles, ChatGPT prompt engineering collections, B2B databases, and creative assets. Instant PDF downloads via secure UPI.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FAF7F0] text-[#1c271f] antialiased flex flex-col min-h-screen">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <PeekInsideDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
