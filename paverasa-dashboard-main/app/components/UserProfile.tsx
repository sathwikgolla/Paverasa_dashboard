"use client";

import { useEffect, useRef, useState } from "react";
import { User, ChevronDown, Settings, LogOut } from "lucide-react";

type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function UserProfile() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SessionUser | null>(null);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/session");

        if (!response.ok) {
          console.error("Session request failed:", response.status);
          return;
        }

        const data = await response.json();

        console.log("Session Response:", data);

        // Handles both response formats:
        // { user: {...} } OR { id, name, email, role }
        setUser(data.user ?? data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () =>
      document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const initials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "U";

  async function handleLogout() {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (response.ok) {
      window.location.href = "/login";
    }
  }

  return (
    <div className="relative z-[9999]" ref={profileRef}>
      <button
        onClick={() => {
          console.log("Profile clicked");
          setOpen((prev) => !prev);
        }}
        className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-100"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white font-semibold">
          {initials}
        </div>

        <div className="hidden text-left md:block">
          <p className="font-semibold">
            {loading ? "Loading..." : user?.name ?? "User"}
          </p>

          <p className="text-xs text-gray-500">
            {user?.role ?? ""}
          </p>
        </div>

        <ChevronDown size={18} />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-72 rounded-xl border border-gray-200 bg-white shadow-2xl z-[9999]">
          <div className="border-b p-4">
            <p className="font-semibold">
              {user?.name ?? "User"}
            </p>

            <p className="text-sm text-gray-500">
              {user?.email ?? ""}
            </p>

            <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              {user?.role ?? ""}
            </span>
          </div>

          <button className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-50">
            <User size={18} />
            Profile
          </button>

          <button className="flex w-full items-center gap-3 px-4 py-3 hover:bg-gray-50">
            <Settings size={18} />
            Settings
          </button>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}