import { db } from "@/db";
import { singleton } from "@/domains/singleton";
import { LegacyOrderDao } from "./order-dao";

export { LegacyOrderDao, LegacyDataError, type LegacyOrder, type LegacyOrderItem } from "./order-dao";

export const legacyOrders = singleton("legacy.orders", () => new LegacyOrderDao(db));
