import type { BillingProvider, Invoice, Plan, Subscription } from "./types";

export const PLANS: Plan[] = [
  { id: "free", name: "Free", monthlyPriceCents: 0, features: ["1 project", "Community support"] },
  { id: "pro", name: "Pro", monthlyPriceCents: 1900, features: ["10 projects", "Email support"] },
  {
    id: "team",
    name: "Team",
    monthlyPriceCents: 4900,
    features: ["Unlimited projects", "Shared workspaces", "Priority support"],
  },
];

export class InMemoryBillingProvider implements BillingProvider {
  private subscriptions = new Map<string, Subscription>();
  private invoices: Invoice[] = [];

  constructor(private plans: Plan[] = PLANS) {}

  listPlans(): Plan[] {
    return [...this.plans];
  }

  getSubscription(userId: string): Subscription | undefined {
    return this.subscriptions.get(userId);
  }

  saveSubscription(subscription: Subscription): void {
    this.subscriptions.set(subscription.userId, subscription);
  }

  addInvoice(invoice: Invoice): void {
    this.invoices.push(invoice);
  }

  listInvoices(userId: string): Invoice[] {
    return this.invoices.filter((i) => i.userId === userId);
  }
}
