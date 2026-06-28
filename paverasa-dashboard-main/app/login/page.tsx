"use client";

import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-700">
          Loading login...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
