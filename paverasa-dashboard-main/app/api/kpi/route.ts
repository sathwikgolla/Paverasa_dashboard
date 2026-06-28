import db from "../../lib/db";
import { getDateRange } from "../../lib/date-range";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get("range") || "30d";
    const range = getDateRange(dateRange);
    const { startDate, endDate, previousStartDate, previousEndDate } = range;

    // Total Revenue
    const [revenue]: any = await db.query(`
      SELECT IFNULL(SUM(amount),0) AS totalRevenue
      FROM revenue
      WHERE date BETWEEN ? AND ?
    `, [startDate, endDate]);

    // Monthly Revenue (current period)
    const [monthlyRevenue]: any = await db.query(`
      SELECT IFNULL(SUM(amount),0) AS monthlyRevenue
      FROM revenue
      WHERE date BETWEEN ? AND ?
    `, [startDate, endDate]);

    // Total Expenses
    const [expenses]: any = await db.query(`
      SELECT IFNULL(SUM(amount),0) AS totalExpenses
      FROM expenses
      WHERE date BETWEEN ? AND ?
    `, [startDate, endDate]);

    // Revenue Growth %
    const [revenueGrowth]: any = await db.query(`
      SELECT IFNULL(
      (
      (
      (SELECT IFNULL(SUM(amount),0)
       FROM revenue
       WHERE date BETWEEN ? AND ?)
      -
      (SELECT IFNULL(SUM(amount),0)
       FROM revenue
       WHERE date BETWEEN ? AND ?)
      )
      /
      NULLIF(
      (SELECT IFNULL(SUM(amount),0)
       FROM revenue
       WHERE date BETWEEN ? AND ?),0)
      )*100,0) AS revenueGrowth
    `, [startDate, endDate, previousStartDate, previousEndDate, previousStartDate, previousEndDate]);

    // Expense Growth %
    const [expenseGrowth]: any = await db.query(`
      SELECT IFNULL(
      (
      (
      (SELECT IFNULL(SUM(amount),0)
       FROM expenses
       WHERE date BETWEEN ? AND ?)
      -
      (SELECT IFNULL(SUM(amount),0)
       FROM expenses
       WHERE date BETWEEN ? AND ?)
      )
      /
      NULLIF(
      (SELECT IFNULL(SUM(amount),0)
       FROM expenses
       WHERE date BETWEEN ? AND ?),0)
      )*100,0) AS expenseGrowth
    `, [startDate, endDate, previousStartDate, previousEndDate, previousStartDate, previousEndDate]);

    // Target Achievement %
    const [target]: any = await db.query(`
      SELECT
      (
      (
      SELECT IFNULL(SUM(amount),0)
      FROM revenue
      WHERE date BETWEEN ? AND ?
      )
      /
      (
      SELECT target_amount
      FROM targets
      WHERE month <= ?
      LIMIT 1
      )
      )*100 AS targetAchievement
    `, [startDate, endDate, startDate]);

    // Net Profit
    const netProfit =
      revenue[0].totalRevenue -
      expenses[0].totalExpenses;

    // Profit Margin
    const profitMargin =
      revenue[0].totalRevenue === 0
        ? 0
        : (netProfit / revenue[0].totalRevenue) * 100;

    // Cash Balance (without opening balance)
    const cashBalance =
      revenue[0].totalRevenue -
      expenses[0].totalExpenses;

    // Cash Burn Rate
    const [burnRate]: any = await db.query(`
      SELECT IFNULL(AVG(monthlyExpense),0) AS cashBurnRate
      FROM
      (
        SELECT SUM(amount) AS monthlyExpense
        FROM expenses
        GROUP BY MONTH(date)
      ) x
    `);

    return Response.json({
      totalRevenue: revenue[0].totalRevenue,
      monthlyRevenue: monthlyRevenue[0].monthlyRevenue,
      revenueGrowth: revenueGrowth[0].revenueGrowth || 0,
      targetAchievement: target[0]?.targetAchievement || 0,

      totalExpenses: expenses[0].totalExpenses,
      expenseGrowth: expenseGrowth[0].expenseGrowth || 0,

      netProfit,
      profitMargin,

      cashBalance,
      cashBurnRate: burnRate[0].cashBurnRate || 0,
    });

  } catch (error: any) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}