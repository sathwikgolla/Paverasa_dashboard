import { readFileSync, existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnvFile() {
  for (const file of [".env.local", ".env"]) {
    const path = join(process.cwd(), file);

    if (!existsSync(path)) {
      continue;
    }

    for (const line of readFileSync(path, "utf8").split("\n")) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmed.indexOf("=");

      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim();

      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  }
}

loadEnvFile();

export const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME || "paverasa_finance",
  multipleStatements: true,
};

export async function createDatabaseIfMissing() {
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
  await connection.end();
}

export async function createDatabaseConnection() {
  await createDatabaseIfMissing();

  return mysql.createConnection(dbConfig);
}

export async function runMigrations(connection) {
  const migrationsDir = join(__dirname, "migrations");
  const files = (await readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const migrationSql = await readFile(join(migrationsDir, file), "utf8");
    await connection.query(migrationSql);
  }
}
