import { NextResponse } from "next/server";
import { authService } from "@/domains/auth";
import { errorResponse, invalidJson, readJson } from "@/lib/http";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return invalidJson();
  const result = authService.login(String(body.email ?? ""), String(body.password ?? ""));
  if (!result.ok) return errorResponse(result.error);
  return NextResponse.json({ session: result.value });
}
