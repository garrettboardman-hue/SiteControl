import { db, sqlite } from "./connection";
import * as schema from "./schema";
import { migrate as drizzleMigrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "path";

const migrationsPath = path.resolve(import.meta.dirname, "./migrations");
console.log(`Running migrations from ${migrationsPath}...`);

try {
  drizzleMigrate(db, { migrationsFolder: migrationsPath });
  console.log("Migrations complete.");
} catch (e) {
  console.error("Migration error:", e);
  process.exit(1);
}