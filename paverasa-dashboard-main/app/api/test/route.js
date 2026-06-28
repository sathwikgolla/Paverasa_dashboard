import { buildDatabaseStatusPayload, jsonResponse } from "../../lib/api-utils";
import { checkDatabaseHealth } from "../../lib/db";

export async function GET() {
  try {
    const health = await checkDatabaseHealth();

    return jsonResponse({
      success: health.online,
      data: [{ test: 1 }],
      ...buildDatabaseStatusPayload(health),
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        error: error.message,
        ...buildDatabaseStatusPayload({
          online: false,
          error: error.message,
          code: error.code,
        }),
      },
      503,
    );
  }
}
