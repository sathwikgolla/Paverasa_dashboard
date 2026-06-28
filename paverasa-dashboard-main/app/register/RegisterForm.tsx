"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ROLES } from "../lib/roles";

const ROLE_OPTIONS = [
  {
    value: ROLES.FINANCE_MANAGER,
    title: "Finance Manager",
    description: "Add revenue, add expenses, and generate reports",
  },
  {
    value: ROLES.EMPLOYEE,
    title: "Employee",
    description: "View dashboard only with limited access",
  },
];

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(ROLES.FINANCE_MANAGER);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
          role,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          setFieldErrors(result.errors);
          throw new Error("Please correct the highlighted fields.");
        }

        throw new Error(result.error || "Unable to register.");
      }

      router.push("/login?registered=1");
      router.refresh();
    } catch (registerError) {
      setError(
        registerError instanceof Error
          ? registerError.message
          : "Unable to register.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">Paverasa ERP</h1>
          <p className="text-gray-500 mb-8">Create your account</p>

          {error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-gray-700">
              <span className="block mb-2">Full Name</span>
              <input
                className="w-full border rounded-lg p-3 text-gray-900"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
              {fieldErrors.name ? (
                <span className="text-sm text-red-600 mt-1 block">
                  {fieldErrors.name}
                </span>
              ) : null}
            </label>

            <label className="block text-gray-700">
              <span className="block mb-2">Email Address</span>
              <input
                className="w-full border rounded-lg p-3 text-gray-900"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              {fieldErrors.email ? (
                <span className="text-sm text-red-600 mt-1 block">
                  {fieldErrors.email}
                </span>
              ) : null}
            </label>

            <label className="block text-gray-700">
              <span className="block mb-2">Password</span>
              <input
                className="w-full border rounded-lg p-3 text-gray-900"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              {fieldErrors.password ? (
                <span className="text-sm text-red-600 mt-1 block">
                  {fieldErrors.password}
                </span>
              ) : null}
            </label>

            <label className="block text-gray-700">
              <span className="block mb-2">Confirm Password</span>
              <input
                className="w-full border rounded-lg p-3 text-gray-900"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
              {fieldErrors.confirmPassword ? (
                <span className="text-sm text-red-600 mt-1 block">
                  {fieldErrors.confirmPassword}
                </span>
              ) : null}
            </label>

            <div>
              <span className="block mb-3 text-gray-700">Role</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ROLE_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`border rounded-lg p-4 cursor-pointer ${
                      role === option.value
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        checked={role === option.value}
                        className="mt-1"
                        name="role"
                        type="radio"
                        value={option.value}
                        onChange={() => setRole(option.value)}
                      />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {option.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {option.description}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {fieldErrors.role ? (
                <span className="text-sm text-red-600 mt-1 block">
                  {fieldErrors.role}
                </span>
              ) : null}
            </div>

            <button
              className="w-full bg-green-600 text-white px-5 py-3 rounded-lg disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="text-gray-500 text-center mt-6">
            Already have an account?{" "}
            <Link className="text-green-600 font-semibold" href="/login">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
