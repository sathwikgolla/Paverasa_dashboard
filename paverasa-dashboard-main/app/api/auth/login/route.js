import { jsonResponse } from "../../../lib/api-utils";
import { ensureDatabaseReady } from "../../../lib/db-init";
import { verifyPassword } from "../../../lib/password";
import { getPermissionsForRole } from "../../../lib/roles";
import { setSessionCookie } from "../../../lib/auth";
import { getUserByEmail } from "../../../lib/users";

export async function POST(request) {
  try {
    await ensureDatabaseReady();

    const { email, password } = await request.json();

    if (!email || !String(email).trim()) {
      return jsonResponse({ error: "Email is required." }, 400);
    }

    if (!password) {
      return jsonResponse({ error: "Password is required." }, 400);
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await getUserByEmail(normalizedEmail);

    if (!user) {
      return jsonResponse(
        { error: "No account found with this email address." },
        401,
      );
    }

    const passwordMatches = await verifyPassword(password, user.hashed_password);

    if (!passwordMatches) {
      return jsonResponse({ error: "Incorrect password." }, 401);
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    await setSessionCookie(sessionUser);

    return jsonResponse({
      message: "Logged in successfully.",
      user: sessionUser,
      permissions: getPermissionsForRole(user.role),
    });
  } catch (error) {
    console.error("[auth] Login failed:", error);
    return jsonResponse({ error: "Unable to log in right now." }, 500);
  }
}
