"use client";

import { useCallback, useEffect, useState } from "react";
import type { Invoice, Plan, Subscription } from "@/domains/billing/types";
import { api, formatCents } from "@/lib/client";

type BillingResponse = {
  plans: Plan[];
  subscription: Subscription | null;
  invoices: Invoice[];
};

export default function BillingPage() {
  const [data, setData] = useState<BillingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    api<BillingResponse>("/api/billing")
      .then(setData)
      .catch((e: Error) => setError(e.message));
  }, []);

  useEffect(load, [load]);

  async function changePlan(planId: string) {
    setError(null);
    try {
      await api("/api/billing", { method: "POST", body: JSON.stringify({ planId }) });
      load();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (!data) return <p className="muted">Loading…</p>;

  return (
    <>
      <h1>Billing</h1>
      {!data.subscription && <p className="muted">Log in to manage your plan.</p>}
      <ul className="list">
        {data.plans.map((plan) => {
          const current = data.subscription?.planId === plan.id;
          return (
            <li key={plan.id}>
              <strong>{plan.name}</strong> {formatCents(plan.monthlyPriceCents)} / month
              <div className="muted">{plan.features.join(", ")}</div>
              <button
                disabled={!data.subscription || current}
                onClick={() => changePlan(plan.id)}
              >
                {current ? "Current plan" : `Switch to ${plan.name}`}
              </button>
            </li>
          );
        })}
      </ul>
      {error && <p className="error">{error}</p>}
      <h2>Invoices</h2>
      {data.invoices.length === 0 ? (
        <p className="muted">No invoices.</p>
      ) : (
        <table>
          <tbody>
            {data.invoices.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.description}</td>
                <td>{formatCents(inv.amountCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
