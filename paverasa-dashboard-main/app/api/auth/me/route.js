import { jsonResponse } from "../../../lib/api-utils";
import { getSession } from "../../../lib/auth";
import { getPermissionsForRole, getRoleDescription } from "../../../lib/roles";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  return jsonResponse({
    user: {
      id: session.id,
      name: session.name,
      email: session.email,
      role: session.role,
    },
    permissions: getPermissionsForRole(session.role),
    roleDescription: getRoleDescription(session.role),
  });
}
