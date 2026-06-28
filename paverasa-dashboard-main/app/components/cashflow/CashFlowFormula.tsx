"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "../../lib/client-format";

export default function CashFlowFormula() {
  const [data, setData] = useState({
    openingBalance: 0,
    cashIn: 0,
    cashOut: 0,
    closingBalance: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCashFlow() {
      try {
        const response = await fetch("/api/cash-flow", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Failed to fetch cash flow data");
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching cash flow:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCashFlow();
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">
        Cash Balance Formula
      </h2>

      {loading ? (
        <div className="text-slate-500">Loading...</div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Opening Balance</span>
            <span className="font-medium text-slate-900">{formatCurrency(data.openingBalance)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-emerald-600">+ Revenue</span>
            <span className="font-medium text-emerald-600">{formatCurrency(data.cashIn)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-red-600">- Expenses</span>
            <span className="font-medium text-red-600">{formatCurrency(data.cashOut)}</span>
          </div>

          <div className="border-t border-slate-200 pt-4 mt-4">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-900">Closing Balance</span>
              <span className="font-semibold text-slate-900">{formatCurrency(data.closingBalance)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}