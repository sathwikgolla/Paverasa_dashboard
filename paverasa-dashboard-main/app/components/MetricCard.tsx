type MetricCardProps = {
  label: string;
  value: string;
};

export default function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 hover:shadow-sm transition-all duration-200">
      <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">{label}</h3>
      <p className="text-2xl font-semibold text-slate-900 tracking-tight">{value}</p>
    </div>
  );
}
