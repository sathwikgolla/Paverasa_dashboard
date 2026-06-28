import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8 text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-2">Paverasa ERP</h1>
        <p className="text-gray-500 mb-8">
          Finance management for your organization
        </p>

        <div className="space-y-4">
          <Link
            className="block w-full bg-green-600 text-white px-5 py-3 rounded-lg"
            href="/login"
          >
            Sign In
          </Link>
          <Link
            className="block w-full bg-slate-800 text-white px-5 py-3 rounded-lg"
            href="/register"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
