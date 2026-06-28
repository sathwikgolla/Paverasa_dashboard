"use client";

import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import { ROLES } from "../lib/roles";

type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function SettingsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [roleDescription, setRoleDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const result = await response.json();

        if (response.ok) {
          setUser(result.user);
          setRoleDescription(result.roleDescription || "");
        }
      } finally {
        setIsLoading(false);
      }
    }

    void loadUser();
  }, []);

  if (isLoading) {
    return (
      <AppShell>
        <div className="text-gray-700">Loading settings...</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-green-600">Settings</h1>
        <p className="text-gray-500">Configure application access and roles</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4 text-green-600">Current User</h2>
          <dl className="space-y-3 text-gray-900">
            <div>
              <dt className="text-gray-500">Name</dt>
              <dd className="font-semibold">{user?.name}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Email</dt>
              <dd className="font-semibold">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Role</dt>
              <dd className="font-semibold">{user?.role}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4 text-green-600">User Roles</h2>
          <div className="space-y-4 text-gray-900">
            <div>
              <h3 className="font-semibold">{ROLES.ADMIN} (Founder)</h3>
              <p className="text-gray-600 text-sm">
                Full access, manage all modules, view reports, configure settings
              </p>
            </div>
            <div>
              <h3 className="font-semibold">{ROLES.FINANCE_MANAGER}</h3>
              <p className="text-gray-600 text-sm">
                Add revenue, add expenses, generate reports
              </p>
            </div>
            <div>
              <h3 className="font-semibold">{ROLES.EMPLOYEE}</h3>
              <p className="text-gray-600 text-sm">
                View dashboard only, limited access
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mt-6">
        <h2 className="text-xl font-bold mb-2 text-green-600">Your Access</h2>
        <p className="text-gray-700">{roleDescription}</p>
      </div>
    </AppShell>
  );
}
