import { billingService, PLANS } from "@/domains/billing";
import { searchService } from "@/domains/search";
import { singleton } from "@/domains/singleton";
import { legacyOrders } from "@/legacy";
import { SupportAgent } from "./agent";
import { MockLlmProvider } from "./mock-llm";

export * from "./types";
export { SupportAgent, MAX_STEPS, MAX_MESSAGE_LENGTH, SYSTEM_PROMPT } from "./agent";
export { MockLlmProvider } from "./mock-llm";
export { runTool, TOOL_SPECS, type ToolDeps } from "./tools";

export const supportAgent = singleton(
  "support-agent",
  () =>
    new SupportAgent(new MockLlmProvider(), {
      orders: legacyOrders,
      searchProducts: (query) => searchService.search({ query }),
      planName: (userId) => {
        const planId = billingService.getSubscription(userId).planId;
        return PLANS.find((p) => p.id === planId)?.name ?? planId;
      },
    }),
);
