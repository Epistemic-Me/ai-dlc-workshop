import type { LlmProvider, LlmRequest, LlmResponse, Message } from "./types";

const STOP_WORDS = new Set(
  "a an and any are can do find for have i im is it looking me my of please sell show some the to want what with you your".split(" "),
);

function searchTerm(text: string): string {
  const words = text.toLowerCase().match(/[a-z][a-z-]*/g) ?? [];
  return words.find((w) => !STOP_WORDS.has(w) && w.length > 2) ?? "";
}

function money(dollars: unknown): string {
  return `$${dollars}`;
}

// Writes the answer from a tool result. Tool results are JSON from tools.ts.
function answerFromTool(message: Extract<Message, { role: "tool" }>): string {
  const data = JSON.parse(message.content);
  if (data.error === "login_required") return "Please log in first, then ask me again.";
  switch (message.name) {
    case "list_orders": {
      if (data.orders.length === 0) return "I don't see any orders on your account yet.";
      const lines = data.orders.map(
        (o: { orderId: string; total: unknown; created: string }) =>
          `${o.orderId} (${o.created.slice(0, 10)}): ${money(o.total)}`,
      );
      return `You have ${data.orders.length} order(s):\n${lines.join("\n")}`;
    }
    case "lookup_order":
      if (!data.order) return "I couldn't find that order on your account. Check the order ID and try again.";
      return `Order ${data.order.orderId} was placed on ${data.order.created.slice(0, 10)} for ${money(data.order.total)}. It has ${data.order.items.length} item(s).`;
    case "search_products": {
      if (data.products.length === 0) return "I couldn't find a product that matches. Try another word.";
      const names = data.products.map((p: { name: string; priceCents: number }) => `${p.name} ($${(p.priceCents / 100).toFixed(2)})`);
      return `Here is what I found: ${names.join(", ")}.`;
    }
    case "get_plan":
      return `You are on the ${data.planName} plan.`;
  }
}

/**
 * A deterministic stand-in for a model. It picks a tool from keywords in the
 * last user message, and writes the answer from the tool result. No network.
 */
export class MockLlmProvider implements LlmProvider {
  async complete({ messages }: LlmRequest): Promise<LlmResponse> {
    const last = messages[messages.length - 1];
    if (last?.role === "tool") return { type: "text", text: answerFromTool(last) };

    const text = last?.role === "user" ? last.content : "";
    const lower = text.toLowerCase();
    const orderId = /\border_[a-z0-9-]+/i.exec(text)?.[0];

    if (/\b(refund|cancel|complain|human|person)\b/.test(lower)) {
      return {
        type: "text",
        text: "I can't do that here. I've passed your message to the support team, and a person will follow up.",
      };
    }
    if (orderId) return { type: "tool_call", call: { name: "lookup_order", args: { orderId } } };
    if (/\b(order|orders|bought|purchase|purchases)\b/.test(lower)) {
      return { type: "tool_call", call: { name: "list_orders", args: {} } };
    }
    if (/\b(plan|billing|invoice|subscription)\b/.test(lower)) {
      return { type: "tool_call", call: { name: "get_plan", args: {} } };
    }
    const term = searchTerm(text);
    if (/\b(find|search|sell|have|looking)\b/.test(lower) && term) {
      return { type: "tool_call", call: { name: "search_products", args: { query: term } } };
    }
    return {
      type: "text",
      text: "I can help with your orders, finding products, and your plan. What do you need?",
    };
  }
}
