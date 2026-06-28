import { createDatabaseConnection, runMigrations } from "./db-utils.mjs";

async function main() {
  const connection = await createDatabaseConnection();

  try {
    await runMigrations(connection);
    console.log("Database migrations completed successfully.");
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error("Database migration failed:");
  console.error(error.sqlMessage || error.message || error.code || error);
  process.exitCode = 1;
});
