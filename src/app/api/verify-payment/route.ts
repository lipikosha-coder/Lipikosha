import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PRODUCTS, getProductById } from "@/lib/products";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderId,
      productIds,
      upiId,
      paymentMethod,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = body;

    const itemsToUnlock = Array.isArray(productIds)
      ? productIds.map((id: string) => getProductById(id)).filter(Boolean)
      : [];

    if (itemsToUnlock.length === 0) {
      return NextResponse.json(
        { error: "No valid products provided for verification" },
        { status: 400 }
      );
    }

    // STRICT VERIFICATION: Razorpay cryptographic HMAC SHA256 signature verification
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();
    if (!keySecret) {
      console.error("Payment verification failed: RAZORPAY_KEY_SECRET is missing");
      return NextResponse.json(
        { error: "Payment gateway configuration error on server" },
        { status: 500 }
      );
    }

    if (!razorpaySignature || !razorpayOrderId || !razorpayPaymentId) {
      console.error("Payment verification rejected: Missing transaction signature or IDs", {
        hasSignature: Boolean(razorpaySignature),
        hasOrderId: Boolean(razorpayOrderId),
        hasPaymentId: Boolean(razorpayPaymentId),
      });
      return NextResponse.json(
        { error: "Payment verification rejected: Missing transaction credentials" },
        { status: 400 }
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      console.error("Cryptographic signature mismatch!", {
        generated: generatedSignature,
        received: razorpaySignature,
      });
      return NextResponse.json(
        { error: "Payment verification failed: Invalid transaction signature" },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_URL ||
      "https://example.supabase.co";

    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      "dummy-key-for-build";

    let supabase: ReturnType<typeof createClient> | null = null;
    try {
      if (supabaseUrl && supabaseKey) {
        supabase = createClient(supabaseUrl, supabaseKey);
      }
    } catch (e) {
      console.warn("Supabase client init warning:", e);
    }

    const effectiveOrderId =
      razorpayOrderId ||
      orderId ||
      `LK-UPI-${Date.now().toString(36).toUpperCase()}`;

    // Generate signed download URLs using product.fileName in the 'products' bucket
    const unlockedFiles = await Promise.all(
      itemsToUnlock.map(async (product) => {
        if (!product) return null;

        let signedUrl = "";

        if (
          supabase &&
          process.env.NEXT_PUBLIC_SUPABASE_URL &&
          (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
        ) {
          try {
            const { data, error } = await supabase.storage
              .from("products")
              .createSignedUrl(product.fileName, 3600, {
                download: product.fileName,
              });

            if (!error && data?.signedUrl) {
              signedUrl = data.signedUrl;
            }
          } catch (err) {
            console.error(`Error generating signed URL for ${product.fileName}:`, err);
          }
        }

        // If no active live Supabase credentials configured in environment,
        // use our direct linked high-speed PDF asset URL
        if (!signedUrl) {
          signedUrl = `/downloads/${encodeURIComponent(product.fileName)}`;
        }

        return {
          id: product.id,
          title: product.title,
          fileName: product.fileName,
          category: product.category,
          price: product.price,
          downloadUrl: signedUrl,
        };
      })
    );

    return NextResponse.json({
      success: true,
      orderId: effectiveOrderId,
      paymentId: razorpayPaymentId || `pay_sim_${Date.now().toString(36)}`,
      verifiedAt: new Date().toISOString(),
      paymentMethod: razorpayPaymentId ? "Razorpay" : paymentMethod || "UPI",
      upiId: upiId || (razorpayPaymentId ? "razorpay@gateway" : "user@upi"),
      unlockedFiles: unlockedFiles.filter(Boolean),
    });
  } catch (error) {
    console.error("Payment verification route error:", error);
    return NextResponse.json(
      { error: "Internal server error verifying payment" },
      { status: 500 }
    );
  }
}
