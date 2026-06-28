import {
  databaseOfflineMessage,
  handleApiError,
  isDatabaseConnectionError,
  jsonResponse,
} from "../../lib/api-utils";
import { authorizeRequest } from "../../lib/auth";
import { ensureDatabaseReady } from "../../lib/db-init";
import { getProfitLossData } from "../../lib/finance";
import { PERMISSIONS } from "../../lib/roles";

export async function GET(request) {
  const auth = await authorizeRequest(PERMISSIONS.VIEW_REPORTS);

  if (auth.error) {
    return auth.error;
  }

  try {
    await ensureDatabaseReady();
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get("range") || "30d";
    return jsonResponse(await getProfitLossData(dateRange));
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return jsonResponse({
        databaseOffline: true,
        warning: databaseOfflineMessage,
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
        profitMargin: 0,
        totalTransactions: 0,
        revenueCount: 0,
        expenseCount: 0,
      });
    }

    return handleApiError(error);
  }
}
