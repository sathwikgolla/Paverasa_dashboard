import { buildDatabaseStatusPayload, jsonResponse } from "../../lib/api-utils";
import { checkDatabaseHealth } from "../../lib/db";
import { ensureDatabaseReady } from "../../lib/db-init";

export async function GET() {
  try {
    await ensureDatabaseReady();
    const health = await checkDatabaseHealth();

    return jsonResponse({
      success: health.online,
      ...buildDatabaseStatusPayload(health),
    });
  } catch (error) {
    const health = await checkDatabaseHealth();

    return jsonResponse(
      {
        success: false,
        ...buildDatabaseStatusPayload(health),
      },
      health.online ? 500 : 503,
    );
  }
}
