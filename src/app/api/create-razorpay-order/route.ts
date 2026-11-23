import { NextRequest } from "next/server";
import { POST as createOrderHandler } from "../create-order/route";

// Alias endpoint for backwards compatibility
export async function POST(req: NextRequest) {
  return createOrderHandler(req);
}
