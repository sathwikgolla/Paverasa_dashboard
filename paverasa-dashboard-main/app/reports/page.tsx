"use client";

import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface Revenue {
  id: number;
  date: string;
  client_name: string;
  service_name: string;
  department: string;
  amount: number;
  payment_mode: string;
  payment_status: string;
  invoice_number: string;
  notes: string;
}

interface Expense {
  id: number;
  date: string;
  category: string;
  vendor: string;
  amount: number;
  payment_mode: string;
  notes: string;
}

type ReportType =
  | "Daily"
  | "Weekly"
  | "Monthly"
  | "Quarterly"
  | "Annual";

interface ReportRow {
  id: number;
  type: "Revenue" | "Expense";
  date: string;
  title: string;
  category: string;
  amount: number;
  payment_mode: string;
  status: string;
}

export default function ReportsPage() {
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const [reportType, setReportType] =
    useState<ReportType>("Monthly");

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [revRes, expRes] = await Promise.all([
        fetch("/api/revenue"),
        fetch("/api/expenses"),
      ]);

      if (!revRes.ok || !expRes.ok) {
        throw new Error("Failed to fetch reports data");
      }

      const revResponse = await revRes.json();
      const expResponse = await expRes.json();

      setRevenues(
        Array.isArray(revResponse.data) ? revResponse.data : []
      );

      setExpenses(
        Array.isArray(expResponse.data) ? expResponse.data : []
      );
    } catch (error) {
      console.error(error);
      setRevenues([]);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }

  function isInReport(dateString: string) {
    const today = new Date();
    const date = new Date(dateString);

    switch (reportType) {
      case "Daily":
        return date.toDateString() === today.toDateString();

      case "Weekly": {
        const start = new Date(today);
        start.setDate(today.getDate() - 7);
        return date >= start;
      }

      case "Monthly":
        return (
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
        );

      case "Quarterly": {
        const currentQuarter = Math.floor(
          today.getMonth() / 3
        );

        const rowQuarter = Math.floor(
          date.getMonth() / 3
        );

        return (
          currentQuarter === rowQuarter &&
          date.getFullYear() === today.getFullYear()
        );
      }

      case "Annual":
        return (
          date.getFullYear() === today.getFullYear()
        );

      default:
        return true;
    }
  }

  const filteredRevenue = useMemo(() => {
    return revenues.filter((item) => isInReport(item.date));
  }, [revenues, reportType]);

  const filteredExpense = useMemo(() => {
    return expenses.filter((item) => isInReport(item.date));
  }, [expenses, reportType]);

  const totalRevenue = useMemo(() => {
    return filteredRevenue.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );
  }, [filteredRevenue]);

  const totalExpense = useMemo(() => {
    return filteredExpense.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );
  }, [filteredExpense]);

  const netProfit = totalRevenue - totalExpense;

  const tableData: ReportRow[] = useMemo(() => {
    const revRows: ReportRow[] = filteredRevenue.map(
      (item) => ({
        id: item.id,
        type: "Revenue",
        date: item.date,
        title: item.client_name,
        category: item.department,
        amount: item.amount,
        payment_mode: item.payment_mode,
        status: item.payment_status,
      })
    );

    const expRows: ReportRow[] = filteredExpense.map(
      (item) => ({
        id: item.id,
        type: "Expense",
        date: item.date,
        title: item.vendor,
        category: item.category,
        amount: item.amount,
        payment_mode: item.payment_mode,
        status: "-",
      })
    );

    return [...revRows, ...expRows].sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    );
  }, [filteredRevenue, filteredExpense]);

  const filteredTable = useMemo(() => {
    return tableData.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [tableData, search]);

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  }

  function exportPDF() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Finance Report", 14, 15);

    doc.setFontSize(11);
    doc.text(`Report Type: ${reportType}`, 14, 24);

    doc.text(
      `Revenue: ${formatCurrency(totalRevenue)}`,
      14,
      32
    );

    doc.text(
      `Expense: ${formatCurrency(totalExpense)}`,
      14,
      40
    );

    doc.text(
      `Net Profit: ${formatCurrency(netProfit)}`,
      14,
      48
    );

    autoTable(doc, {
      startY: 58,
      head: [[
        "Type",
        "Date",
        "Name",
        "Category",
        "Amount",
        "Payment",
        "Status"
      ]],
      body: filteredTable.map((row) => [
        row.type,
        row.date,
        row.title,
        row.category,
        row.amount,
        row.payment_mode,
        row.status,
      ]),
    });

    doc.save(`${reportType}-Report.pdf`);
  }

  function exportExcel() {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredTable.map((row) => ({
        Type: row.type,
        Date: row.date,
        Name: row.title,
        Category: row.category,
        Amount: row.amount,
        PaymentMode: row.payment_mode,
        Status: row.status,
      }))
    );

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Report"
    );

    XLSX.writeFile(
      workbook,
      `${reportType}-Report.xlsx`
    );
  }

  function exportCSV() {
    const headers = [
      "Type",
      "Date",
      "Name",
      "Category",
      "Amount",
      "Payment Mode",
      "Status",
    ];

    const rows = filteredTable.map((row) => [
      row.type,
      row.date,
      row.title,
      row.category,
      row.amount,
      row.payment_mode,
      row.status,
    ]);

    const csv =
      [
        headers.join(","),
        ...rows.map((r) => r.join(",")),
      ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `${reportType}-Report.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-semibold text-green-600">
        Loading Reports...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-6 text-green-900">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-800">
              Finance Reports
            </h1>
            <p className="text-green-600">
              Revenue, Expenses & KPI Summary
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                "Daily",
                "Weekly",
                "Monthly",
                "Quarterly",
                "Annual",
              ] as ReportType[]
            ).map((type) => (
              <button
                key={type}
                onClick={() => setReportType(type)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  reportType === type
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-white text-green-700 shadow border border-green-200 hover:bg-green-100"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-xl bg-white p-6 shadow border border-green-100">
            <p className="text-green-600 font-medium">
              Total Revenue
            </p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow border border-green-100">
            <p className="text-green-600 font-medium">
              Total Expenses
            </p>
            <h2 className="mt-2 text-3xl font-bold text-green-700">
              {formatCurrency(totalExpense)}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow border border-green-100">
            <p className="text-green-600 font-medium">
              Net Profit
            </p>
            <h2 className={`mt-2 text-3xl font-bold ${
              netProfit >= 0 ? "text-green-600" : "text-green-800 underline decoration-green-500"
            }`}>
              {formatCurrency(netProfit)}
            </h2>
          </div>

        </div>

        {/* Search + Export */}
        <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white p-4 shadow border border-green-100 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-green-200 px-4 py-2 text-green-800 placeholder-green-400 outline-none focus:border-green-500 md:w-80"
          />

          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportPDF}
              className="rounded-lg bg-green-700 px-4 py-2 font-medium text-white hover:bg-green-800 transition shadow"
            >
              Export PDF
            </button>

            <button
              onClick={exportExcel}
              className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 transition shadow"
            >
              Export Excel
            </button>

            <button
              onClick={exportCSV}
              className="rounded-lg bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600 transition shadow"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Reports Table */}
        <div className="overflow-x-auto rounded-xl bg-white shadow border border-green-100">
          <table className="min-w-full">
            <thead className="bg-green-100 border-b border-green-200">
              <tr>
                <th className="px-4 py-3 text-left text-green-800 font-bold">Type</th>
                <th className="px-4 py-3 text-left text-green-800 font-bold">Date</th>
                <th className="px-4 py-3 text-left text-green-800 font-bold">Name</th>
                <th className="px-4 py-3 text-left text-green-800 font-bold">Category</th>
                <th className="px-4 py-3 text-right text-green-800 font-bold">Amount</th>
                <th className="px-4 py-3 text-left text-green-800 font-bold">Payment Mode</th>
                <th className="px-4 py-3 text-left text-green-800 font-bold">Status</th>
              </tr>
            </thead>

            <tbody className="text-green-800">
              {filteredTable.length > 0 ? (
                filteredTable.map((row) => (
                  <tr
                    key={`${row.type}-${row.id}`}
                    className="border-b border-green-50 hover:bg-green-50/50"
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          row.type === "Revenue"
                            ? "bg-green-100 text-green-700"
                            : "bg-green-50 text-green-800 border border-green-200"
                        }`}
                      >
                        {row.type}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {new Date(row.date).toLocaleDateString("en-IN")}
                    </td>

                    <td className="px-4 py-3">{row.title}</td>

                    <td className="px-4 py-3">{row.category}</td>

                    <td className="px-4 py-3 text-right font-bold text-green-700">
                      {formatCurrency(row.amount)}
                    </td>

                    <td className="px-4 py-3">{row.payment_mode}</td>

                    <td className="px-4 py-3">
                      {row.status !== "-" ? (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            row.status.toLowerCase() === "paid"
                              ? "bg-green-100 text-green-800 font-bold"
                              : row.status.toLowerCase() === "pending"
                              ? "bg-green-50 text-green-600 italic"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {row.status}
                        </span>
                      ) : (
                        <span className="text-green-300">—</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-green-600 font-medium"
                  >
                    No reports found for the selected period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="mt-6 rounded-xl bg-white p-5 shadow border border-green-100">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-green-600 font-medium">
                Revenue Records
              </p>
              <p className="mt-1 text-xl font-bold text-green-700">
                {filteredRevenue.length}
              </p>
            </div>

            <div>
              <p className="text-sm text-green-600 font-medium">
                Expense Records
              </p>
              <p className="mt-1 text-xl font-bold text-green-700">
                {filteredExpense.length}
              </p>
            </div>

            <div>
              <p className="text-sm text-green-600 font-medium">
                Total Transactions
              </p>
              <p className="mt-1 text-xl font-bold text-green-700">
                {filteredTable.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}