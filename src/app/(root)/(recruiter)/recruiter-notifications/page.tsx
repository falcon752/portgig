"use client";

import { useEffect, useState } from "react";
import {
  NotificationService,
  Notification,
} from "@/src/lib/requests/notifications";
import { NotificationItem } from "@/src/components/Notification-items";

export default function RecruiterNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setError(null);
      const response = await NotificationService.getNotifications("Recruiter");
      setNotifications(response.data.page_data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
          <button
            onClick={fetchNotifications}
            className="ml-4 text-sm bg-red-100 px-2 py-1 rounded hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔔</div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            No notifications yet
          </h2>
          <p className="text-gray-500">
            We&rsquo;ll notify you when something important happens.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
            />
          ))}
        </div>
      )}
    </div>
  );
}
