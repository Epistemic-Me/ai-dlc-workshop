import { searchService } from "@/domains/search";
import { singleton } from "../singleton";
import { InMemoryCheckoutProvider } from "./provider";
import { CheckoutService } from "./service";

export * from "./types";
export { CheckoutService, TAX_RATE, DISCOUNT_CODES, MAX_QUANTITY } from "./service";
export { InMemoryCheckoutProvider, type ProductLookup } from "./provider";

// Checkout reads prices through the search domain's public API only.
export const checkoutService = singleton(
  "checkout",
  () => new CheckoutService(new InMemoryCheckoutProvider((id) => searchService.getProduct(id))),
);
