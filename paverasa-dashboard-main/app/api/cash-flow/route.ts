import {
  databaseOfflineMessage,
  handleApiError,
  isDatabaseConnectionError,
  jsonResponse,
} from "../../lib/api-utils";

import { authorizeRequest } from "../../lib/auth";
import { ensureDatabaseReady } from "../../lib/db-init";
import { PERMISSIONS } from "../../lib/roles";

import { getCashFlowSummary } from "../../lib/finance";

export async function GET(request: Request) {
  const auth = await authorizeRequest(PERMISSIONS.VIEW_EXPENSES);

  if (auth.error) {
    return auth.error;
  }

  try {
    await ensureDatabaseReady();

    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get("range") || "30d";

    const summary = await getCashFlowSummary(dateRange);

    return jsonResponse(summary);

  } catch (error) {

    if (isDatabaseConnectionError(error)) {
      return jsonResponse({
        databaseOffline: true,
        warning: databaseOfflineMessage,
      });
    }

    return handleApiError(error);
  }
}