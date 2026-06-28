import { cookies } from "next/headers";
import { jsonResponse } from "./api-utils";
import { hasPermission } from "./roles";
import {
  createSessionToken,
  SESSION_COOKIE,
  verifySessionToken,
} from "./session";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  return verifySessionToken(token);
}

export async function setSessionCookie(user) {
  const token = await createSessionToken(user);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function authorizeRequest(permission) {
  const session = await getSession();

  if (!session) {
    return {
      error: jsonResponse({ error: "Unauthorized. Please log in." }, 401),
    };
  }

  if (permission && !hasPermission(session.role, permission)) {
    return {
      error: jsonResponse(
        { error: "Forbidden. Insufficient permissions." },
        403,
      ),
    };
  }

  return { session };
}
