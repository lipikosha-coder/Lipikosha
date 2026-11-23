import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PRODUCTS, getProductById } from "@/lib/products";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const effectiveOrderId =
      body.razorpay_order_id ||
      body.order_id ||
      body.razorpayOrderId ||
      body.orderId;

    const effectivePaymentId =
      body.razorpay_payment_id ||
      body.payment_id ||
      body.razorpayPaymentId ||
      body.paymentId;

    const effectiveSignature =
      body.razorpay_signature ||
      body.signature ||
      body.razorpaySignature;

    const {
      productIds,
      upiId,
      paymentMethod,
    } = body;

    const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();
    if (!keySecret) {
      console.error("Payment verification failed: RAZORPAY_KEY_SECRET is missing");
      return NextResponse.json(
        { error: "Payment gateway configuration error on server" },
        { status: 500 }
      );
    }

    // Validation: Missing fields
    if (!effectiveOrderId || !effectivePaymentId || !effectiveSignature) {
      return NextResponse.json(
        {
          error:
            "Missing required transaction fields: order_id, payment_id, or signature",
        },
        { status: 400 }
      );
    }

    // Cryptographic verification: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${effectiveOrderId}|${effectivePaymentId}`)
      .digest("hex");

    if (generatedSignature !== effectiveSignature) {
      console.error("Signature mismatch:", {
        generated: generatedSignature,
        received: effectiveSignature,
      });
      return NextResponse.json(
        { error: "Payment verification failed: Invalid transaction signature" },
        { status: 400 }
      );
    }

    const itemsToUnlock = Array.isArray(productIds)
      ? productIds.map((id: string) => getProductById(id)).filter(Boolean)
      : [];

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
      order_id: effectiveOrderId,
      orderId: effectiveOrderId,
      payment_id: effectivePaymentId,
      paymentId: effectivePaymentId,
      verifiedAt: new Date().toISOString(),
      paymentMethod: "Razorpay",
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
