import type { Product, SearchProvider, SearchQuery } from "./types";

export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 50;

export function clampLimit(limit: number | undefined): number {
  if (limit === undefined || Number.isNaN(limit)) return DEFAULT_LIMIT;
  return Math.min(MAX_LIMIT, Math.max(1, Math.floor(limit)));
}

function score(product: Product, term: string): number {
  if (product.name.toLowerCase().includes(term)) return 3;
  if (product.tags.some((t) => t.toLowerCase().includes(term))) return 2;
  if (product.description.toLowerCase().includes(term)) return 1;
  return 0;
}

export class SearchService {
  constructor(private provider: SearchProvider) {}

  search({ query = "", category, limit }: SearchQuery = {}): Product[] {
    const term = query.trim().toLowerCase();
    const max = clampLimit(limit);
    let products = this.provider.listProducts();

    if (category) {
      products = products.filter((p) => p.category === category);
    }

    if (!term) {
      return products.sort((a, b) => a.name.localeCompare(b.name)).slice(0, max);
    }

    return products
      .map((product) => ({ product, score: score(product, term) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
      .slice(0, max)
      .map((r) => r.product);
  }

  getProduct(id: string): Product | undefined {
    return this.provider.getProduct(id);
  }

  categories(): string[] {
    return [...new Set(this.provider.listProducts().map((p) => p.category))].sort();
  }
}
