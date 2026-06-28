"use client";

import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import AnalyticsCards from "../components/analytics/AnalyticsCards";
import { formatCurrency, formatPercent } from "../lib/client-format";

import RevenueByMonthChart from "../components/analytics/RevenueByMonthChart";
import RevenueByServiceChart from "../components/analytics/RevenueByServiceChart";
import RevenueByDepartmentChart from "../components/analytics/RevenueByDepartmentChart";
import RevenueByClientChart from "../components/analytics/RevenueByClientChart";

import ExpenseByCategoryChart from "../components/analytics/ExpenseByCategoryChart";
import ExpenseTrendChart from "../components/analytics/ExpenseTrendChart";

import MonthlyProfitChart from "../components/analytics/MonthlyProfitChart";
import ProfitMarginChart from "../components/analytics/ProfitMarginChart";

import PaymentOverviewChart from "../components/analytics/PaymentOverviewChart";

type AnalyticsData = {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch("/api/profit-loss", { cache: "no-store" });
        const result = await response.json();

        if (response.ok) {
          setData(result);
        }
      } catch (error) {
        console.error("Analytics Error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  const kpis = [
    { title: "Total Revenue", value: formatCurrency(data.totalRevenue), color: "green" },
    { title: "Total Expenses", value: formatCurrency(data.totalExpenses), color: "red" },
    { title: "Net Profit", value: formatCurrency(data.netProfit), color: data.netProfit >= 0 ? "green" : "red" },
    { title: "Profit Margin", value: formatPercent(data.profitMargin), color: "green" },
  ];

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Analytics Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Financial insights and business analytics
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 animate-pulse">
              <div className="h-3 bg-slate-200 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-slate-200 rounded w-2/3"></div>
            </div>
          ))
        ) : (
          kpis.map((item) => (
            <AnalyticsCards
              key={item.title}
              title={item.title}
              value={item.value}
              color={item.color}
            />
          ))
        )}
      </div>

      {/* Revenue Analytics */}
      <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-6">
        Revenue Analytics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RevenueByMonthChart />
        <RevenueByServiceChart />
        <RevenueByDepartmentChart />
        <RevenueByClientChart />
      </div>

      {/* Expense Analytics */}
      <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-6">
        Expense Analytics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ExpenseByCategoryChart />
        <ExpenseTrendChart />
      </div>

      {/* Profit Analytics */}
      <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-6">
        Profit Analytics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <MonthlyProfitChart />
        <ProfitMarginChart />
      </div>

      {/* Payment Analytics */}
      <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-6">
        Payment Analytics
      </h2>

      <div className="grid grid-cols-1">
        <PaymentOverviewChart />
      </div>
    </AppShell>
  );
}