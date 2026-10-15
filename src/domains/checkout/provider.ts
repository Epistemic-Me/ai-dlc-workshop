import { createDatabase, OrderRepository } from "@/db";
import type { CheckoutProvider, Order, PricedProduct } from "./types";

export type ProductLookup = (id: string) => PricedProduct | undefined;

export class InMemoryCheckoutProvider implements CheckoutProvider {
  constructor(
    private lookup: ProductLookup,
    private orders: OrderRepository = new OrderRepository(createDatabase()),
  ) {}

  getProduct(id: string): PricedProduct | undefined {
    return this.lookup(id);
  }

  saveOrder(order: Order): void {
    this.orders.insert(order);
  }

  listOrders(userId: string): Order[] {
    return this.orders.listByUser(userId);
  }
}
