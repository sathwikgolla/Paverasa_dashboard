import {
  databaseOfflineMessage,
  handleApiError,
  isDatabaseConnectionError,
  jsonResponse,
  normalizeSortDirection,
  parsePositiveInteger,
} from "../../lib/api-utils";
import { authorizeRequest } from "../../lib/auth";
import { createExpense, listExpenses } from "../../lib/finance";
import { PERMISSIONS } from "../../lib/roles";
import { validateExpensePayload } from "../../lib/validation";
import { ensureDatabaseReady } from "../../lib/db-init";

export async function GET(request) {
  const auth = await authorizeRequest(PERMISSIONS.VIEW_EXPENSES);

  if (auth.error) {
    return auth.error;
  }

  try {
    await ensureDatabaseReady();
    const { searchParams } = new URL(request.url);

    const result = await listExpenses({
      search: searchParams.get("search") || "",
      date: searchParams.get("date") || "",
      sortBy: searchParams.get("sortBy") || "date",
      sortDir: normalizeSortDirection(searchParams.get("sortDir")),
      page: parsePositiveInteger(searchParams.get("page"), 1),
      limit: parsePositiveInteger(searchParams.get("limit"), 10),
    });

    return jsonResponse(result);
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return jsonResponse({
        databaseOffline: true,
        warning: databaseOfflineMessage,
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
        },
      });
    }

    return handleApiError(error);
  }
}

export async function POST(request) {
  const auth = await authorizeRequest(PERMISSIONS.MANAGE_EXPENSES);

  if (auth.error) {
    return auth.error;
  }

  try {
    await ensureDatabaseReady();
    const payload = await request.json();
    const validation = validateExpensePayload(payload);

    if (!validation.isValid) {
      return jsonResponse({ errors: validation.errors }, 400);
    }

    const expense = await createExpense(validation.data);

    return jsonResponse({ data: expense, message: "Expense created." }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
