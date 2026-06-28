"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const registered = searchParams.get("registered") === "1";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to sign in.");
      }

      const nextPath = searchParams.get("next") || "/dashboard";
      router.push(nextPath);
      router.refresh();
    } catch (loginError) {
      setError(
        loginError instanceof Error ? loginError.message : "Unable to sign in.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">Paverasa ERP</h1>
          <p className="text-gray-500 mb-8">Sign in to your account</p>

          {registered ? (
            <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6">
              Registration successful. Please sign in.
            </div>
          ) : null}

          {error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-gray-700">
              <span className="block mb-2">Email Address</span>
              <input
                className="w-full border rounded-lg p-3 text-gray-900"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
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
            </label>

            <button
              className="w-full bg-green-600 text-white px-5 py-3 rounded-lg disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-gray-500 text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link className="text-green-600 font-semibold" href="/register">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
