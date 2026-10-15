import { Database, DatabaseError } from "../database";
import { createOrders } from "./001_create_orders";
import type { Migration } from "./types";

export type { Migration } from "./types";

// Keep in version order. Add new migrations at the end.
export const MIGRATIONS: Migration[] = [createOrders];

export const LATEST_VERSION = MIGRATIONS.length;

// Moves the schema up or down, one migration at a time, to the target version.
export function migrate(db: Database, target: number = LATEST_VERSION): void {
  if (!Number.isInteger(target) || target < 0 || target > LATEST_VERSION) {
    throw new DatabaseError(`Unknown schema version: ${target}`);
  }
  while (db.schemaVersion < target) {
    MIGRATIONS[db.schemaVersion].up(db);
    db.schemaVersion += 1;
  }
  while (db.schemaVersion > target) {
    MIGRATIONS[db.schemaVersion - 1].down(db);
    db.schemaVersion -= 1;
  }
}

export function createDatabase(): Database {
  const db = new Database();
  migrate(db);
  return db;
}
