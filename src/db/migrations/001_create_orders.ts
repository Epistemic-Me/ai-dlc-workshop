import type { Migration } from "./types";

export const createOrders: Migration = {
  version: 1,
  name: "create_orders",
  up(db) {
    db.createTable("orders");
  },
  down(db) {
    db.dropTable("orders");
  },
};
