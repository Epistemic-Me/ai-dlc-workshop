import { NextResponse } from "next/server";
import { authService, tokenFromHeader } from "@/domains/auth";
import { errorResponse } from "@/lib/http";
import { legacyOrders } from "@/legacy";

function userIdFrom(request: Request): string {
  const token = tokenFromHeader(request.headers.get("authorization"));
  return (token && authService.getSession(token)?.userId) || "";
}

// Order history. Still reads through the legacy data-access layer (LEGACY-06).
export async function GET(request: Request) {
  const userId = userIdFrom(request);
  if (!userId) {
    return errorResponse({ code: "unauthenticated", message: "Log in to see your orders." });
  }
  const orders = legacyOrders.findOrdersByUser(userId) ?? [];
  const totalSpent = legacyOrders.getUserTotal(userId);
  return NextResponse.json({ orders, totalSpent });
}
