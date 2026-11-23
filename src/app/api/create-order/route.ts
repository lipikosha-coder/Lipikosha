import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getProductById } from "@/lib/products";

export async function POST(req: NextRequest) {
  try {
    const keyId = (
      process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ""
    ).trim();
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay credentials are not configured on server" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { amount, currency = "INR", receipt, productIds } = body;

    let orderAmountInPaise = 0;

    if (Array.isArray(productIds) && productIds.length > 0) {
      const validProducts = productIds
        .map((id: string) => getProductById(id))
        .filter(Boolean);
      const totalINR = validProducts.reduce((sum, p) => sum + (p?.price || 0), 0);
      orderAmountInPaise = Math.round(totalINR * 100);
    } else if (typeof amount === "number") {
      orderAmountInPaise = Math.round(amount);
    }

    // Validation: Minimum amount 100 paise (₹1)
    if (orderAmountInPaise < 100) {
      return NextResponse.json(
        { error: "Invalid amount. Minimum amount is 100 paise (₹1.00)." },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const receiptId =
      receipt ||
      `rcpt_${Date.now().toString(36)}_${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await razorpay.orders.create({
      amount: orderAmountInPaise,
      currency: currency || "INR",
      receipt: receiptId,
    });

    return NextResponse.json({
      success: true,
      order_id: order.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
      keyId: keyId,
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);

    const statusCode = error?.statusCode || error?.status;
    if (statusCode === 401 || error?.error?.code === "BAD_REQUEST_ERROR") {
      return NextResponse.json(
        { error: error?.error?.description || "Razorpay authentication failed" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error:
          error?.error?.description ||
          error?.message ||
          "Failed to create Razorpay order",
      },
      { status: 500 }
    );
  }
}
