"use client";

import { useState } from "react";
import AppShell from "../components/AppShell";
import RecordManager from "../components/RecordManager";

export default function ExpensesPage() {
  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Expense Management</h1>
        <p className="text-sm text-slate-500 mt-1">Track and manage expense records</p>
      </div>

      <RecordManager
        title=""
        apiBase="/api/expenses"
        searchPlaceholder="Search by vendor or category"
        emptyRecord={{
          date: "",
          category: "",
          vendor: "",
          amount: "",
          payment_mode: "",
          notes: "",
        }}
        fields={[
          { name: "date", label: "Date", type: "date", required: true },
          { name: "category", label: "Category", required: true },
          { name: "vendor", label: "Vendor", required: true },
          { name: "amount", label: "Amount", type: "number", required: true },
          {
            name: "payment_mode",
            label: "Payment Mode",
            required: true,
            options: ["Bank Transfer", "UPI", "Cheque", "Cash", "Credit Card"],
          },
          { name: "notes", label: "Notes" },
        ]}
        columns={[
          { key: "id", label: "Expense ID" },
          { key: "date", label: "Date" },
          { key: "category", label: "Category" },
          { key: "vendor", label: "Vendor" },
          { key: "amount", label: "Amount", isCurrency: true },
          { key: "payment_mode", label: "Payment Mode" },
          { key: "notes", label: "Notes" },
        ]}
      />
    </AppShell>
  );
}
