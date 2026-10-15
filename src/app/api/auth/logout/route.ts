import { NextResponse } from "next/server";
import { authService, tokenFromHeader } from "@/domains/auth";

export async function POST(request: Request) {
  const token = tokenFromHeader(request.headers.get("authorization"));
  if (token) authService.logout(token);
  return NextResponse.json({ ok: true });
}
