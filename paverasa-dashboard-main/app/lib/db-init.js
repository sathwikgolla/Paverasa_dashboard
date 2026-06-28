import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import mysql from "mysql2/promise";
import {
  checkDatabaseHealth,
  formatDatabaseError,
  getDbConfig,
  logDbEvent,
  query,
} from "./db";

const REVENUE_SEED_RECORDS = [
  {
    date: "2026-06-03",
    client_name: "ABC Technologies",
    service_name: "Website Development",
    department: "Digital Solutions",
    amount: 85000,
    payment_mode: "Bank Transfer",
    payment_status: "Paid",
    invoice_number: "INV-2026-001",
    notes: "Corporate website redesign and launch support.",
  },
  {
    date: "2026-06-10",
    client_name: "XYZ Solutions",
    service_name: "Mobile App",
    department: "Product Engineering",
    amount: 120000,
    payment_mode: "UPI",
    payment_status: "Paid",
    invoice_number: "INV-2026-002",
    notes: "Milestone payment for Android and iOS app delivery.",
  },
  {
    date: "2026-06-18",
    client_name: "TechNova",
    service_name: "ERP Consultation",
    department: "Business Consulting",
    amount: 65000,
    payment_mode: "Cheque",
    payment_status: "Pending",
    invoice_number: "INV-2026-003",
    notes: "Finance workflow assessment and implementation planning.",
  },
];

let initializationPromise = null;

async function createDatabaseIfMissing() {
  const config = getDbConfig();
  let connection;

  try {
    connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.database}\``,
    );
    logDbEvent("info", `Verified database exists: ${config.database}`);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function runMigrations() {
  const migrationsDir = join(process.cwd(), "database", "migrations");
  const files = (await readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const migrationSql = await readFile(join(migrationsDir, file), "utf8");
    await query(migrationSql, [], `MIGRATE ${file}`);
    logDbEvent("info", `Applied migration: ${file}`);
  }
}

async function seedRevenueIfEmpty() {
  const [[countRow]] = await query(
    "SELECT COUNT(*) AS total FROM revenue",
    [],
    "READ revenue count",
  );

  if (Number(countRow.total) > 0) {
    logDbEvent("info", "Revenue table already has records; skipping seed");
    return;
  }

  for (const record of REVENUE_SEED_RECORDS) {
    await query(
      `
        INSERT INTO revenue (
          date,
          client_name,
          service_name,
          department,
          amount,
          payment_mode,
          payment_status,
          invoice_number,
          notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        record.date,
        record.client_name,
        record.service_name,
        record.department,
        record.amount,
        record.payment_mode,
        record.payment_status,
        record.invoice_number,
        record.notes,
      ],
      "CREATE revenue seed",
    );
  }

  logDbEvent("info", `Inserted ${REVENUE_SEED_RECORDS.length} revenue seed records`);
}

async function initializeDatabase() {
  try {
    await createDatabaseIfMissing();
    await runMigrations();
    await seedRevenueIfEmpty();

    const health = await checkDatabaseHealth();

    if (!health.online) {
      throw Object.assign(new Error(health.error), { code: health.code });
    }

    logDbEvent("info", "Database initialization completed");
    return health;
  } catch (error) {
    logDbEvent("error", "Database initialization failed", {
      message: formatDatabaseError(error),
      code: error.code,
    });
    throw error;
  }
}

export async function ensureDatabaseReady() {
  if (!initializationPromise) {
    initializationPromise = initializeDatabase().catch((error) => {
      initializationPromise = null;
      throw error;
    });
  }

  return initializationPromise;
}
