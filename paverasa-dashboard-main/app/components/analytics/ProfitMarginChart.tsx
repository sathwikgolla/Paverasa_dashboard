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

interface ProfitMargin {
  month: string;
  margin: number;
}

export default function ProfitMarginChart() {
  const [data, setData] = useState<ProfitMargin[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/analytics/profit-margin");
        const result = await res.json();

        if (Array.isArray(result)) {
          setData(
            result.map((item: any) => ({
              month: item.month,
              margin: Number(item.margin),
            }))
          );
        } else {
          setData([]);
        }
      } catch (error) {
        console.error(error);
        setData([]);
      }
    }

    loadData();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      <h2 className="text-2xl font-bold text-green-600 mb-6">
        Profit Margin Trend
      </h2>

      {data.length === 0 ? (
        <div className="h-[320px] flex items-center justify-center text-gray-500">
          No profit margin data available.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis unit="%" />

            <Tooltip
              formatter={(value) => [`${value}%`, "Profit Margin"]}
            />

            <Line
              type="monotone"
              dataKey="margin"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 5 }}
            />

          </LineChart>
        </ResponsiveContainer>
      )}

    </div>
  );
}