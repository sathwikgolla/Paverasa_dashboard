import db from "../../../lib/db";

export async function GET() {
  try {

    // Total Revenue
    const [revenue]: any = await db.query(`
      SELECT IFNULL(SUM(amount),0) AS totalRevenue
      FROM revenue
    `);

    // Monthly Revenue
    const [monthlyRevenue]: any = await db.query(`
      SELECT IFNULL(SUM(amount),0) AS monthlyRevenue
      FROM revenue
      WHERE MONTH(date)=MONTH(CURDATE())
      AND YEAR(date)=YEAR(CURDATE())
    `);

    // Total Expenses
    const [expenses]: any = await db.query(`
      SELECT IFNULL(SUM(amount),0) AS totalExpenses
      FROM expenses
    `);

    // Net Profit
    const netProfit =
      revenue[0].totalRevenue -
      expenses[0].totalExpenses;

    // Profit Margin
    const profitMargin =
      revenue[0].totalRevenue === 0
        ? 0
        : (netProfit / revenue[0].totalRevenue) * 100;

    return Response.json({
      totalRevenue: revenue[0].totalRevenue,
      monthlyRevenue: monthlyRevenue[0].monthlyRevenue,
      totalExpenses: expenses[0].totalExpenses,
      netProfit,
      profitMargin
    });

  } catch (error: any) {

    return Response.json(
      {
        success: false,
        error: error.message
      },
      {
        status: 500
      }
    );

  }
}