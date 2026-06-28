import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface EnhancedKPICardProps {
  label: string;
  value: string;
  previousValue?: string;
  percentageChange?: number;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  accent?: "emerald" | "blue" | "purple" | "orange" | "red" | "slate";
  sparkline?: number[];
}

const accentColors = {
  emerald: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600 bg-emerald-100",
    trend: "text-emerald-600 bg-emerald-100",
    chart: "#10b981"
  },
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600 bg-blue-100",
    trend: "text-blue-600 bg-blue-100",
    chart: "#3b82f6"
  },
  purple: {
    bg: "bg-purple-50",
    icon: "text-purple-600 bg-purple-100",
    trend: "text-purple-600 bg-purple-100",
    chart: "#8b5cf6"
  },
  orange: {
    bg: "bg-orange-50",
    icon: "text-orange-600 bg-orange-100",
    trend: "text-orange-600 bg-orange-100",
    chart: "#f97316"
  },
  red: {
    bg: "bg-red-50",
    icon: "text-red-600 bg-red-100",
    trend: "text-red-600 bg-red-100",
    chart: "#ef4444"
  },
  slate: {
    bg: "bg-slate-50",
    icon: "text-slate-600 bg-slate-100",
    trend: "text-slate-600 bg-slate-100",
    chart: "#64748b"
  },
};

export default function EnhancedKPICard({
  label,
  value,
  previousValue,
  percentageChange,
  trend,
  icon,
  accent = "emerald",
  sparkline,
}: EnhancedKPICardProps) {
  const colors = accentColors[accent];

  const getTrendIcon = () => {
    if (trend === "up") return <ArrowUpRight className="w-3.5 h-3.5" />;
    if (trend === "down") return <ArrowDownRight className="w-3.5 h-3.5" />;
    return <Minus className="w-3.5 h-3.5" />;
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-emerald-600 bg-emerald-50";
    if (trend === "down") return "text-red-600 bg-red-50";
    return "text-slate-600 bg-slate-50";
  };

  const getTrendTextColor = () => {
    if (trend === "up") return "text-emerald-600";
    if (trend === "down") return "text-red-600";
    return "text-slate-500";
  };

  const renderSparkline = () => {
    if (!sparkline || sparkline.length < 2) return null;
    
    const max = Math.max(...sparkline);
    const min = Math.min(...sparkline);
    const range = max - min || 1;
    
    const points = sparkline.map((val, i) => {
      const x = (i / (sparkline.length - 1)) * 100;
      const y = 100 - ((val - min) / range) * 100;
      return `${x},${y}`;
    }).join(" ");

    return (
      <svg className="w-full h-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={colors.chart}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div 
      className="bg-white rounded-xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-semibold text-slate-900 tracking-tight">{value}</p>
        </div>
        {icon && (
          <div className={`p-2 rounded-lg ${colors.icon}`}>
            {icon}
          </div>
        )}
      </div>

      {sparkline && sparkline.length >= 2 && (
        <div className="mb-3 opacity-60">
          {renderSparkline()}
        </div>
      )}

      {(previousValue !== undefined || percentageChange !== undefined) && (
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md ${getTrendColor()}`}>
            {getTrendIcon()}
            {percentageChange !== undefined && (
              <span className={`text-xs font-semibold ${getTrendTextColor()}`}>
                {percentageChange > 0 ? "+" : ""}{percentageChange.toFixed(1)}%
              </span>
            )}
          </div>
          {previousValue !== undefined && (
            <span className="text-xs text-slate-500">
              vs {previousValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
