import type { Database } from "../database";

export type Migration = {
  version: number;
  name: string;
  up(db: Database): void;
  down(db: Database): void;
};
