import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/products";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productIds } = body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: "No products provided" },
        { status: 400 }
      );
    }

    // Securely calculate total amount on server from product catalog
    const validProducts = productIds
      .map((id: string) => getProductById(id))
      .filter(Boolean);

    if (validProducts.length === 0) {
      return NextResponse.json(
        { error: "No valid products found" },
        { status: 400 }
      );
    }

    const totalINR = validProducts.reduce((sum, p) => sum + (p?.price || 0), 0);
    const amountInPaise = totalINR * 100; // Razorpay expects amount in paise (1 INR = 100 paise)

    const keyId =
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If live or test Razorpay API keys are configured, generate authentic order on Razorpay
    if (keyId && keySecret) {
      const authHeader = Buffer.from(`${keyId.trim()}:${keySecret.trim()}`).toString("base64");
      const receiptId = `rcpt_${Date.now().toString(36)}_${Math.floor(1000 + Math.random() * 9000)}`;

      const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authHeader}`,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: receiptId,
          notes: {
            store: "Lipi Kosha",
            products: validProducts.map((p) => p?.title).join(", "),
          },
        }),
      });

      if (rzpRes.ok) {
        const orderData = await rzpRes.json();
        return NextResponse.json({
          success: true,
          isLiveGateway: true,
          orderId: orderData.id,
          amount: orderData.amount,
          currency: orderData.currency,
          keyId: keyId.trim(),
          productTitles: validProducts.map((p) => p?.title),
        });
      } else {
        const errorText = await rzpRes.text();
        console.error("Razorpay order creation failed:", errorText);
        return NextResponse.json(
          {
            success: false,
            error: "Razorpay API rejected order creation",
            details: errorText,
            keyIdPrefix: keyId.substring(0, 8),
          },
          { status: 400 }
        );
      }
    }

    // Fallback sandbox / demo mode if keys are not yet configured in environment
    const demoOrderId = `order_demo_${Date.now().toString(36)}_${Math.floor(1000 + Math.random() * 9000)}`;
    return NextResponse.json({
      success: true,
      isLiveGateway: false,
      diagnostic: {
        hasKeyId: Boolean(keyId),
        hasKeySecret: Boolean(keySecret),
        missing: !keyId ? "RAZORPAY_KEY_ID" : !keySecret ? "RAZORPAY_KEY_SECRET" : "None",
      },
      orderId: demoOrderId,
      amount: amountInPaise,
      currency: "INR",
      keyId: keyId || "rzp_test_placeholder",
      productTitles: validProducts.map((p) => p?.title),
    });
  } catch (err) {
    console.error("Create Razorpay order error:", err);
    return NextResponse.json(
      { error: "Failed to initialize payment order" },
      { status: 500 }
    );
  }
}
