"use client";

import { useEffect, useState } from "react";
import type { CartItem, Order, Quote } from "@/domains/checkout/types";
import { api, formatCents } from "@/lib/client";

const SAMPLE_CART: CartItem[] = [
  { productId: "prod_notebook", quantity: 2 },
  { productId: "prod_pen", quantity: 1 },
];

export default function CheckoutPage() {
  const [discountCode, setDiscountCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<{ quote: Quote }>("/api/checkout", {
      method: "POST",
      body: JSON.stringify({ items: SAMPLE_CART, discountCode: appliedCode }),
    })
      .then((res) => {
        setQuote(res.quote);
        setError(null);
      })
      .catch((e: Error) => setError(e.message));
  }, [appliedCode]);

  async function placeOrder() {
    setError(null);
    try {
      const res = await api<{ order: Order }>("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ items: SAMPLE_CART, discountCode: appliedCode, place: true }),
      });
      setOrder(res.order);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (order) {
    return (
      <>
        <h1>Order placed</h1>
        <p>
          Order {order.id} for {formatCents(order.totalCents)}.
        </p>
      </>
    );
  }

  return (
    <>
      <h1>Checkout</h1>
      {quote && (
        <table>
          <tbody>
            {quote.lines.map((l) => (
              <tr key={l.productId}>
                <td>{l.name}</td>
                <td>x{l.quantity}</td>
                <td>{formatCents(l.lineTotalCents)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={2}>Subtotal</td>
              <td>{formatCents(quote.subtotalCents)}</td>
            </tr>
            <tr>
              <td colSpan={2}>Discount</td>
              <td>-{formatCents(quote.discountCents)}</td>
            </tr>
            <tr>
              <td colSpan={2}>Tax</td>
              <td>{formatCents(quote.taxCents)}</td>
            </tr>
            <tr>
              <th colSpan={2}>Total</th>
              <th>{formatCents(quote.totalCents)}</th>
            </tr>
          </tbody>
        </table>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setAppliedCode(discountCode);
        }}
      >
        <input
          aria-label="Discount code"
          placeholder="Discount code (try WORKSHOP10)"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
        />
        <button type="submit">Apply</button>
      </form>
      <button onClick={placeOrder} disabled={!quote}>
        Place order
      </button>
      {error && <p className="error">{error}</p>}
    </>
  );
}
