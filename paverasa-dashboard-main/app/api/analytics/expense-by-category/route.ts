import db from "../../../lib/db";
import { getDateRange } from "../../../lib/date-range";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get("range") || "30d";
    const range = getDateRange(dateRange);
    const { startDate, endDate } = range;

    const [rows]: any = await db.query(`
      SELECT
        category,
        SUM(amount) AS expense
      FROM expenses
      WHERE date BETWEEN ? AND ?
      GROUP BY category
      ORDER BY expense DESC
    `, [startDate, endDate]);

    return Response.json(rows);

  } catch (error: any) {

    return Response.json(
      {
        success:false,
        error:error.message
      },
      {status:500}
    );

  }
}