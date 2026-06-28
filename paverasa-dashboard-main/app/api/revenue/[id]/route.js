import {
  buildDatabaseStatusPayload,
  handleApiError,
  isValidId,
  jsonResponse,
} from "../../../lib/api-utils";
import { authorizeRequest } from "../../../lib/auth";
import { checkDatabaseHealth } from "../../../lib/db";
import { ensureDatabaseReady } from "../../../lib/db-init";
import {
  deleteRevenue,
  getRevenueById,
  updateRevenue,
} from "../../../lib/finance";
import { PERMISSIONS } from "../../../lib/roles";
import { validateRevenuePayload } from "../../../lib/validation";

async function getId(context) {
  const params = await context.params;

  return params.id;
}

export async function GET(_request, context) {
  const auth = await authorizeRequest(PERMISSIONS.VIEW_REVENUE);

  if (auth.error) {
    return auth.error;
  }

  try {
    await ensureDatabaseReady();

    const id = await getId(context);

    if (!isValidId(id)) {
      return jsonResponse({ error: "Invalid revenue id." }, 400);
    }

    const revenue = await getRevenueById(id);

    if (!revenue) {
      return jsonResponse({ error: "Revenue record not found." }, 404);
    }

    const health = await checkDatabaseHealth();

    return jsonResponse({
      data: revenue,
      ...buildDatabaseStatusPayload(health),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request, context) {
  const auth = await authorizeRequest(PERMISSIONS.MANAGE_REVENUE);

  if (auth.error) {
    return auth.error;
  }

  try {
    await ensureDatabaseReady();

    const id = await getId(context);

    if (!isValidId(id)) {
      return jsonResponse({ error: "Invalid revenue id." }, 400);
    }

    const payload = await request.json();
    const validation = validateRevenuePayload(payload);

    if (!validation.isValid) {
      return jsonResponse({ errors: validation.errors }, 400);
    }

    const revenue = await updateRevenue(id, validation.data);

    if (!revenue) {
      return jsonResponse({ error: "Revenue record not found." }, 404);
    }

    const health = await checkDatabaseHealth();

    return jsonResponse({
      data: revenue,
      message: "Revenue updated.",
      ...buildDatabaseStatusPayload(health),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request, context) {
  const auth = await authorizeRequest(PERMISSIONS.MANAGE_REVENUE);

  if (auth.error) {
    return auth.error;
  }

  try {
    await ensureDatabaseReady();

    const id = await getId(context);

    if (!isValidId(id)) {
      return jsonResponse({ error: "Invalid revenue id." }, 400);
    }

    const deleted = await deleteRevenue(id);

    if (!deleted) {
      return jsonResponse({ error: "Revenue record not found." }, 404);
    }

    const health = await checkDatabaseHealth();

    return jsonResponse({
      message: "Revenue deleted.",
      ...buildDatabaseStatusPayload(health),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
