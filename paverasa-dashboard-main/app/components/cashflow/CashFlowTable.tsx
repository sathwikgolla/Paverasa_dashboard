"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "../../lib/client-format";

interface Transaction {
  date: string;
  type: string;
  description: string;
  amount: number;
}

interface CashFlowTableProps {
  dateFilter?: string;
}

export default function CashFlowTable({ dateFilter = "30d" }: CashFlowTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch(`/api/cash-flow?range=${dateFilter}`, { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const result = await response.json();

        setTransactions(result.transactions ?? []);
      } catch (error) {
        console.error("Transaction Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [dateFilter]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">
        Cash Flow Transactions
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-slate-200 border-t-emerald-600"></div>
          <span className="ml-3 text-sm text-slate-600">Loading transactions...</span>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          No transactions found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr className="text-slate-700">
                <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">Type</th>
                <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider">Description</th>
                <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-slate-900">
                    {transaction.date}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        transaction.type === "Revenue"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-900">
                    {transaction.description}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-slate-900">
                    {formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}