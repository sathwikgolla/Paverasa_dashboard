import { jsonResponse } from "../../../lib/api-utils";
import { clearSessionCookie } from "../../../lib/auth";

export async function POST() {
  await clearSessionCookie();

  return jsonResponse({ message: "Logged out successfully." });
}
