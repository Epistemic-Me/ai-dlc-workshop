export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  priceCents: number;
  tags: string[];
};

export type SearchQuery = {
  query?: string;
  category?: string;
  limit?: number;
};

export interface SearchProvider {
  listProducts(): Product[];
  getProduct(id: string): Product | undefined;
}
