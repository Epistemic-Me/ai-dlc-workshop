import { fail, ok, type Result } from "../errors";
import type { BillingProvider, Invoice, Plan, Subscription } from "./types";

export const DEFAULT_PLAN_ID = "free";

type Options = {
  now?: () => number;
  createId?: () => string;
};

export type PlanChange = {
  subscription: Subscription;
  invoice: Invoice | null;
};

export class BillingService {
  private now: () => number;
  private createId: () => string;

  constructor(
    private provider: BillingProvider,
    options: Options = {},
  ) {
    this.now = options.now ?? Date.now;
    this.createId = options.createId ?? (() => `inv_${crypto.randomUUID()}`);
  }

  listPlans(): Plan[] {
    return this.provider.listPlans();
  }

  getSubscription(userId: string): Subscription {
    return (
      this.provider.getSubscription(userId) ?? {
        userId,
        planId: DEFAULT_PLAN_ID,
        updatedAt: 0,
      }
    );
  }

  changePlan(userId: string, planId: string): Result<PlanChange> {
    if (!userId) {
      return fail("unauthenticated", "Log in to change plans.");
    }
    const plans = this.provider.listPlans();
    const next = plans.find((p) => p.id === planId);
    if (!next) {
      return fail("unknown_plan", `Unknown plan: ${planId}`);
    }
    const current = this.getSubscription(userId);
    if (current.planId === next.id) {
      return fail("same_plan", `Already on the ${next.name} plan.`);
    }
    const currentPlan = plans.find((p) => p.id === current.planId);
    const difference = next.monthlyPriceCents - (currentPlan?.monthlyPriceCents ?? 0);

    const subscription: Subscription = { userId, planId: next.id, updatedAt: this.now() };
    this.provider.saveSubscription(subscription);

    let invoice: Invoice | null = null;
    if (difference > 0) {
      invoice = {
        id: this.createId(),
        userId,
        amountCents: difference,
        description: `Upgrade to ${next.name}`,
        createdAt: this.now(),
      };
      this.provider.addInvoice(invoice);
    }

    return ok({ subscription, invoice });
  }

  listInvoices(userId: string): Invoice[] {
    return this.provider.listInvoices(userId);
  }
}
