"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "Revenue target achieved",
    time: "5 mins ago",
  },
  {
    id: 2,
    title: "New payment received",
    time: "20 mins ago",
  },
  {
    id: 3,
    title: "2 pending bills",
    time: "1 hour ago",
  },
];

export default function NotificationBell() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-full p-2 hover:bg-gray-100"
      >
        <Bell className="w-6 h-6 text-gray-700" />

        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {notifications.length}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 rounded-xl border bg-white shadow-lg z-50">
          <div className="border-b p-4">
            <h3 className="font-semibold">Notifications</h3>
          </div>

          {notifications.map((item) => (
            <div
              key={item.id}
              className="border-b p-4 hover:bg-gray-50"
            >
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-500">{item.time}</p>
            </div>
          ))}

          <div className="p-3 text-center">
            <button className="text-green-600 hover:underline">
              View All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}