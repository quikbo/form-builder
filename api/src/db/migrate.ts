import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { db, connection } from "./index";

async function runMigrations() {
  console.log("Running migrations...");

  await migrate(db, { migrationsFolder: "./drizzle" });

  console.log("Migrations completed successfully.");
}

runMigrations()
  .catch((e) => {
    console.error("Migration failed:");
    console.error(e);
  })
  .finally(() => {
    connection.close();
  });
