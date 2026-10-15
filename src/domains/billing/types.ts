export type PlanId = "free" | "pro" | "team";

export type Plan = {
  id: PlanId;
  name: string;
  monthlyPriceCents: number;
  features: string[];
};

export type Subscription = {
  userId: string;
  planId: PlanId;
  updatedAt: number;
};

export type Invoice = {
  id: string;
  userId: string;
  amountCents: number;
  description: string;
  createdAt: number;
};

export interface BillingProvider {
  listPlans(): Plan[];
  getSubscription(userId: string): Subscription | undefined;
  saveSubscription(subscription: Subscription): void;
  addInvoice(invoice: Invoice): void;
  listInvoices(userId: string): Invoice[];
}
