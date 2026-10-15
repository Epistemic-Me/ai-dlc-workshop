import { NextResponse, type NextRequest } from "next/server";
import { searchService } from "@/domains/search";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const limit = params.get("limit");
  const results = searchService.search({
    query: params.get("q") ?? "",
    category: params.get("category") || undefined,
    limit: limit ? Number(limit) : undefined,
  });
  return NextResponse.json({ results, categories: searchService.categories() });
}
