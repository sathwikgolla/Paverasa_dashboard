import db from "../../../lib/db";
import { getDateRange } from "../../../lib/date-range";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get("range") || "30d";
    const range = getDateRange(dateRange);
    const { startDate, endDate } = range;

    const [rows] = await db.query(`
      SELECT
        MONTHNAME(date) AS month,
        MONTH(date) AS month_no,
        SUM(amount) AS revenue
      FROM revenue
      WHERE date BETWEEN ? AND ?
      GROUP BY MONTH(date), MONTHNAME(date)
      ORDER BY MONTH(date)
    `, [startDate, endDate]);

    return Response.json(rows);

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}