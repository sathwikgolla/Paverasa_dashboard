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
        r.month,
        r.revenue,
        COALESCE(e.expenses,0) AS expenses,
        (r.revenue-COALESCE(e.expenses,0)) AS profit

      FROM

      (
        SELECT
        DATE_FORMAT(date,'%Y-%m') AS month,
        SUM(amount) AS revenue
        FROM revenue
        WHERE date BETWEEN ? AND ?
        GROUP BY DATE_FORMAT(date,'%Y-%m')
      ) r

      LEFT JOIN

      (
        SELECT
        DATE_FORMAT(date,'%Y-%m') AS month,
        SUM(amount) AS expenses
        FROM expenses
        WHERE date BETWEEN ? AND ?
        GROUP BY DATE_FORMAT(date,'%Y-%m')
      ) e

      ON r.month=e.month

      ORDER BY r.month;
    `, [startDate, endDate, startDate, endDate]);

    return Response.json(rows);

  } catch(error:any){

    return Response.json(
      {
        success:false,
        error:error.message
      },
      {status:500}
    );

  }
}