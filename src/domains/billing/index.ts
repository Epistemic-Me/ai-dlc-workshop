import { singleton } from "../singleton";
import { InMemoryBillingProvider } from "./provider";
import { BillingService } from "./service";

export * from "./types";
export { BillingService, DEFAULT_PLAN_ID, type PlanChange } from "./service";
export { InMemoryBillingProvider, PLANS } from "./provider";

export const billingService = singleton("billing", () => new BillingService(new InMemoryBillingProvider()));
