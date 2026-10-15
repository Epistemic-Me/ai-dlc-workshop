import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryBillingProvider } from "./provider";
import { BillingService } from "./service";

describe("BillingService", () => {
  let service: BillingService;

  beforeEach(() => {
    let n = 0;
    service = new BillingService(new InMemoryBillingProvider(), {
      now: () => 7,
      createId: () => `inv_${++n}`,
    });
  });

  it("lists plans", () => {
    expect(service.listPlans().map((p) => p.id)).toEqual(["free", "pro", "team"]);
  });

  it("puts new users on the free plan", () => {
    expect(service.getSubscription("user_1").planId).toBe("free");
  });

  it("creates an invoice for the price difference on upgrade", () => {
    service.changePlan("user_1", "pro");
    const result = service.changePlan("user_1", "team");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.subscription.planId).toBe("team");
    expect(result.value.invoice).toMatchObject({ id: "inv_2", amountCents: 3000 });
    expect(service.listInvoices("user_1").map((i) => i.amountCents)).toEqual([1900, 3000]);
  });

  it("creates no invoice on downgrade", () => {
    service.changePlan("user_1", "team");
    const result = service.changePlan("user_1", "free");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.invoice).toBeNull();
    expect(service.listInvoices("user_1")).toHaveLength(1);
  });

  it("rejects a change to the current plan", () => {
    const result = service.changePlan("user_1", "free");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("same_plan");
  });

  it("rejects an unknown plan", () => {
    const result = service.changePlan("user_1", "enterprise");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("unknown_plan");
  });

  it("requires a user", () => {
    expect(service.changePlan("", "pro").ok).toBe(false);
  });
});
