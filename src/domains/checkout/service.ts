import { fail, ok, type Result } from "../errors";
import type { CartItem, CheckoutProvider, Order, Quote, QuoteLine } from "./types";

export const TAX_RATE = 0.08;
export const DISCOUNT_CODES: Record<string, number> = { WORKSHOP10: 0.1 };
export const MAX_QUANTITY = 99;

type Options = {
  now?: () => number;
  createId?: () => string;
};

export class CheckoutService {
  private now: () => number;
  private createId: () => string;

  constructor(
    private provider: CheckoutProvider,
    options: Options = {},
  ) {
    this.now = options.now ?? Date.now;
    this.createId = options.createId ?? (() => `order_${crypto.randomUUID()}`);
  }

  quote(items: CartItem[], discountCode?: string): Result<Quote> {
    if (items.length === 0) {
      return fail("empty_cart", "Cart is empty.");
    }

    const lines: QuoteLine[] = [];
    for (const item of items) {
      if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_QUANTITY) {
        return fail("invalid_quantity", `Quantity must be a whole number from 1 to ${MAX_QUANTITY}.`);
      }
      const product = this.provider.getProduct(item.productId);
      if (!product) {
        return fail("unknown_product", `Unknown product: ${item.productId}`);
      }
      lines.push({
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        unitPriceCents: product.priceCents,
        lineTotalCents: product.priceCents * item.quantity,
      });
    }

    const code = discountCode?.trim().toUpperCase() || null;
    let rate = 0;
    if (code) {
      if (!Object.hasOwn(DISCOUNT_CODES, code)) {
        return fail("invalid_discount", `Unknown discount code: ${code}`);
      }
      rate = DISCOUNT_CODES[code];
    }

    const subtotalCents = lines.reduce((sum, l) => sum + l.lineTotalCents, 0);
    const discountCents = Math.round(subtotalCents * rate);
    const taxCents = Math.round((subtotalCents - discountCents) * TAX_RATE);
    const totalCents = subtotalCents - discountCents + taxCents;

    return ok({ lines, subtotalCents, discountCents, taxCents, totalCents, discountCode: code });
  }

  placeOrder(userId: string, items: CartItem[], discountCode?: string): Result<Order> {
    if (!userId) {
      return fail("unauthenticated", "Log in to place an order.");
    }
    const quote = this.quote(items, discountCode);
    if (!quote.ok) return quote;
    const order: Order = { ...quote.value, id: this.createId(), userId, createdAt: this.now() };
    this.provider.saveOrder(order);
    return ok(order);
  }

  listOrders(userId: string): Order[] {
    return this.provider.listOrders(userId);
  }
}
