import { NextResponse } from "next/server";
import type { DomainError } from "@/domains/errors";

const STATUS: Record<string, number> = {
  invalid_input: 400,
  invalid_json: 400,
  invalid_credentials: 401,
  unauthenticated: 401,
  unknown_product: 400,
  unknown_plan: 400,
  invalid_quantity: 400,
  invalid_discount: 400,
  empty_cart: 400,
  too_many_lines: 400,
  same_plan: 409,
};

export function errorResponse(error: DomainError) {
  return NextResponse.json({ error }, { status: STATUS[error.code] ?? 400 });
}

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body: unknown = await request.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export const invalidJson = () =>
  errorResponse({ code: "invalid_json", message: "Request body must be a JSON object." });
