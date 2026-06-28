import { createDatabaseConnection, runMigrations } from "./db-utils.mjs";

async function seedRevenue(connection) {
  const records = [
    {
      date: "2026-06-03",
      clientName: "ABC Technologies",
      serviceName: "Website Development",
      department: "Digital Solutions",
      amount: 85000,
      paymentMode: "Bank Transfer",
      paymentStatus: "Paid",
      invoiceNumber: "INV-2026-001",
      notes: "Corporate website redesign and launch support.",
    },
    {
      date: "2026-06-10",
      clientName: "XYZ Solutions",
      serviceName: "Mobile App",
      department: "Product Engineering",
      amount: 120000,
      paymentMode: "UPI",
      paymentStatus: "Paid",
      invoiceNumber: "INV-2026-002",
      notes: "Milestone payment for Android and iOS app delivery.",
    },
    {
      date: "2026-06-18",
      clientName: "TechNova",
      serviceName: "ERP Consultation",
      department: "Business Consulting",
      amount: 65000,
      paymentMode: "Cheque",
      paymentStatus: "Pending",
      invoiceNumber: "INV-2026-003",
      notes: "Finance workflow assessment and implementation planning.",
    },
  ];

  for (const record of records) {
    await connection.query(
      `
        INSERT INTO revenue (
          date,
          client_name,
          service_name,
          department,
          amount,
          payment_mode,
          payment_status,
          invoice_number,
          notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          date = VALUES(date),
          client_name = VALUES(client_name),
          service_name = VALUES(service_name),
          department = VALUES(department),
          amount = VALUES(amount),
          payment_mode = VALUES(payment_mode),
          payment_status = VALUES(payment_status),
          notes = VALUES(notes)
      `,
      [
        record.date,
        record.clientName,
        record.serviceName,
        record.department,
        record.amount,
        record.paymentMode,
        record.paymentStatus,
        record.invoiceNumber,
        record.notes,
      ],
    );
  }
}

async function seedExpenses(connection) {
  const records = [
    {
      date: "2026-06-01",
      category: "Office Rent",
      vendor: "Paverasa Business Center",
      amount: 45000,
      paymentMode: "Bank Transfer",
      notes: "Monthly office lease payment.",
    },
    {
      date: "2026-06-05",
      category: "Employee Salary",
      vendor: "Payroll Disbursement",
      amount: 175000,
      paymentMode: "Bank Transfer",
      notes: "June payroll processing for operations team.",
    },
    {
      date: "2026-06-12",
      category: "Software Subscription",
      vendor: "CloudWorks SaaS",
      amount: 18500,
      paymentMode: "Credit Card",
      notes: "Monthly subscription for productivity and hosting tools.",
    },
  ];

  for (const record of records) {
    await connection.query(
      `
        INSERT INTO expenses (
          date,
          category,
          vendor,
          amount,
          payment_mode,
          notes
        )
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          payment_mode = VALUES(payment_mode),
          notes = VALUES(notes)
      `,
      [
        record.date,
        record.category,
        record.vendor,
        record.amount,
        record.paymentMode,
        record.notes,
      ],
    );
  }
}

async function seedTargets(connection) {
  await connection.query(
    `
      INSERT INTO targets (month, target_amount)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE
        target_amount = VALUES(target_amount)
    `,
    ["2026-06-01", 300000],
  );
}

async function main() {
  const connection = await createDatabaseConnection();

  try {
    await runMigrations(connection);
    await seedRevenue(connection);
    await seedExpenses(connection);
    await seedTargets(connection);

    console.log("Database initialized and seed data upserted successfully.");
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error("Database initialization failed:");
  console.error(error.sqlMessage || error.message || error.code || error);
  process.exitCode = 1;
});
