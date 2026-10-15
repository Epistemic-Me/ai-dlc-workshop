import { NextResponse, type NextRequest } from "next/server";
import { MAX_QUERY_LENGTH, searchService } from "@/domains/search";
import { jsonError } from "@/lib/http";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const limit = params.get("limit");
  const query = params.get("q") ?? "";
  if (query.length > MAX_QUERY_LENGTH) {
    return jsonError("invalid_input", `Query must be at most ${MAX_QUERY_LENGTH} characters.`, 400);
  }
  const results = searchService.search({
    query,
    category: params.get("category") || undefined,
    limit: limit ? Number(limit) : undefined,
  });
  return NextResponse.json({ results, categories: searchService.categories() });
}
