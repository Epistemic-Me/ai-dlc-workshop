import type { LegacyOrderDao } from "@/legacy";
import type { ToolCall, ToolName, ToolSpec } from "./types";

export type ToolDeps = {
  orders: LegacyOrderDao;
  searchProducts: (query: string) => { id: string; name: string; priceCents: number }[];
  planName: (userId: string) => string;
};

export const TOOL_SPECS: ToolSpec[] = [
  { name: "list_orders", description: "List the logged-in user's orders." },
  { name: "lookup_order", description: "Look up one of the logged-in user's orders by ID. Args: orderId." },
  { name: "search_products", description: "Search the product catalog. Args: query." },
  { name: "get_plan", description: "Get the logged-in user's billing plan." },
];

const NEEDS_LOGIN: ToolName[] = ["list_orders", "lookup_order", "get_plan"];

// Runs a tool for one user and returns its result as JSON text.
export function runTool(deps: ToolDeps, userId: string, call: ToolCall): string {
  if (NEEDS_LOGIN.includes(call.name) && !userId) {
    return JSON.stringify({ error: "login_required" });
  }
  switch (call.name) {
    case "list_orders":
      return JSON.stringify({ orders: deps.orders.findOrdersByUser(userId) ?? [] });
    case "lookup_order": {
      const id = call.args.orderId ?? "";
      const order = id ? deps.orders.findOrderById(id) : null;
      // Never show another user's order.
      return JSON.stringify({ order: order && order.customer === userId ? order : null });
    }
    case "search_products":
      return JSON.stringify({ products: deps.searchProducts(call.args.query ?? "").slice(0, 3) });
    case "get_plan":
      return JSON.stringify({ planName: deps.planName(userId) });
  }
}
