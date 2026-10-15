import { describe, expect, it } from "vitest";
import { createDatabase, migrate } from "./migrations";
import { OrderRepository, type OrderRecord } from "./order-repository";

function order(id: string, userId: string, createdAt: number, totalCents = 1000): OrderRecord {
  return {
    id,
    userId,
    lines: [{ productId: "a", name: "Item A", quantity: 1, unitPriceCents: 1000, lineTotalCents: 1000 }],
    subtotalCents: 1000,
    discountCents: 0,
    taxCents: 0,
    totalCents,
    discountCode: null,
    createdAt,
  };
}

describe("migrations", () => {
  it("creates the orders table and rolls it back", () => {
    const db = createDatabase();
    expect(db.schemaVersion).toBe(1);
    expect(db.hasTable("orders")).toBe(true);
    migrate(db, 0);
    expect(db.schemaVersion).toBe(0);
    expect(db.hasTable("orders")).toBe(false);
  });

  it("rejects an unknown version", () => {
    expect(() => migrate(createDatabase(), 99)).toThrow("Unknown schema version");
  });
});

describe("OrderRepository", () => {
  it("round-trips an order", () => {
    const repo = new OrderRepository(createDatabase());
    repo.insert(order("order_1", "user_1", 10));
    expect(repo.findById("order_1")).toEqual(order("order_1", "user_1", 10));
    expect(repo.findById("missing")).toBeUndefined();
  });

  it("lists a user's orders newest first and only that user's", () => {
    const repo = new OrderRepository(createDatabase());
    repo.insert(order("order_1", "user_1", 10));
    repo.insert(order("order_2", "user_2", 20));
    repo.insert(order("order_3", "user_1", 30));
    expect(repo.listByUser("user_1").map((o) => o.id)).toEqual(["order_3", "order_1"]);
    expect(repo.listByUser("nobody")).toEqual([]);
  });

  it("sums a user's totals in cents", () => {
    const repo = new OrderRepository(createDatabase());
    repo.insert(order("order_1", "user_1", 10, 1099));
    repo.insert(order("order_2", "user_1", 20, 2300));
    expect(repo.totalCentsByUser("user_1")).toBe(3399);
    expect(repo.totalCentsByUser("nobody")).toBe(0);
  });

  it("rejects a duplicate id", () => {
    const repo = new OrderRepository(createDatabase());
    repo.insert(order("order_1", "user_1", 10));
    expect(() => repo.insert(order("order_1", "user_1", 11))).toThrow("Duplicate order id");
  });
});

// FLAKY-05: this test uses the real clock. Two inserts in the same millisecond
// tie on created_at, and the expected order breaks. Skipped unless RUN_FLAKY=1.
describe.skipIf(!process.env.RUN_FLAKY)("OrderRepository with the real clock", () => {
  it("lists the most recent order first", async () => {
    const repo = new OrderRepository(createDatabase());
    repo.insert(order("order_first", "user_1", Date.now()));
    await (Math.random() < 0.5 ? Promise.resolve() : new Promise((r) => setTimeout(r, 2)));
    repo.insert(order("order_second", "user_1", Date.now()));
    expect(repo.listByUser("user_1").map((o) => o.id)).toEqual(["order_second", "order_first"]);
  });
});
