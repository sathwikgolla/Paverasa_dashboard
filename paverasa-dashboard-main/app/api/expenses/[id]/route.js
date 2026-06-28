import { handleApiError, isValidId, jsonResponse } from "../../../lib/api-utils";
import { authorizeRequest } from "../../../lib/auth";
import { ensureDatabaseReady } from "../../../lib/db-init";
import {
  deleteExpense,
  getExpenseById,
  updateExpense,
} from "../../../lib/finance";
import { PERMISSIONS } from "../../../lib/roles";
import { validateExpensePayload } from "../../../lib/validation";

async function getId(context) {
  const params = await context.params;

  return params.id;
}

export async function GET(_request, context) {
  const auth = await authorizeRequest(PERMISSIONS.VIEW_EXPENSES);

  if (auth.error) {
    return auth.error;
  }

  try {
    await ensureDatabaseReady();
    const id = await getId(context);

    if (!isValidId(id)) {
      return jsonResponse({ error: "Invalid expense id." }, 400);
    }

    const expense = await getExpenseById(id);

    if (!expense) {
      return jsonResponse({ error: "Expense record not found." }, 404);
    }

    return jsonResponse({ data: expense });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request, context) {
  const auth = await authorizeRequest(PERMISSIONS.MANAGE_EXPENSES);

  if (auth.error) {
    return auth.error;
  }

  try {
    await ensureDatabaseReady();
    const id = await getId(context);

    if (!isValidId(id)) {
      return jsonResponse({ error: "Invalid expense id." }, 400);
    }

    const payload = await request.json();
    const validation = validateExpensePayload(payload);

    if (!validation.isValid) {
      return jsonResponse({ errors: validation.errors }, 400);
    }

    const expense = await updateExpense(id, validation.data);

    if (!expense) {
      return jsonResponse({ error: "Expense record not found." }, 404);
    }

    return jsonResponse({ data: expense, message: "Expense updated." });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request, context) {
  const auth = await authorizeRequest(PERMISSIONS.MANAGE_EXPENSES);

  if (auth.error) {
    return auth.error;
  }

  try {
    await ensureDatabaseReady();
    const id = await getId(context);

    if (!isValidId(id)) {
      return jsonResponse({ error: "Invalid expense id." }, 400);
    }

    const deleted = await deleteExpense(id);

    if (!deleted) {
      return jsonResponse({ error: "Expense record not found." }, 404);
    }

    return jsonResponse({ message: "Expense deleted." });
  } catch (error) {
    return handleApiError(error);
  }
}
