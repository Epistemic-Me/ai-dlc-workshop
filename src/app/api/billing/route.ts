import { NextResponse } from "next/server";
import { authService, tokenFromHeader } from "@/domains/auth";
import { billingService } from "@/domains/billing";
import { errorResponse, invalidJson, readJson } from "@/lib/http";

function userIdFrom(request: Request): string {
  const token = tokenFromHeader(request.headers.get("authorization"));
  return (token && authService.getSession(token)?.userId) || "";
}

export async function GET(request: Request) {
  const userId = userIdFrom(request);
  return NextResponse.json({
    plans: billingService.listPlans(),
    subscription: userId ? billingService.getSubscription(userId) : null,
    invoices: userId ? billingService.listInvoices(userId) : [],
  });
}

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return invalidJson();
  const result = billingService.changePlan(userIdFrom(request), String(body.planId ?? ""));
  if (!result.ok) return errorResponse(result.error);
  return NextResponse.json(result.value);
}
