// Row shapes, as stored. Column names use snake_case. Money is integer cents.

export type OrderRow = {
  id: string;
  user_id: string;
  subtotal_cents: number;
  discount_cents: number;
  tax_cents: number;
  total_cents: number;
  discount_code: string | null;
  // JSON array of OrderLine. MIGRATE-04 moves this to its own table.
  lines_json: string;
  created_at: number;
};

export type OrderLine = {
  productId: string;
  name: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
};
