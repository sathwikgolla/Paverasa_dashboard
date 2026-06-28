import {
  databaseOfflineMessage,
  handleApiError,
  isDatabaseConnectionError,
  jsonResponse,
} from "../../lib/api-utils";
import { authorizeRequest } from "../../lib/auth";
import { ensureDatabaseReady } from "../../lib/db-init";
import { getDashboardData } from "../../lib/finance";
import { PERMISSIONS } from "../../lib/roles";

const emptyDashboardData = {
  databaseOffline: true,
  warning: databaseOfflineMessage,
  kpis: {
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    cashBalance: 0,
    outstandingPayments: 0,
    pendingBills: 0,
    revenueTargetAchievement: 0,
  },
  counts: {
    totalTransactions: 0,
    revenueCount: 0,
    expenseCount: 0,
  },
  charts: [],
  recentTransactions: [],
  insights: [databaseOfflineMessage],
};

export async function GET(request) {
  const auth = await authorizeRequest(PERMISSIONS.VIEW_DASHBOARD);

  if (auth.error) {
    return auth.error;
  }

  try {
    await ensureDatabaseReady();
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get("range") || "30d";
    return jsonResponse(await getDashboardData(dateRange));
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return jsonResponse(emptyDashboardData);
    }

    return handleApiError(error);
  }
}
