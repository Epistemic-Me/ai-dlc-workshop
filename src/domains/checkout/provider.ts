import type { CheckoutProvider, Order, PricedProduct } from "./types";

export type ProductLookup = (id: string) => PricedProduct | undefined;

export class InMemoryCheckoutProvider implements CheckoutProvider {
  private orders: Order[] = [];

  constructor(private lookup: ProductLookup) {}

  getProduct(id: string): PricedProduct | undefined {
    return this.lookup(id);
  }

  saveOrder(order: Order): void {
    this.orders.push(order);
  }

  listOrders(userId: string): Order[] {
    return this.orders.filter((o) => o.userId === userId);
  }
}
