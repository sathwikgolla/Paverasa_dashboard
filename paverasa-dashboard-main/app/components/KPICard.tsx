type KPICardProps = {
  title: string;
  value: string | number;
  description: string;
};

export default function KPICard({
  title,
  value,
  description,
}: KPICardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-7 hover:shadow-lg transition">
      <h3 className="text-3xl font-medium text-gray-600">
        {title}
      </h3>

      <p className="text-5xl font-bold text-green-700 mt-4 mb-4">
        {value}
      </p>

      <p className="text-gray-500 text-lg">
        {description}
      </p>
    </div>
  );
}