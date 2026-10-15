import type { Database } from "./database";
import type { OrderLine, OrderRow } from "./schema";

export type OrderRecord = {
  id: string;
  userId: string;
  lines: OrderLine[];
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  totalCents: number;
  discountCode: string | null;
  createdAt: number;
};

function toRow(order: OrderRecord): OrderRow {
  return {
    id: order.id,
    user_id: order.userId,
    subtotal_cents: order.subtotalCents,
    discount_cents: order.discountCents,
    tax_cents: order.taxCents,
    total_cents: order.totalCents,
    discount_code: order.discountCode,
    lines_json: JSON.stringify(order.lines),
    created_at: order.createdAt,
  };
}

function toRecord(row: OrderRow): OrderRecord {
  return {
    id: row.id,
    userId: row.user_id,
    lines: JSON.parse(row.lines_json) as OrderLine[],
    subtotalCents: row.subtotal_cents,
    discountCents: row.discount_cents,
    taxCents: row.tax_cents,
    totalCents: row.total_cents,
    discountCode: row.discount_code,
    createdAt: row.created_at,
  };
}

// The new order data-access layer. Replaces src/legacy/order-dao.ts.
export class OrderRepository {
  constructor(private db: Database) {}

  private rows(): OrderRow[] {
    return this.db.table<OrderRow>("orders");
  }

  insert(order: OrderRecord): void {
    if (this.rows().some((r) => r.id === order.id)) {
      throw new Error(`Duplicate order id: ${order.id}`);
    }
    this.rows().push(toRow(order));
  }

  findById(id: string): OrderRecord | undefined {
    const row = this.rows().find((r) => r.id === id);
    return row ? toRecord(row) : undefined;
  }

  // Newest first. Empty list when the user has no orders.
  listByUser(userId: string): OrderRecord[] {
    return this.rows()
      .filter((r) => r.user_id === userId)
      .sort((a, b) => b.created_at - a.created_at)
      .map(toRecord);
  }

  totalCentsByUser(userId: string): number {
    return this.rows()
      .filter((r) => r.user_id === userId)
      .reduce((sum, r) => sum + r.total_cents, 0);
  }
}
