"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface DepartmentRevenue {
  department: string;
  revenue: number;
}

export default function RevenueByDepartmentChart() {
  const [data, setData] = useState<DepartmentRevenue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/analytics/revenue-by-department");
        const result = await res.json();

        if (Array.isArray(result)) {
          setData(
            result.map((item: any) => ({
              department: item.department,
              revenue: Number(item.revenue),
            }))
          );
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
        Revenue by Department
      </h2>

      {loading ? (
        <div className="h-[320px] flex items-center justify-center">
          Loading...
        </div>
      ) : data.length === 0 ? (
        <div className="h-[320px] flex items-center justify-center text-gray-500">
          No revenue data available.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="department" />

            <YAxis />

            <Tooltip
              formatter={(value) => [
                `₹ ${Number(value).toLocaleString()}`,
                "Revenue",
              ]}
            />

            <Bar
              dataKey="revenue"
              fill="#16a34a"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}

    </div>
  );
}