import { describe, expect, it } from "vitest";
import { CATALOG, InMemorySearchProvider } from "./provider";
import { clampLimit, MAX_LIMIT, SearchService } from "./service";

const service = new SearchService(new InMemorySearchProvider());
const ids = (query: Parameters<SearchService["search"]>[0]) =>
  service.search(query).map((p) => p.id);

describe("SearchService", () => {
  it("ranks name matches above tag and description matches", () => {
    expect(ids({ query: "kettle" })).toEqual(["prod_kettle"]);
    expect(ids({ query: "writing" })).toEqual(["prod_pen", "prod_lamp"]);
  });

  it("matches tags", () => {
    expect(ids({ query: "ergonomic" })).toEqual(["prod_stand"]);
  });

  it("is case-insensitive", () => {
    expect(ids({ query: "MUG" })).toEqual(["prod_mug"]);
  });

  it("filters by category", () => {
    expect(ids({ query: "coffee", category: "kitchen" })).toEqual(["prod_mug", "prod_kettle"]);
    expect(ids({ query: "coffee", category: "office" })).toEqual([]);
  });

  it("returns all products sorted by name for an empty query", () => {
    const names = service.search({ query: "  " }).map((p) => p.name);
    expect(names).toHaveLength(CATALOG.length);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it("clamps the limit", () => {
    expect(service.search({ limit: 2 })).toHaveLength(2);
    expect(service.search({ limit: 0 })).toHaveLength(1);
    expect(clampLimit(1000)).toBe(MAX_LIMIT);
    expect(clampLimit(Number.NaN)).toBe(20);
  });

  it("returns an empty list when nothing matches", () => {
    expect(ids({ query: "submarine" })).toEqual([]);
  });

  it("lists categories", () => {
    expect(service.categories()).toEqual(["kitchen", "office", "stationery"]);
  });
});
