"use client";

import { useState } from "react";
import AppShell from "../components/AppShell";
import CashFlowSummary from "../components/cashflow/CashFlowSummary";
import CashFlowFormula from "../components/cashflow/CashFlowFormula";
import CashFlowChart from "../components/cashflow/CashFlowChart";
import CashFlowTable from "../components/cashflow/CashFlowTable";
import { parseDateRange } from "../lib/date-range";

export default function CashFlowPage() {
  const [dateFilter, setDateFilter] = useState("Last 30 Days");

  return (
    <AppShell 
      showDateFilter={true}
      dateFilter={dateFilter}
      onDateFilterChange={setDateFilter}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Cash Flow Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Track your cash flow with real-time data
        </p>
      </div>

      <CashFlowSummary dateFilter={parseDateRange(dateFilter)} />
      <CashFlowFormula />
      <CashFlowChart dateFilter={parseDateRange(dateFilter)} />
      <CashFlowTable dateFilter={parseDateRange(dateFilter)} />
    </AppShell>
  );
}