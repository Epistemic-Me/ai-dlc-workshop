import { describe, expect, it } from "vitest";
import { POST } from "./route";

function post(body: unknown, token?: string) {
  return POST(
    new Request("http://localhost/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body),
    }),
  );
}

describe("POST /api/support", () => {
  it("answers a product question without a login", async () => {
    const res = await post({ message: "Do you have a mug?" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      reply: "Here is what I found: Ceramic Mug ($15.00).",
      toolCalls: ["search_products"],
      handoff: false,
    });
  });

  it.each([{}, { message: "" }, { message: 42 }, { message: "x".repeat(501) }])(
    "rejects %j",
    async (body) => {
      const res = await post(body);
      expect(res.status).toBe(400);
      expect((await res.json()).error.code).toBe("invalid_input");
    },
  );
});
