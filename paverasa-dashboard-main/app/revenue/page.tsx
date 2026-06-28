"use client";

import { useState } from "react";
import AppShell from "../components/AppShell";
import RecordManager from "../components/RecordManager";

export default function RevenuePage() {
  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Revenue Management</h1>
        <p className="text-sm text-slate-500 mt-1">Track and manage revenue records</p>
      </div>

      <RecordManager
        title=""
        apiBase="/api/revenue"
        showDatabaseStatus
        searchPlaceholder="Search by client or service"
        statusFilter
        emptyRecord={{
          date: "",
          client_name: "",
          service_name: "",
          department: "",
          amount: "",
          payment_mode: "",
          payment_status: "",
          invoice_number: "",
          notes: "",
        }}
        fields={[
          { name: "date", label: "Date", type: "date", required: true },
          { name: "client_name", label: "Client Name", required: true },
          { name: "service_name", label: "Service Name", required: true },
          { name: "department", label: "Department", required: true },
          { name: "amount", label: "Amount", type: "number", required: true },
          {
            name: "payment_mode",
            label: "Payment Mode",
            required: true,
            options: ["Bank Transfer", "UPI", "Cheque", "Cash", "Credit Card"],
          },
          {
            name: "payment_status",
            label: "Payment Status",
            required: true,
            options: ["Paid", "Pending", "Overdue"],
          },
          { name: "invoice_number", label: "Invoice Number", required: true },
          { name: "notes", label: "Notes" },
        ]}
        columns={[
          { key: "id", label: "Revenue ID" },
          { key: "date", label: "Date" },
          { key: "client_name", label: "Client Name" },
          { key: "service_name", label: "Service Name" },
          { key: "department", label: "Department" },
          { key: "amount", label: "Amount", isCurrency: true },
          { key: "payment_mode", label: "Payment Mode" },
          { key: "payment_status", label: "Payment Status" },
          { key: "invoice_number", label: "Invoice Number" },
          { key: "notes", label: "Notes" },
        ]}
      />
    </AppShell>
  );
}
