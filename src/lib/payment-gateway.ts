export interface PaymentVerificationResult {
  success: boolean;
  orderId: string;
  upiId: string;
  paymentMethod: string;
  unlockedFiles: Array<{
    id: string;
    title: string;
    fileName: string;
    downloadUrl: string;
  }>;
}

/**
 * Pluggable Payment Gateway Adapter
 * Runs in clean UPI Demo Mode until live gateway keys (Razorpay, Cashfree, or Supabase) are connected.
 */
export async function verifyUpiPayment(params: {
  orderId: string;
  productIds: string[];
  upiId: string;
  paymentMethod: string;
}): Promise<PaymentVerificationResult> {
  const response = await fetch("/api/verify-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error("Payment verification failed at gateway");
  }

  return response.json();
}
