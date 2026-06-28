"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "../../lib/client-format";

interface CashFlowSummaryProps {
  dateFilter?: string;
}

export default function CashFlowSummary({ dateFilter = "30d" }: CashFlowSummaryProps) {
  const [summary, setSummary] = useState({
    openingBalance: 0,
    cashIn: 0,
    cashOut: 0,
    closingBalance: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCashFlow() {
      try {
        const response = await fetch(`/api/cash-flow?range=${dateFilter}`, { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Failed to fetch cash flow");
        }

        const result = await response.json();

        setSummary(result);
      } catch (error) {
        console.error("Cash Flow Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCashFlow();
  }, [dateFilter]);

  const cards = [
    {
      title: "Opening Balance",
      value: summary.openingBalance,
      accent: "slate" as const,
    },
    {
      title: "Cash In",
      value: summary.cashIn,
      accent: "emerald" as const,
    },
    {
      title: "Cash Out",
      value: summary.cashOut,
      accent: "red" as const,
    },
    {
      title: "Closing Balance",
      value: summary.closingBalance,
      accent: "blue" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 hover:shadow-sm transition-all duration-200"
        >
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            {card.title}
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
            {loading ? "..." : formatCurrency(card.value)}
          </h2>
        </div>
      ))}
    </div>
  );
}