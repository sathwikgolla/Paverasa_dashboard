import mysql from "mysql2/promise";

export function getDbConfig() {
  return {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME || "paverasa_finance",
  };
}

const pool = mysql.createPool({
  ...getDbConfig(),
  waitForConnections: true,
  connectionLimit: 10,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  multipleStatements: true,
});

function inferOperation(sql) {
  const normalized = String(sql).trim().split(/\s+/)[0]?.toUpperCase() || "QUERY";

  return normalized;
}

export function logDbEvent(level, message, details = {}) {
  const timestamp = new Date().toISOString();
  const payload = Object.keys(details).length ? ` ${JSON.stringify(details)}` : "";

  if (level === "error") {
    console.error(`[db ${timestamp}] ${message}${payload}`);
    return;
  }

  console.log(`[db ${timestamp}] ${message}${payload}`);
}

export function formatDatabaseError(error) {
  if (!error) {
    return "Unknown database error.";
  }

  if (error.code === "ECONNREFUSED") {
    const config = getDbConfig();
    return `connect ECONNREFUSED ${config.host}:${config.port}`;
  }

  const parts = [
    error.code,
    error.sqlMessage,
    error.message,
  ].filter(Boolean);

  return [...new Set(parts)].join(" — ") || "Unknown database error.";
}

const poolQuery = pool.query.bind(pool);

export async function query(sql, params = [], operation) {
  const op = operation || inferOperation(sql);

  logDbEvent("info", `Executing ${op}`, {
    sql: String(sql).trim().replace(/\s+/g, " ").slice(0, 160),
  });

  try {
    const result = await poolQuery(sql, params);
    logDbEvent("info", `${op} succeeded`);
    return result;
  } catch (error) {
    logDbEvent("error", `${op} failed`, {
      code: error.code,
      message: formatDatabaseError(error),
    });
    throw error;
  }
}

export async function checkDatabaseHealth() {
  try {
    await poolQuery("SELECT 1 AS health_check");
    logDbEvent("info", "Connection health check passed");
    return {
      online: true,
      error: null,
      code: null,
    };
  } catch (error) {
    const formattedError = formatDatabaseError(error);
    logDbEvent("error", "Connection health check failed", {
      code: error.code,
      message: formattedError,
    });

    return {
      online: false,
      error: formattedError,
      code: error.code || null,
    };
  }
}

const db = {
  query,
};

export default db;
