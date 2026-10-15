import { describe, expect, it } from "vitest";
import { POST } from "./route";

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

async function errorCode(body: unknown) {
  const res = await post(body);
  return { status: res.status, code: (await res.json()).error?.code };
}

describe("POST /api/checkout", () => {
  it("returns a quote for a valid cart", async () => {
    const res = await post({ items: [{ productId: "prod_pen", quantity: 2 }] });
    expect(res.status).toBe(200);
    expect((await res.json()).quote.subtotalCents).toBe(1798);
  });

  it("rejects a null item instead of throwing", async () => {
    expect(await errorCode({ items: [null] })).toEqual({ status: 400, code: "invalid_quantity" });
  });

  it.each([true, "2", [3]])("rejects quantity %j that is not a number", async (quantity) => {
    expect(await errorCode({ items: [{ productId: "prod_pen", quantity }] })).toEqual({
      status: 400,
      code: "invalid_quantity",
    });
  });

  it("rejects a discount code that is not text", async () => {
    expect(
      await errorCode({ items: [{ productId: "prod_pen", quantity: 1 }], discountCode: 123 }),
    ).toEqual({ status: 400, code: "invalid_discount" });
  });

  it("requires a session to place an order", async () => {
    expect(
      await errorCode({ items: [{ productId: "prod_pen", quantity: 1 }], place: true }),
    ).toEqual({ status: 401, code: "unauthenticated" });
  });
});
