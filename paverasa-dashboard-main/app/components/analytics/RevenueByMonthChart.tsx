"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface RevenueData {
  month: string;
  revenue: number;
}

export default function RevenueByMonthChart() {
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/analytics/monthly-revenue");
        const result = await res.json();
        setData(result);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-green-600 mb-6">
        Revenue by Month
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading chart...</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip
                formatter={(value) => [
                    `₹${Number(value).toLocaleString()}`,
                    "Revenue",
                ]}
            />

            <Bar
              dataKey="revenue"
              fill="#16a34a"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}