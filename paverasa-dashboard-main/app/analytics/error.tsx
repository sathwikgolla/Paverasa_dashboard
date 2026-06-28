"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-red-600">
        Analytics Error
      </h1>

      <p className="mt-4 text-gray-700">
        {error.message}
      </p>

      <button
        onClick={() => reset()}
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
      >
        Try Again
      </button>
    </div>
  );
}