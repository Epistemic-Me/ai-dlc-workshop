import { singleton } from "@/domains/singleton";
import { createDatabase } from "./migrations";
import { OrderRepository } from "./order-repository";

export { Database, DatabaseError, type Row } from "./database";
export type { OrderLine, OrderRow } from "./schema";
export { createDatabase, migrate, MIGRATIONS, LATEST_VERSION, type Migration } from "./migrations";
export { OrderRepository, type OrderRecord } from "./order-repository";

export const db = singleton("db", createDatabase);
export const orderRepository = singleton("db.orders", () => new OrderRepository(db));
