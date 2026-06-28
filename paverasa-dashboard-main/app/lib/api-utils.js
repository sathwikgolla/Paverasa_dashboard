export function jsonResponse(payload, status = 200) {
  return Response.json(payload, { status });
}

export const databaseOfflineMessage =
  "Database connection is offline. Start MySQL on localhost:3306 or set DB_HOST and DB_PORT.";

export function isDatabaseConnectionError(error) {
  const connectionCodes = new Set([
    "ECONNREFUSED",
    "ENOTFOUND",
    "EHOSTUNREACH",
    "ETIMEDOUT",
    "ECONNRESET",
    "PROTOCOL_CONNECTION_LOST",
    "ER_ACCESS_DENIED_ERROR",
    "ER_BAD_DB_ERROR",
    "ER_CON_COUNT_ERROR",
    "ER_NO_SUCH_TABLE",
  ]);

  if (connectionCodes.has(error?.code)) {
    return true;
  }

  return Boolean(
    error?.errors?.some?.((innerError) => connectionCodes.has(innerError.code)),
  );
}

export function formatDatabaseErrorResponse(error) {
  return {
    databaseOffline: true,
    databaseConnected: false,
    warning: databaseOfflineMessage,
    databaseError: error?.sqlMessage || error?.message || String(error),
    code: error?.code || null,
  };
}

export function handleApiError(error) {
  console.error("[api] Request failed:", error?.sqlMessage || error?.message || error);

  if (isDatabaseConnectionError(error)) {
    return jsonResponse(
      {
        error: databaseOfflineMessage,
        ...formatDatabaseErrorResponse(error),
      },
      503,
    );
  }

  return jsonResponse(
    {
      error: "Something went wrong while processing the request.",
      details: error.sqlMessage || error.message,
      databaseConnected: true,
      databaseOffline: false,
    },
    500,
  );
}

export function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value || "", 10);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function normalizeSortDirection(value) {
  return String(value).toLowerCase() === "asc" ? "ASC" : "DESC";
}

export function isValidId(id) {
  const parsed = Number.parseInt(id, 10);

  return Number.isInteger(parsed) && parsed > 0;
}

export function buildDatabaseStatusPayload(health) {
  if (health.online) {
    return {
      databaseConnected: true,
      databaseOffline: false,
      databaseError: null,
    };
  }

  return {
    databaseConnected: false,
    databaseOffline: true,
    warning: databaseOfflineMessage,
    databaseError: health.error,
    code: health.code,
  };
}
