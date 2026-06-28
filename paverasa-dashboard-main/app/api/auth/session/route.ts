import { getSession } from "../../../lib/auth";
import { jsonResponse } from "../../../lib/api-utils";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return jsonResponse(
      { error: "Unauthorized. Please log in." },
      401
    );
  }

  return jsonResponse(session);
}