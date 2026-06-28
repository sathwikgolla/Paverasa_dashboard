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

interface RevenueService {
  service_name: string;
  revenue: number;
}

const COLORS = [
  "#16a34a",
  "#22c55e",
  "#4ade80",
  "#86efac",
  "#15803d",
  "#65a30d",
];

export default function RevenueByServiceChart() {
  const [data, setData] = useState<RevenueService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/analytics/revenue-by-service");
        const result = await res.json();

        console.log("Revenue by Service:", result);

        if (Array.isArray(result)) {
          const formattedData = result.map((item: any) => ({
            service_name: item.service_name,
            revenue: Number(item.revenue),
          }));

          setData(formattedData);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error(error);
        setData([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      <h2 className="text-2xl font-bold text-green-600 mb-6">
        Revenue by Service
      </h2>

      {/* Loading */}

      {loading ? (
        <div className="flex items-center justify-center h-[320px] text-gray-500">
          Loading...
        </div>
      ) : data.length === 0 ? (

        /* Empty Data */

        <div className="flex items-center justify-center h-[320px] text-gray-500 text-lg">
          No revenue data available.
        </div>

      ) : (

        /* Pie Chart */

        <ResponsiveContainer width="100%" height={320}>

          <PieChart>

            <Pie
              data={data}
              dataKey="revenue"
              nameKey="service_name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
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
                "Revenue",
              ]}
            />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      )}

    </div>
  );
}