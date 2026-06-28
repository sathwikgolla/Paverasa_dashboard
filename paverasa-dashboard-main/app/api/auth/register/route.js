import { jsonResponse } from "../../../lib/api-utils";
import { ensureDatabaseReady } from "../../../lib/db-init";
import { validateRegisterPayload } from "../../../lib/validation";
import {
  createUser,
  emailExists,
  REGISTERABLE_ROLES,
} from "../../../lib/users";

export async function POST(request) {
  try {
    await ensureDatabaseReady();

    const payload = await request.json();
    const validation = validateRegisterPayload(payload, REGISTERABLE_ROLES);

    if (!validation.isValid) {
      return jsonResponse({ errors: validation.errors }, 400);
    }

    const { name, email, password, role } = validation.data;

    if (await emailExists(email)) {
      return jsonResponse(
        { error: "An account with this email already exists." },
        409,
      );
    }

    const user = await createUser({
      name,
      email,
      role,
      password,
    });

    return jsonResponse(
      {
        message: "Registration successful. Please sign in.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      201,
    );
  } catch (error) {
    console.error("[auth] Registration failed:", error);
    return jsonResponse({ error: "Unable to register right now." }, 500);
  }
}
