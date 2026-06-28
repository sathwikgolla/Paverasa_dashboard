"use client";

import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ['#16a34a', '#64748b', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

type BusinessChartsProps = {
  monthlyData: {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
    growth: number;
  }[];
  departmentData?: { department: string; revenue: number }[];
  clientData?: { client_name: string; revenue: number }[];
  paymentStatusData?: { payment_status: string; total: number }[];
  paymentModeData?: { payment_mode: string; total: number }[];
};

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow duration-200">
      <h2 className="text-xl font-bold mb-4 text-green-600">{title}</h2>
      {children}
    </div>
  );
}

export default function BusinessCharts({
  monthlyData,
  departmentData = [],
  clientData = [],
  paymentStatusData = [],
  paymentModeData = [],
}: BusinessChartsProps) {
  return (
    <div className="space-y-6 mt-8">
      {/* Revenue and Expense Trends */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard title="Revenue Trend">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              />
              <Area dataKey="revenue" fill="#16a34a" stroke="#16a34a" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Expense Trend">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Expenses']}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              />
              <Area dataKey="expenses" fill="#64748b" stroke="#64748b" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Revenue vs Expenses and Profit Trend */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard title="Revenue vs Expenses">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => `$${Number(value).toLocaleString()}`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#16a34a" name="Revenue" />
              <Bar dataKey="expenses" fill="#64748b" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Profit Trend">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Profit']}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              />
              <Line 
                dataKey="profit" 
                stroke="#16a34a" 
                strokeWidth={2}
                dot={{ fill: '#16a34a' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Department and Client Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard title="Revenue by Department">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={departmentData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="department" type="category" width={100} />
              <Tooltip 
                formatter={(value: any) => `$${Number(value).toLocaleString()}`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Clients">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={clientData.slice(0, 10)} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="client_name" type="category" width={120} />
              <Tooltip 
                formatter={(value: any) => `$${Number(value).toLocaleString()}`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              />
              <Bar dataKey="revenue" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Payment Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard title="Payment Status Distribution">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={paymentStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.payment_status}: ${(entry.percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="total"
              >
                {paymentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => Number(value)}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue by Payment Mode">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={paymentModeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.payment_mode}: ${(entry.percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="total"
              >
                {paymentModeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => Number(value)}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Cash Flow */}
      <div className="xl:col-span-2">
        <ChartCard title="Monthly Growth Rate">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'Growth']}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              />
              <Line 
                dataKey="growth" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ fill: '#f59e0b' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
