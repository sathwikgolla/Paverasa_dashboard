"use client";

import { useEffect, useState } from "react";
import KPICard from "../components/KPICard";

export default function KPIPage() {
  const [kpi, setKpi] = useState<any>(null);

  useEffect(() => {
    fetch("/api/kpi")
      .then((res) => res.json())
      .then((data) => setKpi(data))
      .catch((err) => console.error(err));
  }, []);

  if (!kpi) {
    return (
      <p className="p-6 text-lg font-semibold text-green-700">
        Loading KPIs...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold text-green-700 mb-8">
        🎯 KPI Engine Dashboard
      </h1>

      {/* Revenue KPIs */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-green-700 mb-6">
          📈 Revenue KPIs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <KPICard
            title="Total Revenue"
            value={`₹${kpi.totalRevenue}`}
            description="Overall Revenue"
          />

          <KPICard
            title="Monthly Revenue"
            value={`₹${kpi.monthlyRevenue}`}
            description="Current Month Revenue"
          />

          <KPICard
            title="Revenue Growth"
            value={`${Number(kpi.revenueGrowth).toFixed(2)}%`}
            description="Compared to Last Month"
          />

          <KPICard
            title="Target Achievement"
            value={`${Number(kpi.targetAchievement).toFixed(2)}%`}
            description="Current Month Target"
          />

        </div>
      </section>

      {/* Expense KPIs */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-green-700 mb-6">
          💸 Expense KPIs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <KPICard
            title="Total Expenses"
            value={`₹${kpi.totalExpenses}`}
            description="Overall Expenses"
          />

          <KPICard
            title="Expense Growth"
            value={`${Number(kpi.expenseGrowth).toFixed(2)}%`}
            description="Compared to Last Month"
          />

        </div>
      </section>

      {/* Profit KPIs */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-green-700 mb-6">
          📊 Profit KPIs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <KPICard 
            title="Net Profit"
            value={`₹${kpi.netProfit}`}
            description="Revenue - Expenses"
          />

          <KPICard
            title="Profit Margin"
            value={`${Number(kpi.profitMargin).toFixed(2)}%`}
            description="Overall Profit Margin"
          />

        </div>
      </section>

      {/* Cash KPIs */}
      <section>
        <h2 className="text-2xl font-semibold text-green-700 mb-6">
          💰 Cash KPIs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <KPICard
            title="Cash Balance"
            value={`₹${kpi.cashBalance}`}
            description="Available Cash"
          />

          <KPICard
            title="Cash Burn Rate"
            value={`₹${Number(kpi.cashBurnRate).toFixed(2)}`}
            description="Average Monthly Expenses"
          />

        </div>
      </section>

    </div>
  );
}