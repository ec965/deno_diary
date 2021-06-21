import { Database, SQLite3Connector } from "denodb/mod.ts";

const connector = new SQLite3Connector({
  filepath: "./db.sqlite",
});

export const db = new Database(connector);
