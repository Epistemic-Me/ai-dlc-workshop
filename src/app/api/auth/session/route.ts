import { NextResponse } from "next/server";
import { authService, tokenFromHeader } from "@/domains/auth";

export async function GET(request: Request) {
  const token = tokenFromHeader(request.headers.get("authorization"));
  const user = token ? authService.getUser(token) : null;
  return NextResponse.json({ user });
}
