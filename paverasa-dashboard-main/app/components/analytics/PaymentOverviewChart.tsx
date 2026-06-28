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

interface PaymentData {
  payment_status: string;
  total: number;
}

const COLORS = ["#16a34a", "#ef4444"];

export default function PaymentOverviewChart() {
  const [data, setData] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/analytics/payment-overview");
        const result = await res.json();

        if (Array.isArray(result)) {
          setData(
            result.map((item: any) => ({
              payment_status: item.payment_status,
              total: Number(item.total),
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
    <div className="bg-white rounded-xl shadow-lg p-6 w-[580px]">

      <h2 className="text-2xl font-bold text-green-600 mb-6">
        Payment Overview
      </h2>

      {loading ? (
        <div className="h-[320px] flex items-center justify-center">
          Loading...
        </div>
      ) : data.length === 0 ? (
        <div className="h-[320px] flex items-center justify-center text-gray-500">
          No payment data available.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="payment_status"
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

            <Tooltip />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}

    </div>
  );
}