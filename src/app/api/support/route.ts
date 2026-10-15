import { NextResponse } from "next/server";
import { authService, tokenFromHeader } from "@/domains/auth";
import { errorResponse, invalidJson, readJson } from "@/lib/http";
import { MAX_MESSAGE_LENGTH, supportAgent } from "@/support-agent";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return invalidJson();
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return errorResponse({
      code: "invalid_input",
      message: `Message must be 1 to ${MAX_MESSAGE_LENGTH} characters.`,
    });
  }
  const token = tokenFromHeader(request.headers.get("authorization"));
  const userId = (token && authService.getSession(token)?.userId) || "";
  return NextResponse.json(await supportAgent.reply(userId, message));
}
