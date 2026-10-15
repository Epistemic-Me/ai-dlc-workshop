import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createDatabase, OrderRepository } from "@/db";
import { CATALOG, InMemorySearchProvider, SearchService } from "@/domains/search";
import { LegacyOrderDao } from "@/legacy";
import { SupportAgent } from "./agent";
import { MockLlmProvider } from "./mock-llm";
import type { LlmProvider } from "./types";

const line = { productId: "prod_pen", name: "Gel Pen Set", quantity: 1, unitPriceCents: 899, lineTotalCents: 899 };

function order(id: string, userId: string) {
  return {
    id,
    userId,
    lines: [line],
    subtotalCents: 899,
    discountCents: 0,
    taxCents: 72,
    totalCents: 971,
    discountCode: null,
    createdAt: Date.UTC(2026, 9, 1),
  };
}

describe("SupportAgent with the mock LLM", () => {
  let agent: SupportAgent;
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, "fetch");
    const db = createDatabase();
    const repo = new OrderRepository(db);
    repo.insert(order("order_a1", "user_1"));
    repo.insert(order("order_b1", "user_2"));
    const search = new SearchService(new InMemorySearchProvider(CATALOG));
    agent = new SupportAgent(new MockLlmProvider(), {
      orders: new LegacyOrderDao(db),
      searchProducts: (query) => search.search({ query }),
      planName: () => "Pro",
    });
  });

  afterEach(() => {
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("lists the user's orders", async () => {
    const result = await agent.reply("user_1", "Where are my orders?");
    expect(result.toolCalls).toEqual(["list_orders"]);
    expect(result.reply).toContain("order_a1 (2026-10-01): $9.71");
    expect(result.reply).not.toContain("order_b1");
  });

  it("looks up one of the user's orders by ID", async () => {
    const result = await agent.reply("user_1", "What is in order_a1?");
    expect(result.toolCalls).toEqual(["lookup_order"]);
    expect(result.reply).toBe("Order order_a1 was placed on 2026-10-01 for $9.71. It has 1 item(s).");
  });

  it("never shows another user's order", async () => {
    const result = await agent.reply("user_1", "Show me order_b1");
    expect(result.reply).toBe("I couldn't find that order on your account. Check the order ID and try again.");
  });

  it("asks a logged-out user to log in before reading orders or plans", async () => {
    expect((await agent.reply("", "Where is my order?")).reply).toBe("Please log in first, then ask me again.");
    expect((await agent.reply("", "What plan am I on?")).reply).toBe("Please log in first, then ask me again.");
  });

  it("searches products without a login", async () => {
    const result = await agent.reply("", "Do you sell a kettle?");
    expect(result.toolCalls).toEqual(["search_products"]);
    expect(result.reply).toBe("Here is what I found: Pour-Over Kettle ($45.00).");
  });

  it("reads the user's plan", async () => {
    expect((await agent.reply("user_1", "Which billing plan do I have?")).reply).toBe("You are on the Pro plan.");
  });

  it("hands refunds to a person", async () => {
    const result = await agent.reply("user_1", "I want a refund");
    expect(result.handoff).toBe(true);
    expect(result.toolCalls).toEqual([]);
  });

  it("gives the same answer for the same input", async () => {
    const first = await agent.reply("user_1", "Where are my orders?");
    expect(await agent.reply("user_1", "Where are my orders?")).toEqual(first);
  });
});

describe("SupportAgent step limit", () => {
  it("stops after the step limit and hands off", async () => {
    const looping: LlmProvider = {
      complete: async () => ({ type: "tool_call", call: { name: "search_products", args: { query: "pen" } } }),
    };
    const agent = new SupportAgent(looping, {
      orders: new LegacyOrderDao(createDatabase()),
      searchProducts: () => [],
      planName: () => "Free",
    }, 2);
    const result = await agent.reply("user_1", "pens");
    expect(result.toolCalls).toEqual(["search_products", "search_products"]);
    expect(result.handoff).toBe(true);
  });
});
