"use client";

import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import MetricCard from "../components/MetricCard";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
} from "../lib/client-format";
import { parseDateRange } from "../lib/date-range";

type ProfitLossData = {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  totalTransactions: number;
  revenueCount: number;
  expenseCount: number;
};

const emptyProfitLoss: ProfitLossData = {
  totalRevenue: 0,
  totalExpenses: 0,
  netProfit: 0,
  profitMargin: 0,
  totalTransactions: 0,
  revenueCount: 0,
  expenseCount: 0,
};

export default function ProfitLossPage() {
  const [data, setData] = useState<ProfitLossData>(emptyProfitLoss);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateFilter, setDateFilter] = useState("Last 30 Days");

  useEffect(() => {
    let isMounted = true;

    async function loadProfitLoss() {
      try {
        setError("");
        const range = parseDateRange(dateFilter);
        const response = await fetch(`/api/profit-loss?range=${range}`, { cache: "no-store" });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Unable to load Profit & Loss.");
        }

        if (isMounted) {
          setData(result);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load Profit & Loss.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfitLoss();

    return () => {
      isMounted = false;
    };
  }, [dateFilter]);

  const statusLabel =
    data.netProfit > 0 ? "Profit" : data.netProfit < 0 ? "Loss" : "Break-even";
  const statusClass =
    data.netProfit > 0
      ? "text-green-600"
      : data.netProfit < 0
        ? "text-red-600"
        : "text-yellow-600";

  return (
    <AppShell 
      showDateFilter={true}
      dateFilter={dateFilter}
      onDateFilterChange={setDateFilter}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Profit & Loss
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Dynamic profit calculations from revenue and expense data
        </p>
      </div>

      {error ? (
        <div className="bg-white border border-red-200 rounded-lg p-4 mb-6 text-red-600">
          <div className="flex items-center gap-2">
            <span className="font-medium">Error</span>
          </div>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      ) : null}

      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
            <h2 className={`text-3xl font-bold ${statusClass}`}>{statusLabel}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <MetricCard
              label="Total Revenue"
              value={formatCurrency(data.totalRevenue)}
            />
            <MetricCard
              label="Total Expenses"
              value={formatCurrency(data.totalExpenses)}
            />
            <MetricCard
              label="Net Profit"
              value={formatCurrency(data.netProfit)}
            />
            <MetricCard
              label="Profit Margin"
              value={formatPercent(data.profitMargin)}
            />
            <MetricCard
              label="Total Transactions"
              value={formatNumber(data.totalTransactions)}
            />
            <MetricCard
              label="Revenue Count"
              value={formatNumber(data.revenueCount)}
            />
            <MetricCard
              label="Expense Count"
              value={formatNumber(data.expenseCount)}
            />
          </div>
        </>
      )}
    </AppShell>
  );
}
