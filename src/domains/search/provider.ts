import type { Product, SearchProvider } from "./types";

export const CATALOG: Product[] = [
  {
    id: "prod_notebook",
    name: "Dot Grid Notebook",
    description: "A5 notebook with 120 dot grid pages.",
    category: "stationery",
    priceCents: 1200,
    tags: ["paper", "journal"],
  },
  {
    id: "prod_pen",
    name: "Gel Pen Set",
    description: "Five fine-tip gel pens in assorted colors.",
    category: "stationery",
    priceCents: 899,
    tags: ["ink", "writing"],
  },
  {
    id: "prod_mug",
    name: "Ceramic Mug",
    description: "350 ml mug for coffee or tea.",
    category: "kitchen",
    priceCents: 1500,
    tags: ["coffee", "tea"],
  },
  {
    id: "prod_kettle",
    name: "Pour-Over Kettle",
    description: "Gooseneck kettle for pour-over coffee.",
    category: "kitchen",
    priceCents: 4500,
    tags: ["coffee", "brewing"],
  },
  {
    id: "prod_lamp",
    name: "Desk Lamp",
    description: "Adjustable LED lamp with warm light for reading and writing.",
    category: "office",
    priceCents: 3900,
    tags: ["light", "desk"],
  },
  {
    id: "prod_stand",
    name: "Laptop Stand",
    description: "Aluminum stand that lifts a laptop to eye level.",
    category: "office",
    priceCents: 2900,
    tags: ["desk", "ergonomic"],
  },
];

export class InMemorySearchProvider implements SearchProvider {
  constructor(private products: Product[] = CATALOG) {}

  listProducts(): Product[] {
    return [...this.products];
  }

  getProduct(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }
}
