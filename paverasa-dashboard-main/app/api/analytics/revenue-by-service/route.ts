import db from "../../../lib/db";

export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT
        service_name,
        SUM(amount) AS revenue
      FROM revenue
      GROUP BY service_name
      ORDER BY revenue DESC
    `);

    return Response.json(rows);

  } catch (error: any) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}