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
  Legend,
} from "recharts";

interface CashFlowChartProps {
  dateFilter?: string;
}

export default function CashFlowChart({ dateFilter = "30d" }: CashFlowChartProps) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChart() {
      try {
        const response = await fetch(`/api/cash-flow?range=${dateFilter}`, { cache: "no-store" });
        const result = await response.json();

        setChartData(result.chartData ?? []);
      } catch (error) {
        console.error("Chart Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchChart();
  }, [dateFilter]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">
        Cash Flow Trend
      </h2>

      <div className="h-80">
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-500">
            Loading...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                name="Cash In"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                strokeWidth={2}
                name="Cash Out"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}