export type Row = Record<string, unknown>;

export class DatabaseError extends Error {}

// A tiny in-memory database: named tables of rows plus a schema version.
// Migrations in ./migrations create and change tables.
export class Database {
  schemaVersion = 0;
  private tables = new Map<string, Row[]>();

  hasTable(name: string): boolean {
    return this.tables.has(name);
  }

  createTable(name: string): void {
    if (this.tables.has(name)) throw new DatabaseError(`Table already exists: ${name}`);
    this.tables.set(name, []);
  }

  dropTable(name: string): void {
    if (!this.tables.delete(name)) throw new DatabaseError(`No such table: ${name}`);
  }

  table<T extends Row>(name: string): T[] {
    const rows = this.tables.get(name);
    if (!rows) throw new DatabaseError(`No such table: ${name}`);
    return rows as T[];
  }

  replaceRows<T extends Row>(name: string, rows: T[]): void {
    this.table(name);
    this.tables.set(name, rows);
  }
}
