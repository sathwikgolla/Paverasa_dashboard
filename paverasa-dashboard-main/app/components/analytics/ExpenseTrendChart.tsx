"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface ExpenseTrend {
  month: string;
  expenses: number;
}

export default function ExpenseTrendChart() {
  const [data, setData] = useState<ExpenseTrend[]>([]);

  useEffect(() => {
    async function loadData() {
      const res = await fetch("/api/analytics/expense-trend");
      const result = await res.json();

      if (Array.isArray(result)) {
        setData(
          result.map((item: any) => ({
            month: item.month,
            expenses: Number(item.expenses),
          }))
        );
      }
    }

    loadData();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-green-600 mb-6">
        Expense Trend
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#dc2626"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}