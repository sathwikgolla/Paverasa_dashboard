import { Suspense } from "react";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-700">
          Loading registration...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
