"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { Product, PRODUCTS } from "@/lib/products";

export interface UnlockedProductItem extends Product {
  downloadUrl?: string;
}

export interface VerifiedPaymentSession {
  orderId: string;
  purchasedAt: string;
  items: UnlockedProductItem[];
  totalPaid: number;
  paymentMethod: string;
  upiId: string;
  sessionToken: string;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  cartCount: number;
  subtotalMRP: number;
  totalPrice: number;
  totalSavings: number;
  directBuyProduct: Product | null;
  setDirectBuyProduct: (product: Product | null) => void;
  checkoutItems: Product[];
  verifiedPayment: VerifiedPaymentSession | null;
  setVerifiedPayment: (session: VerifiedPaymentSession | null) => void;
  completePayment: (
    method: string,
    upiId: string,
    unlockedData?: Array<{ id: string; downloadUrl: string }>
  ) => VerifiedPaymentSession;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  peekProduct: Product | null;
  setPeekProduct: (product: Product | null) => void;
  availableAddons: Product[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);
  const [directBuyProduct, setDirectBuyProduct] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [peekProduct, setPeekProduct] = useState<Product | null>(null);

  // STRICTLY EPHEMERAL IN-MEMORY PAYMENT STATE
  // Never stored in localStorage, sessionStorage, or cookies.
  const [verifiedPayment, setVerifiedPayment] = useState<VerifiedPaymentSession | null>(null);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    if (directBuyProduct?.id === productId) {
      setDirectBuyProduct(null);
    }
  };

  const clearCart = () => {
    setCart([]);
    setDirectBuyProduct(null);
  };

  const isInCart = (productId: string) => {
    return cart.some((item) => item.id === productId);
  };

  const checkoutItems = useMemo(() => {
    if (directBuyProduct) {
      return [directBuyProduct];
    }
    return cart;
  }, [directBuyProduct, cart]);

  const cartCount = cart.length;

  const subtotalMRP = useMemo(() => {
    return checkoutItems.reduce((acc, item) => acc + item.mrp, 0);
  }, [checkoutItems]);

  const totalPrice = useMemo(() => {
    return checkoutItems.reduce((acc, item) => acc + item.price, 0);
  }, [checkoutItems]);

  const totalSavings = useMemo(() => {
    return Math.max(0, subtotalMRP - totalPrice);
  }, [subtotalMRP, totalPrice]);

  // Suggested add-ons for the cart drawer (products currently not in cart)
  const availableAddons = useMemo(() => {
    return PRODUCTS.filter(
      (p) => !cart.some((c) => c.id === p.id) && (p.price === 49 || p.price === 99 || p.price === 129)
    ).slice(0, 3);
  }, [cart]);

  const completePayment = (
    method: string,
    upiId: string,
    unlockedData?: Array<{ id: string; downloadUrl: string }>
  ): VerifiedPaymentSession => {
    const itemsPurchased: UnlockedProductItem[] = checkoutItems.map((prod) => {
      const match = unlockedData?.find((u) => u.id === prod.id);
      return {
        ...prod,
        downloadUrl: match?.downloadUrl || `/downloads/${encodeURIComponent(prod.fileName)}`,
      };
    });

    const generatedSession: VerifiedPaymentSession = {
      orderId: `LK-UPI-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      purchasedAt: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      items: itemsPurchased,
      totalPaid: totalPrice,
      paymentMethod: method,
      upiId: upiId || "user@upi",
      sessionToken: `token_${Math.random().toString(36).substring(2)}_${Date.now()}`,
    };

    setVerifiedPayment(generatedSession);
    setCart([]);
    setDirectBuyProduct(null);
    setIsCartDrawerOpen(false);

    return generatedSession;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        cartCount,
        subtotalMRP,
        totalPrice,
        totalSavings,
        directBuyProduct,
        setDirectBuyProduct,
        checkoutItems,
        verifiedPayment,
        setVerifiedPayment,
        completePayment,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        peekProduct,
        setPeekProduct,
        availableAddons,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
