import { NextResponse } from "next/server";
import { authService, tokenFromHeader } from "@/domains/auth";
import { checkoutService, type CartItem } from "@/domains/checkout";
import { errorResponse, invalidJson, readJson } from "@/lib/http";

function parseItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => ({
    productId: item && typeof item === "object" && "productId" in item
      ? String(item.productId ?? "") : "",
    quantity: item && typeof item === "object" && "quantity" in item
      ? Number(item.quantity) : Number.NaN,
  }));
}

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return invalidJson();
  const items = parseItems(body.items);
  const discountCode = typeof body.discountCode === "string" ? body.discountCode : undefined;

  if (body.place !== true) {
    const quote = checkoutService.quote(items, discountCode);
    if (!quote.ok) return errorResponse(quote.error);
    return NextResponse.json({ quote: quote.value });
  }

  const token = tokenFromHeader(request.headers.get("authorization"));
  const session = token ? authService.getSession(token) : null;
  const order = checkoutService.placeOrder(session?.userId ?? "", items, discountCode);
  if (!order.ok) return errorResponse(order.error);
  return NextResponse.json({ order: order.value }, { status: 201 });
}
