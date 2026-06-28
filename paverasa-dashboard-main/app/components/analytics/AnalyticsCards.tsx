"use client";

interface AnalyticsCardsProps {
  title: string;
  value: string | number;
  color?: string;
}

export default function AnalyticsCards({
  title,
  value,
  color = "green",
}: AnalyticsCardsProps) {
  const accentColors: Record<string, string> = {
    green: "text-emerald-600",
    blue: "text-blue-600",
    red: "text-red-600",
    yellow: "text-amber-600",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 hover:shadow-sm transition-all duration-200">
      <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
        {title}
      </h3>
      <h1 className={`text-2xl font-semibold tracking-tight ${accentColors[color]}`}>
        {value}
      </h1>
    </div>
  );
}