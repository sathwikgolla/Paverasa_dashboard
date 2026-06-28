"use client";

import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  BarChart,
  Bar,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type RevenueChartProps = {
  data: {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
    growth: number;
  }[];
};

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-green-600">{title}</h2>
      {children}
    </div>
  );
}

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
      <ChartCard title="Revenue Trend">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area dataKey="revenue" fill="#16a34a" stroke="#16a34a" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Expense Trend">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area dataKey="expenses" fill="#64748b" stroke="#64748b" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Profit Trend">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line dataKey="profit" stroke="#16a34a" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Revenue vs Expense">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#16a34a" />
            <Bar dataKey="expenses" fill="#64748b" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="xl:col-span-2">
        <ChartCard title="Monthly Growth">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line dataKey="growth" stroke="#16a34a" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
