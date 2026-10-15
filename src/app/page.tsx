"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/domains/search/types";
import { api, formatCents } from "@/lib/client";

type SearchResponse = { results: Product[]; categories: string[] };

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [data, setData] = useState<SearchResponse>({ results: [], categories: [] });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({ q: query });
    if (category) params.set("category", category);
    api<SearchResponse>(`/api/search?${params}`)
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch((e: Error) => setError(e.message));
  }, [query, category]);

  return (
    <>
      <h1>Product search</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          aria-label="Search products"
          placeholder="Search products"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          aria-label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {data.categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </form>
      {error && <p className="error">{error}</p>}
      <ul className="list">
        {data.results.map((p) => (
          <li key={p.id}>
            <strong>{p.name}</strong> {formatCents(p.priceCents)}
            <div className="muted">{p.description}</div>
          </li>
        ))}
      </ul>
      {data.results.length === 0 && !error && <p className="muted">No products match.</p>}
    </>
  );
}
