import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryCheckoutProvider } from "./provider";
import { CheckoutService } from "./service";
import type { PricedProduct } from "./types";

const products: PricedProduct[] = [
  { id: "a", name: "Item A", priceCents: 1000 },
  { id: "b", name: "Item B", priceCents: 333 },
];

describe("CheckoutService", () => {
  let provider: InMemoryCheckoutProvider;
  let service: CheckoutService;

  beforeEach(() => {
    provider = new InMemoryCheckoutProvider((id) => products.find((p) => p.id === id));
    service = new CheckoutService(provider, { now: () => 42, createId: () => "order_1" });
  });

  it("computes subtotal, tax, and total without a discount", () => {
    const result = service.quote([
      { productId: "a", quantity: 2 },
      { productId: "b", quantity: 1 },
    ]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.subtotalCents).toBe(2333);
    expect(result.value.discountCents).toBe(0);
    expect(result.value.taxCents).toBe(187); // 186.64 rounds to 187
    expect(result.value.totalCents).toBe(2520);
  });

  it("applies the WORKSHOP10 code case-insensitively", () => {
    const result = service.quote([{ productId: "a", quantity: 1 }], " workshop10 ");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.discountCode).toBe("WORKSHOP10");
    expect(result.value.discountCents).toBe(100);
    expect(result.value.taxCents).toBe(72);
    expect(result.value.totalCents).toBe(972);
  });

  it("rejects an unknown discount code", () => {
    const result = service.quote([{ productId: "a", quantity: 1 }], "FREE");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("invalid_discount");
  });

  it("rejects inherited object names as discount codes", () => {
    const result = service.quote([{ productId: "a", quantity: 1 }], "constructor");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("invalid_discount");
  });

  it("rejects an unknown product", () => {
    const result = service.quote([{ productId: "zzz", quantity: 1 }]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("unknown_product");
  });

  it.each([0, -1, 1.5, 100])("rejects quantity %s", (quantity) => {
    const result = service.quote([{ productId: "a", quantity }]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("invalid_quantity");
  });

  it("rejects an empty cart", () => {
    const result = service.quote([]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("empty_cart");
  });

  it("rejects a cart with more than 50 lines", () => {
    const items = Array.from({ length: 51 }, () => ({ productId: "a", quantity: 1 }));
    const result = service.quote(items);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("too_many_lines");
  });

  it("stores a placed order for the user", () => {
    const result = service.placeOrder("user_1", [{ productId: "a", quantity: 1 }]);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toMatchObject({ id: "order_1", userId: "user_1", createdAt: 42 });
    expect(service.listOrders("user_1")).toHaveLength(1);
    expect(service.listOrders("user_2")).toHaveLength(0);
  });

  it("requires a user to place an order", () => {
    const result = service.placeOrder("", [{ productId: "a", quantity: 1 }]);
    expect(result.ok).toBe(false);
  });
});
