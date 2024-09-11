import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

const DATABASE_FILE = process.env.DB_FILE || "sqlite.db";

export const connection = new Database(DATABASE_FILE);

export const db = drizzle(connection, { schema });
