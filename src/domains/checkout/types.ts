export type CartItem = {
  productId: string;
  quantity: number;
};

export type PricedProduct = {
  id: string;
  name: string;
  priceCents: number;
};

export type QuoteLine = {
  productId: string;
  name: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
};

export type Quote = {
  lines: QuoteLine[];
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  totalCents: number;
  discountCode: string | null;
};

export type Order = Quote & {
  id: string;
  userId: string;
  createdAt: number;
};

export interface CheckoutProvider {
  getProduct(id: string): PricedProduct | undefined;
  saveOrder(order: Order): void;
  listOrders(userId: string): Order[];
}
