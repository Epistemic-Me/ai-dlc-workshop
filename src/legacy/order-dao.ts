import type { Database, OrderLine, OrderRow } from "@/db";

export class LegacyDataError extends Error {}

export type LegacyOrderItem = {
  sku: string;
  qty: number;
  price: number;
};

export type LegacyOrder = {
  orderId: string;
  customer: string;
  items: LegacyOrderItem[];
  total: number;
  discount?: string;
  created: string;
};

function toLegacy(row: OrderRow): LegacyOrder {
  const lines = JSON.parse(row.lines_json) as OrderLine[];
  const order: LegacyOrder = {
    orderId: row.id,
    customer: row.user_id,
    items: lines.map((l) => ({ sku: l.productId, qty: l.quantity, price: l.unitPriceCents / 100 })),
    total: row.total_cents / 100,
    created: new Date(row.created_at).toISOString(),
  };
  if (row.discount_code) order.discount = row.discount_code;
  return order;
}

/**
 * Old order data-access layer. New code uses OrderRepository from @/db.
 * See backlog/LEGACY-06.md for the call sites still on this layer.
 */
export class LegacyOrderDao {
  constructor(private db: Database) {}

  findOrdersByUser(userId: string): LegacyOrder[] | null {
    const rows = this.db.table<OrderRow>("orders").filter((r) => r.user_id === userId);
    if (rows.length === 0) return null;
    return rows.sort((a, b) => (a.id < b.id ? -1 : 1)).map(toLegacy);
  }

  findOrderById(id: string): LegacyOrder | null {
    if (!id) throw new LegacyDataError("order id required");
    const row = this.db.table<OrderRow>("orders").find((r) => r.id === id.trim());
    return row ? toLegacy(row) : null;
  }

  getUserTotal(userId: string): number {
    let total = 0;
    for (const row of this.db.table<OrderRow>("orders")) {
      if (row.user_id === userId) total += row.total_cents / 100;
    }
    return total;
  }
}
