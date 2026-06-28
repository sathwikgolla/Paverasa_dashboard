"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ExpenseCategory {
  category: string;
  expense: number;
}

const COLORS = [
  "#16a34a",
  "#22c55e",
  "#4ade80",
  "#86efac",
  "#15803d",
  "#65a30d",
];

export default function ExpenseByCategoryChart() {
  const [data, setData] = useState<ExpenseCategory[]>([]);

  useEffect(() => {
    async function loadData() {
      const res = await fetch("/api/analytics/expense-by-category");
      const result = await res.json();

      if (Array.isArray(result)) {
        setData(
          result.map((item: any) => ({
            category: item.category,
            expense: Number(item.expense),
          }))
        );
      }
    }

    loadData();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      <h2 className="text-2xl font-bold text-green-600 mb-6">
        Expense by Category
      </h2>

      {data.length === 0 ? (
        <div className="h-[320px] flex items-center justify-center text-gray-500">
          No expense data available.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>

            <Pie
              data={data}
              dataKey="expense"
              nameKey="category"
              outerRadius={90}
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [
                `₹ ${Number(value).toLocaleString()}`,
                "Expense",
              ]}
            />

            <Legend />

          </PieChart>
        </ResponsiveContainer>
      )}

    </div>
  );
}