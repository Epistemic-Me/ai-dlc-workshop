import { describe, expect, it } from "vitest";
import { createDatabase, OrderRepository } from "@/db";
import { LegacyOrderDao } from "./order-dao";

describe("LegacyOrderDao", () => {
  it("returns a user's orders", () => {
    const db = createDatabase();
    new OrderRepository(db).insert({
      id: "order_1",
      userId: "user_1",
      lines: [{ productId: "a", name: "Item A", quantity: 2, unitPriceCents: 500, lineTotalCents: 1000 }],
      subtotalCents: 1000,
      discountCents: 0,
      taxCents: 80,
      totalCents: 1080,
      discountCode: null,
      createdAt: 0,
    });
    const orders = new LegacyOrderDao(db).findOrdersByUser("user_1");
    expect(orders?.[0].orderId).toBe("order_1");
    expect(orders?.[0].total).toBe(10.8);
  });
});
