"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ClientRevenue {
  client_name: string;
  revenue: number;
}

export default function RevenueByClientChart() {
  const [data, setData] = useState<ClientRevenue[]>([]);

  useEffect(() => {
    async function loadData() {
      const res = await fetch("/api/analytics/revenue-by-client");
      const result = await res.json();

      if (Array.isArray(result)) {
        setData(result);
      }
    }

    loadData();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      <h2 className="text-2xl font-bold text-green-600 mb-6">
        Revenue by Client
      </h2>

      <ResponsiveContainer width="100%" height={320}>

        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3"/>

          <XAxis
            dataKey="client_name"
            angle={-20}
            textAnchor="end"
            height={70}
          />

          <YAxis/>

          <Tooltip/>

          <Bar
            dataKey="revenue"
            fill="#16a34a"
            radius={[6,6,0,0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}