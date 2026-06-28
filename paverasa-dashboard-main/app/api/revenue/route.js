import {
  buildDatabaseStatusPayload,
  handleApiError,
  isDatabaseConnectionError,
  jsonResponse,
  normalizeSortDirection,
  parsePositiveInteger,
} from "../../lib/api-utils";
import { authorizeRequest } from "../../lib/auth";
import { checkDatabaseHealth } from "../../lib/db";
import { ensureDatabaseReady } from "../../lib/db-init";
import { createRevenue, listRevenue } from "../../lib/finance";
import { PERMISSIONS } from "../../lib/roles";
import { validateRevenuePayload } from "../../lib/validation";

const emptyListPayload = {
  data: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
};

export async function GET(request) {
  const auth = await authorizeRequest(PERMISSIONS.VIEW_REVENUE);

  if (auth.error) {
    return auth.error;
  }

  try {
    await ensureDatabaseReady();

    const { searchParams } = new URL(request.url);

    const result = await listRevenue({
      search: searchParams.get("search") || "",
      date: searchParams.get("date") || "",
      status: searchParams.get("status") || "",
      sortBy: searchParams.get("sortBy") || "date",
      sortDir: normalizeSortDirection(searchParams.get("sortDir")),
      page: parsePositiveInteger(searchParams.get("page"), 1),
      limit: parsePositiveInteger(searchParams.get("limit"), 10),
    });

    const health = await checkDatabaseHealth();

    return jsonResponse({
      ...result,
      ...buildDatabaseStatusPayload(health),
    });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      const health = await checkDatabaseHealth();

      return jsonResponse({
        ...emptyListPayload,
        ...buildDatabaseStatusPayload(health),
      });
    }

    return handleApiError(error);
  }
}

export async function POST(request) {
  const auth = await authorizeRequest(PERMISSIONS.MANAGE_REVENUE);

  if (auth.error) {
    return auth.error;
  }

  try {
    await ensureDatabaseReady();

    const payload = await request.json();
    const validation = validateRevenuePayload(payload);

    if (!validation.isValid) {
      return jsonResponse({ errors: validation.errors }, 400);
    }

    const revenue = await createRevenue(validation.data);
    const health = await checkDatabaseHealth();

    return jsonResponse(
      {
        data: revenue,
        message: "Revenue created.",
        ...buildDatabaseStatusPayload(health),
      },
      201,
    );
  } catch (error) {
    return handleApiError(error);
  }
}
