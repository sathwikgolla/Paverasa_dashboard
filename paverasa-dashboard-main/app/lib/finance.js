import db from "./db";
import { getDateRange } from "./date-range";

const REVENUE_SORT_COLUMNS = {
  date: "date",
  amount: "amount",
};

const EXPENSE_SORT_COLUMNS = {
  date: "date",
  amount: "amount",
};

function toNumber(value) {
  return Number(value || 0);
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
}

function currentMonthStart() {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0",
  )}-01`;
}

function previousMonthStart() {
  const now = new Date();
  const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  return `${previous.getFullYear()}-${String(previous.getMonth() + 1).padStart(
    2,
    "0",
  )}-01`;
}

function buildInsights({
  currentRevenue,
  previousRevenue,
  currentExpenses,
  previousExpenses,
  currentMargin,
  previousMargin,
  targetAchievement,
  activeClients,
  previousActiveClients,
  averageTransactionValue,
  previousAverageTransactionValue,
}) {
  const insights = [];

  // Revenue insights
  const revenueChange = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
  if (revenueChange > 0) {
    insights.push(`Revenue increased by ${revenueChange.toFixed(1)}% compared to previous period.`);
  } else if (revenueChange < 0) {
    insights.push(`Revenue decreased by ${Math.abs(revenueChange).toFixed(1)}% compared to previous period.`);
  } else {
    insights.push("Revenue remained stable compared to previous period.");
  }

  // Expense insights
  const expenseChange = previousExpenses > 0 ? ((currentExpenses - previousExpenses) / previousExpenses) * 100 : 0;
  if (expenseChange < 0) {
    insights.push(`Expenses decreased by ${Math.abs(expenseChange).toFixed(1)}% compared to previous period.`);
  } else if (expenseChange > 0) {
    insights.push(`Expenses increased by ${expenseChange.toFixed(1)}% compared to previous period.`);
  } else {
    insights.push("Expenses remained stable compared to previous period.");
  }

  // Profit margin insights
  if (currentMargin >= previousMargin) {
    insights.push("Net profit margin improved compared to previous period.");
  } else {
    insights.push("Net profit margin decreased compared to previous period and needs attention.");
  }

  // Target achievement
  if (targetAchievement >= 100) {
    insights.push("Revenue target achieved for this period.");
  } else if (targetAchievement >= 80) {
    insights.push(`Revenue target is ${targetAchievement.toFixed(1)}% achieved - close to goal.`);
  } else {
    insights.push(`Revenue target is only ${targetAchievement.toFixed(1)}% achieved - significant improvement needed.`);
  }

  // Client insights
  if (activeClients > previousActiveClients) {
    insights.push(`Client base grew by ${activeClients - previousActiveClients} new clients.`);
  } else if (activeClients < previousActiveClients) {
    insights.push(`Client base decreased by ${previousActiveClients - activeClients} clients.`);
  }

  // Transaction value insights
  if (averageTransactionValue > previousAverageTransactionValue) {
    insights.push("Average transaction value increased, indicating higher-value deals.");
  } else if (averageTransactionValue < previousAverageTransactionValue) {
    insights.push("Average transaction value decreased, consider pricing strategy review.");
  }

  return insights;
}

export async function getDashboardData(dateRange = '30d') {
  const range = getDateRange(dateRange);
  const { startDate, endDate, previousStartDate, previousEndDate } = range;

  const [[revenueSummary]] = await db.query(
    "SELECT COALESCE(SUM(amount), 0) AS totalRevenue, COUNT(*) AS revenueCount FROM revenue WHERE date BETWEEN ? AND ?",
    [startDate, endDate],
  );
  const [[expenseSummary]] = await db.query(
    "SELECT COALESCE(SUM(amount), 0) AS totalExpenses, COUNT(*) AS expenseCount FROM expenses WHERE date BETWEEN ? AND ?",
    [startDate, endDate],
  );
  const [[paidRevenue]] = await db.query(
    "SELECT COALESCE(SUM(amount), 0) AS totalPaidRevenue FROM revenue WHERE LOWER(payment_status) = 'paid' AND date BETWEEN ? AND ?",
    [startDate, endDate],
  );
  const [[outstanding]] = await db.query(
    "SELECT COALESCE(SUM(amount), 0) AS outstandingPayments FROM revenue WHERE LOWER(payment_status) <> 'paid' AND date BETWEEN ? AND ?",
    [startDate, endDate],
  );
  const [[target]] = await db.query(
    "SELECT target_amount AS targetAmount FROM targets WHERE month <= ? ORDER BY month DESC LIMIT 1",
    [startDate],
  );
  const [[currentPeriod]] = await db.query(
    `
      SELECT
        COALESCE((SELECT SUM(amount) FROM revenue WHERE date BETWEEN ? AND ?), 0) AS currentRevenue,
        COALESCE((SELECT SUM(amount) FROM expenses WHERE date BETWEEN ? AND ?), 0) AS currentExpenses
    `,
    [startDate, endDate, startDate, endDate],
  );
  const [[previousPeriod]] = await db.query(
    `
      SELECT
        COALESCE((SELECT SUM(amount) FROM revenue WHERE date BETWEEN ? AND ?), 0) AS previousRevenue,
        COALESCE((SELECT SUM(amount) FROM expenses WHERE date BETWEEN ? AND ?), 0) AS previousExpenses
    `,
    [previousStartDate, previousEndDate, previousStartDate, previousEndDate],
  );

  const totalRevenue = toNumber(revenueSummary.totalRevenue);
  const totalExpenses = toNumber(expenseSummary.totalExpenses);
  const totalPaidRevenue = toNumber(paidRevenue.totalPaidRevenue);
  const outstandingPayments = toNumber(outstanding.outstandingPayments);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const targetAmount = toNumber(target?.targetAmount);
  const revenueTargetAchievement =
    targetAmount > 0 ? (toNumber(currentPeriod.currentRevenue) / targetAmount) * 100 : 0;
  const currentMargin =
    toNumber(currentPeriod.currentRevenue) > 0
      ? ((toNumber(currentPeriod.currentRevenue) -
          toNumber(currentPeriod.currentExpenses)) /
          toNumber(currentPeriod.currentRevenue)) *
        100
      : 0;
  const previousMargin =
    toNumber(previousPeriod.previousRevenue) > 0
      ? ((toNumber(previousPeriod.previousRevenue) -
          toNumber(previousPeriod.previousExpenses)) /
          toNumber(previousPeriod.previousRevenue)) *
        100
      : 0;

  const [monthlyRevenue] = await db.query(
    `
      SELECT DATE_FORMAT(date, '%Y-%m') AS month, COALESCE(SUM(amount), 0) AS revenue
      FROM revenue
      WHERE date BETWEEN ? AND ?
      GROUP BY DATE_FORMAT(date, '%Y-%m')
      ORDER BY month ASC
    `,
    [startDate, endDate],
  );
  const [monthlyExpenses] = await db.query(
    `
      SELECT DATE_FORMAT(date, '%Y-%m') AS month, COALESCE(SUM(amount), 0) AS expenses
      FROM expenses
      WHERE date BETWEEN ? AND ?
      GROUP BY DATE_FORMAT(date, '%Y-%m')
      ORDER BY month ASC
    `,
    [startDate, endDate],
  );
  const [recentTransactions] = await db.query(
    `
      SELECT date, 'Revenue' AS type, amount, client_name AS party, payment_status AS status, department, invoice_number, payment_mode
      FROM revenue
      WHERE date BETWEEN ? AND ?
      UNION ALL
      SELECT date, 'Expense' AS type, amount, vendor AS party, 'Paid' AS status, category AS department, NULL AS invoice_number, payment_mode
      FROM expenses
      WHERE date BETWEEN ? AND ?
      ORDER BY date DESC
      LIMIT 8
    `,
    [startDate, endDate, startDate, endDate],
  );

  const monthMap = new Map();

  for (const row of monthlyRevenue) {
    monthMap.set(row.month, {
      month: row.month,
      revenue: toNumber(row.revenue),
      expenses: 0,
    });
  }

  for (const row of monthlyExpenses) {
    const existing = monthMap.get(row.month) || {
      month: row.month,
      revenue: 0,
      expenses: 0,
    };

    existing.expenses = toNumber(row.expenses);
    monthMap.set(row.month, existing);
  }

  let previousRevenueForGrowth = 0;
  const charts = Array.from(monthMap.values())
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((row) => {
      const profit = row.revenue - row.expenses;
      const growth =
        previousRevenueForGrowth > 0
          ? ((row.revenue - previousRevenueForGrowth) /
              previousRevenueForGrowth) *
            100
          : 0;

      previousRevenueForGrowth = row.revenue;

      return {
        ...row,
        profit,
        growth,
      };
    });

  // Additional KPI calculations
  const activeClients = await db.query(
    "SELECT COUNT(DISTINCT client_name) AS count FROM revenue WHERE date BETWEEN ? AND ?",
    [startDate, endDate]
  );
  const activeClientsCount = Number(activeClients[0]?.count || 0);

  const previousActiveClients = await db.query(
    "SELECT COUNT(DISTINCT client_name) AS count FROM revenue WHERE date BETWEEN ? AND ?",
    [previousStartDate, previousEndDate]
  );
  const previousActiveClientsCount = Number(previousActiveClients[0]?.count || 0);

  const invoicesGenerated = await db.query(
    "SELECT COUNT(*) AS count FROM revenue WHERE date BETWEEN ? AND ?",
    [startDate, endDate]
  );
  const invoicesGeneratedCount = Number(invoicesGenerated[0]?.count || 0);

  const invoicesPaid = await db.query(
    "SELECT COUNT(*) AS count FROM revenue WHERE date BETWEEN ? AND ? AND LOWER(payment_status) = 'paid'",
    [startDate, endDate]
  );
  const invoicesPaidCount = Number(invoicesPaid[0]?.count || 0);

  const invoicesPending = await db.query(
    "SELECT COUNT(*) AS count FROM revenue WHERE date BETWEEN ? AND ? AND LOWER(payment_status) <> 'paid'",
    [startDate, endDate]
  );
  const invoicesPendingCount = Number(invoicesPending[0]?.count || 0);

  const totalTransactions = Number(revenueSummary.revenueCount) + Number(expenseSummary.expenseCount);
  const averageTransactionValue = totalTransactions > 0 ? (totalRevenue + totalExpenses) / totalTransactions : 0;

  const previousTotalTransactions = await db.query(
    `SELECT 
      (SELECT COUNT(*) FROM revenue WHERE date BETWEEN ? AND ?) +
      (SELECT COUNT(*) FROM expenses WHERE date BETWEEN ? AND ?) AS count`,
    [previousStartDate, previousEndDate, previousStartDate, previousEndDate]
  );
  const previousTotalTransactionsCount = Number(previousTotalTransactions[0]?.count || 0);

  const previousRevenueData = await db.query(
    "SELECT COALESCE(SUM(amount), 0) AS total FROM revenue WHERE date BETWEEN ? AND ?",
    [previousStartDate, previousEndDate]
  );
  const previousTotalExpensesData = await db.query(
    "SELECT COALESCE(SUM(amount), 0) AS total FROM expenses WHERE date BETWEEN ? AND ?",
    [previousStartDate, previousEndDate]
  );
  const previousTotalRevenueValue = toNumber(previousRevenueData[0]?.total);
  const previousTotalExpensesValue = toNumber(previousTotalExpensesData[0]?.total);
  const previousAverageTransactionValue = previousTotalTransactionsCount > 0 
    ? (previousTotalRevenueValue + previousTotalExpensesValue) / previousTotalTransactionsCount 
    : 0;

  return {
    kpis: {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      cashBalance: totalPaidRevenue - totalExpenses,
      outstandingPayments,
      pendingBills: 0,
      revenueTargetAchievement,
      activeClients: activeClientsCount,
      newClients: activeClientsCount - previousActiveClientsCount,
      averageTransactionValue,
      invoicesGenerated: invoicesGeneratedCount,
      invoicesPaid: invoicesPaidCount,
      invoicesPending: invoicesPendingCount,
    },
    comparisons: {
      totalRevenue: previousTotalRevenueValue,
      totalExpenses: previousTotalExpensesValue,
      netProfit: previousTotalRevenueValue - previousTotalExpensesValue,
      profitMargin: previousTotalRevenueValue > 0 
        ? ((previousTotalRevenueValue - previousTotalExpensesValue) / previousTotalRevenueValue) * 100 
        : 0,
      activeClients: previousActiveClientsCount,
      averageTransactionValue: previousAverageTransactionValue,
    },
    counts: {
      totalTransactions,
      revenueCount: Number(revenueSummary.revenueCount),
      expenseCount: Number(expenseSummary.expenseCount),
    },
    charts,
    recentTransactions: recentTransactions.map((transaction) => ({
      ...transaction,
      date: formatDate(transaction.date),
      amount: toNumber(transaction.amount),
    })),
    insights: buildInsights({
      currentRevenue: toNumber(currentPeriod.currentRevenue),
      previousRevenue: toNumber(previousPeriod.previousRevenue),
      currentExpenses: toNumber(currentPeriod.currentExpenses),
      previousExpenses: toNumber(previousPeriod.previousExpenses),
      currentMargin,
      previousMargin,
      targetAchievement: revenueTargetAchievement,
      activeClients: activeClientsCount,
      previousActiveClients: previousActiveClientsCount,
      averageTransactionValue,
      previousAverageTransactionValue,
    }),
  };
}

export async function getProfitLossData(dateRange = '30d') {
  const dashboard = await getDashboardData(dateRange);

  return {
    totalRevenue: dashboard.kpis.totalRevenue,
    totalExpenses: dashboard.kpis.totalExpenses,
    netProfit: dashboard.kpis.netProfit,
    profitMargin: dashboard.kpis.profitMargin,
    totalTransactions: dashboard.counts.totalTransactions,
    revenueCount: dashboard.counts.revenueCount,
    expenseCount: dashboard.counts.expenseCount,
  };
}

export async function listRevenue({ search, date, status, sortBy, sortDir, page, limit }) {
  const where = [];
  const params = [];

  if (search) {
    where.push("(client_name LIKE ? OR service_name LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  if (date) {
    where.push("date = ?");
    params.push(date);
  }

  if (status) {
    where.push("payment_status = ?");
    params.push(status);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const orderColumn = REVENUE_SORT_COLUMNS[sortBy] || "date";
  const offset = (page - 1) * limit;

  const [[countRow]] = await db.query(
    `SELECT COUNT(*) AS total FROM revenue ${whereSql}`,
    params,
  );
  const [rows] = await db.query(
    `
      SELECT id, date, client_name, service_name, department, amount, payment_mode, payment_status, invoice_number, notes
      FROM revenue
      ${whereSql}
      ORDER BY ${orderColumn} ${sortDir}, id DESC
      LIMIT ? OFFSET ?
    `,
    [...params, limit, offset],
  );

  return {
    data: rows.map((row) => ({
      ...row,
      date: formatDate(row.date),
      amount: toNumber(row.amount),
    })),
    pagination: {
      page,
      limit,
      total: Number(countRow.total),
      totalPages: Math.max(1, Math.ceil(Number(countRow.total) / limit)),
    },
  };
}

export async function getRevenueById(id) {
  const [rows] = await db.query("SELECT * FROM revenue WHERE id = ?", [id]);
  const row = rows[0];

  return row
    ? {
        ...row,
        date: formatDate(row.date),
        amount: toNumber(row.amount),
      }
    : null;
}

export async function createRevenue(data) {
  const [result] = await db.query(
    `
      INSERT INTO revenue (date, client_name, service_name, department, amount, payment_mode, payment_status, invoice_number, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.date,
      data.client_name,
      data.service_name,
      data.department,
      data.amount,
      data.payment_mode,
      data.payment_status,
      data.invoice_number,
      data.notes,
    ],
  );

  return getRevenueById(result.insertId);
}

