"use client";

import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import MetricCard from "../components/MetricCard";
import EnhancedKPICard from "../components/EnhancedKPICard";
import BusinessCharts from "../components/BusinessCharts";
import { formatCurrency, formatPercent } from "../lib/client-format";
import NotificationBell from "../components/NotificationBell";
import UserProfile from "../components/UserProfile";
import { parseDateRange } from "../lib/date-range";
import { DollarSign, TrendingUp, Users, FileText, CreditCard, AlertCircle } from "lucide-react";

type DashboardData = {
  kpis: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: number;
    cashBalance: number;
    outstandingPayments: number;
    pendingBills: number;
    revenueTargetAchievement: number;
    activeClients: number;
    newClients: number;
    averageTransactionValue: number;
    invoicesGenerated: number;
    invoicesPaid: number;
    invoicesPending: number;
  };
  comparisons: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: number;
    activeClients: number;
    averageTransactionValue: number;
  };
  charts: {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
    growth: number;
  }[];
  recentTransactions: {
    date: string;
    type: string;
    amount: number;
    party: string;
    status: string;
    department?: string;
    invoice_number?: string;
    payment_mode?: string;
  }[];
  insights: string[];
};

const emptyDashboard: DashboardData = {
  kpis: {
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    cashBalance: 0,
    outstandingPayments: 0,
    pendingBills: 0,
    revenueTargetAchievement: 0,
    activeClients: 0,
    newClients: 0,
    averageTransactionValue: 0,
    invoicesGenerated: 0,
    invoicesPaid: 0,
    invoicesPending: 0,
  },
  comparisons: {
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    activeClients: 0,
    averageTransactionValue: 0,
  },
  charts: [],
  recentTransactions: [],
  insights: [],
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>(emptyDashboard);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateFilter, setDateFilter] = useState("Last 30 Days");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        setError("");
        const range = parseDateRange(dateFilter);
        const response = await fetch(`/api/dashboard?range=${range}`, { cache: "no-store" });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Unable to load dashboard.");
        }

        if (isMounted) {
          setData(result);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load dashboard.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [dateFilter]);

  return (
    <AppShell 
      showDateFilter={true}
      dateFilter={dateFilter}
      onDateFilterChange={setDateFilter}
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Finance Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Real-time financial insights and analytics
        </p>
      </div>

      {error ? (
        <div className="bg-white border border-red-200 rounded-lg p-4 mb-6 text-red-600">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error</span>
          </div>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[...Array(14)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 animate-pulse">
              <div className="h-3 bg-slate-200 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-slate-200 rounded w-2/3 mb-4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <EnhancedKPICard
              label="Total Revenue"
              value={formatCurrency(data.kpis.totalRevenue)}
              previousValue={formatCurrency(data.comparisons.totalRevenue)}
              percentageChange={data.comparisons.totalRevenue > 0 
                ? ((data.kpis.totalRevenue - data.comparisons.totalRevenue) / data.comparisons.totalRevenue) * 100 
                : 0}
              trend={data.kpis.totalRevenue >= data.comparisons.totalRevenue ? "up" : "down"}
              icon={<DollarSign className="w-5 h-5" />}
              accent="emerald"
              sparkline={data.charts.slice(-7).map(c => c.revenue)}
            />
            <EnhancedKPICard
              label="Total Expenses"
              value={formatCurrency(data.kpis.totalExpenses)}
              previousValue={formatCurrency(data.comparisons.totalExpenses)}
              percentageChange={data.comparisons.totalExpenses > 0 
                ? ((data.kpis.totalExpenses - data.comparisons.totalExpenses) / data.comparisons.totalExpenses) * 100 
                : 0}
              trend={data.kpis.totalExpenses <= data.comparisons.totalExpenses ? "up" : "down"}
              icon={<TrendingUp className="w-5 h-5" />}
              accent="red"
              sparkline={data.charts.slice(-7).map(c => c.expenses)}
            />
            <EnhancedKPICard
              label="Net Profit"
              value={formatCurrency(data.kpis.netProfit)}
              previousValue={formatCurrency(data.comparisons.netProfit)}
              percentageChange={data.comparisons.netProfit > 0 
                ? ((data.kpis.netProfit - data.comparisons.netProfit) / Math.abs(data.comparisons.netProfit)) * 100 
                : 0}
              trend={data.kpis.netProfit >= data.comparisons.netProfit ? "up" : "down"}
              icon={<DollarSign className="w-5 h-5" />}
              accent="blue"
              sparkline={data.charts.slice(-7).map(c => c.profit)}
            />
            <EnhancedKPICard
              label="Profit Margin"
              value={formatPercent(data.kpis.profitMargin)}
              previousValue={formatPercent(data.comparisons.profitMargin)}
              percentageChange={data.kpis.profitMargin - data.comparisons.profitMargin}
              trend={data.kpis.profitMargin >= data.comparisons.profitMargin ? "up" : "down"}
              icon={<TrendingUp className="w-5 h-5" />}
              accent="purple"
            />
            <EnhancedKPICard
              label="Cash Balance"
              value={formatCurrency(data.kpis.cashBalance)}
              icon={<CreditCard className="w-5 h-5" />}
              accent="emerald"
            />
            <EnhancedKPICard
              label="Outstanding Payments"
              value={formatCurrency(data.kpis.outstandingPayments)}
              icon={<AlertCircle className="w-5 h-5" />}
              accent="orange"
            />
            <EnhancedKPICard
              label="Active Clients"
              value={data.kpis.activeClients.toString()}
              previousValue={data.comparisons.activeClients.toString()}
              percentageChange={data.comparisons.activeClients > 0 
                ? ((data.kpis.activeClients - data.comparisons.activeClients) / data.comparisons.activeClients) * 100 
                : 0}
              trend={data.kpis.activeClients >= data.comparisons.activeClients ? "up" : "down"}
              icon={<Users className="w-5 h-5" />}
              accent="blue"
            />
            <EnhancedKPICard
              label="Revenue Target Achievement"
              value={formatPercent(data.kpis.revenueTargetAchievement)}
              icon={<TrendingUp className="w-5 h-5" />}
              accent="emerald"
            />
            <EnhancedKPICard
              label="New Clients"
              value={data.kpis.newClients.toString()}
              trend={data.kpis.newClients > 0 ? "up" : "neutral"}
              icon={<Users className="w-5 h-5" />}
              accent="blue"
            />
            <EnhancedKPICard
              label="Average Transaction Value"
              value={formatCurrency(data.kpis.averageTransactionValue)}
              previousValue={formatCurrency(data.comparisons.averageTransactionValue)}
              percentageChange={data.comparisons.averageTransactionValue > 0 
                ? ((data.kpis.averageTransactionValue - data.comparisons.averageTransactionValue) / data.comparisons.averageTransactionValue) * 100 
                : 0}
              trend={data.kpis.averageTransactionValue >= data.comparisons.averageTransactionValue ? "up" : "down"}
              icon={<DollarSign className="w-5 h-5" />}
              accent="purple"
            />
            <EnhancedKPICard
              label="Invoices Generated"
              value={data.kpis.invoicesGenerated.toString()}
              icon={<FileText className="w-5 h-5" />}
              accent="slate"
            />
            <EnhancedKPICard
              label="Invoices Paid"
              value={data.kpis.invoicesPaid.toString()}
              icon={<FileText className="w-5 h-5" />}
              accent="emerald"
            />
            <EnhancedKPICard
              label="Invoices Pending"
              value={data.kpis.invoicesPending.toString()}
              icon={<AlertCircle className="w-5 h-5" />}
              accent="orange"
            />
            <EnhancedKPICard
              label="Pending Bills"
              value={formatCurrency(data.kpis.pendingBills)}
              icon={<AlertCircle className="w-5 h-5" />}
              accent="red"
            />
          </div>

          <BusinessCharts 
            monthlyData={data.charts}
            departmentData={[]}
            clientData={[]}
            paymentStatusData={[]}
            paymentModeData={[]}
          />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-green-600 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Recent Transactions
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-700">
                      <th className="py-3 font-semibold">Date</th>
                      <th className="py-3 font-semibold">Type</th>
                      <th className="py-3 font-semibold">Party</th>
                      <th className="py-3 font-semibold">Department</th>
                      <th className="py-3 font-semibold">Invoice #</th>
                      <th className="py-3 font-semibold">Amount</th>
                      <th className="py-3 font-semibold">Payment Mode</th>
                      <th className="py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentTransactions.map((transaction, index) => (
                      <tr
                        key={`${transaction.type}-${transaction.date}-${index}`}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 text-gray-900">{transaction.date}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.type === 'Revenue' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="py-3 text-gray-900">{transaction.party}</td>
                        <td className="py-3 text-gray-900">{transaction.department || '-'}</td>
                        <td className="py-3 text-gray-900">
                          {transaction.invoice_number ? (
                            <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                              {transaction.invoice_number}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="py-3 text-gray-900 font-medium">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="py-3 text-gray-900">{transaction.payment_mode || '-'}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.status === 'Paid' || transaction.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : transaction.status === 'Pending' || transaction.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-green-600 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Financial Insights
              </h2>
              <ul className="space-y-3 text-gray-700">
                {data.insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