export async function updateRevenue(id, data) {
  const [result] = await db.query(
    `
      UPDATE revenue
      SET date = ?, client_name = ?, service_name = ?, department = ?, amount = ?, payment_mode = ?, payment_status = ?, invoice_number = ?, notes = ?
      WHERE id = ?
    `,
    [
      data.date,
      data.client_name,
      data.service_name,
      data.department,
      data.amount,
      data.payment_mode,
      data.payment_status,
      data.invoice_number,
      data.notes,
      id,
    ],
  );

  return result.affectedRows ? getRevenueById(id) : null;
}

export async function deleteRevenue(id) {
  const [result] = await db.query("DELETE FROM revenue WHERE id = ?", [id]);

  return result.affectedRows > 0;
}

export async function listExpenses({ search, date, sortBy, sortDir, page, limit }) {
  const where = [];
  const params = [];

  if (search) {
    where.push("(vendor LIKE ? OR category LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  if (date) {
    where.push("date = ?");
    params.push(date);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const orderColumn = EXPENSE_SORT_COLUMNS[sortBy] || "date";
  const offset = (page - 1) * limit;

  const [[countRow]] = await db.query(
    `SELECT COUNT(*) AS total FROM expenses ${whereSql}`,
    params,
  );
  const [rows] = await db.query(
    `
      SELECT id, date, category, vendor, amount, payment_mode, notes
      FROM expenses
      ${whereSql}
      ORDER BY ${orderColumn} ${sortDir}, id DESC
      LIMIT ? OFFSET ?
    `,
    [...params, limit, offset],
  );

  return {
    data: rows.map((row) => ({
      ...row,
      date: formatDate(row.date),
      amount: toNumber(row.amount),
    })),
    pagination: {
      page,
      limit,
      total: Number(countRow.total),
      totalPages: Math.max(1, Math.ceil(Number(countRow.total) / limit)),
    },
  };
}

export async function getExpenseById(id) {
  const [rows] = await db.query("SELECT * FROM expenses WHERE id = ?", [id]);
  const row = rows[0];

  return row
    ? {
        ...row,
        date: formatDate(row.date),
        amount: toNumber(row.amount),
      }
    : null;
}

export async function createExpense(data) {
  const [result] = await db.query(
    `
      INSERT INTO expenses (date, category, vendor, amount, payment_mode, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      data.date,
      data.category,
      data.vendor,
      data.amount,
      data.payment_mode,
      data.notes,
    ],
  );

  return getExpenseById(result.insertId);
}

export async function updateExpense(id, data) {
  const [result] = await db.query(
    `
      UPDATE expenses
      SET date = ?, category = ?, vendor = ?, amount = ?, payment_mode = ?, notes = ?
      WHERE id = ?
    `,
    [
      data.date,
      data.category,
      data.vendor,
      data.amount,
      data.payment_mode,
      data.notes,
      id,
    ],
  );

  return result.affectedRows ? getExpenseById(id) : null;
}

export async function deleteExpense(id) {
  const [result] = await db.query("DELETE FROM expenses WHERE id = ?", [id]);

  return result.affectedRows > 0;
}
export async function getCashFlowSummary(dateRange = '30d') {
  const range = getDateRange(dateRange);
  const { startDate, endDate } = range;

  // Get Opening Balance - handle case where table might not exist or be empty
  let openingBalance = 0;
  try {
    const [[opening]] = await db.query(`
      SELECT balance
      FROM opening_balance
      ORDER BY as_of_date DESC
      LIMIT 1
    `);
    openingBalance = toNumber(opening?.balance);
  } catch (error) {
    // Table doesn't exist or other error, default to 0
    openingBalance = 0;
  }

  // Total Revenue
  const [[revenue]] = await db.query(`
    SELECT COALESCE(SUM(amount), 0) AS totalRevenue
    FROM revenue
    WHERE date BETWEEN ? AND ?
  `, [startDate, endDate]);

  // Total Expenses
  const [[expenses]] = await db.query(`
    SELECT COALESCE(SUM(amount), 0) AS totalExpenses
    FROM expenses
    WHERE date BETWEEN ? AND ?
  `, [startDate, endDate]);

  // Recent Transactions (Revenue + Expenses)
  const [transactions] = await db.query(`
    SELECT
      date,
      'Revenue' AS type,
      client_name AS description,
      amount
    FROM revenue
    WHERE date BETWEEN ? AND ?

    UNION ALL

    SELECT
      date,
      'Expense' AS type,
      vendor AS description,
      amount
    FROM expenses
    WHERE date BETWEEN ? AND ?

    ORDER BY date DESC
  `, [startDate, endDate, startDate, endDate]);
  const [chartData] = await db.query(`
    SELECT
        month,
        SUM(revenue) AS revenue,
        SUM(expense) AS expense
    FROM (
        SELECT
            DATE_FORMAT(date,'%b') AS month,
            amount AS revenue,
            0 AS expense
        FROM revenue
        WHERE date BETWEEN ? AND ?

        UNION ALL

        SELECT
            DATE_FORMAT(date,'%b') AS month,
            0 AS revenue,
            amount AS expense
        FROM expenses
        WHERE date BETWEEN ? AND ?
    ) t
    GROUP BY month
    ORDER BY STR_TO_DATE(month,'%b')
  `, [startDate, endDate, startDate, endDate]);

  const cashIn = toNumber(revenue.totalRevenue);
  const cashOut = toNumber(expenses.totalExpenses);
  const closingBalance = openingBalance + cashIn - cashOut;

  return {
    openingBalance,
    cashIn,
    cashOut,
    closingBalance,
    transactions: transactions.map((item) => ({
      ...item,
      date: formatDate(item.date),
      amount: toNumber(item.amount),
    })),
    chartData,
  };
}