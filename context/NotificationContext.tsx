"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Bell } from "lucide-react";

export interface Notification {
  title: string;
  content: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: { title: string; content: string }) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("inbox") || "[]");
    setNotifications(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("inbox", JSON.stringify(notifications));
  }, [notifications]);

  // Ensure notifications are synced with local storage and dynamically updated
  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem("inbox") || "[]");
    if (storedNotifications.length !== notifications.length) {
      setNotifications(storedNotifications);
    }
  }, [notifications]);

  // Extend the addNotification function to handle friend requests and tournament reminders
  const addNotification = (notification: { title: string; content: string }) => {
    setNotifications((prev) => [{ ...notification, read: false }, ...prev]);

    // Example: Handle specific notification types
    if (notification.title === "New Friend Request") {
      console.log("New friend request received.");
    } else if (notification.title === "Tournament Reminder") {
      console.log("Tournament reminder added.");
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within a NotificationProvider");
  return context;
}

export function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const { notifications, markAllAsRead } = useNotification();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav>
      {/* Other navbar code */}
      {isLoggedIn && (
        <div className="relative">
          <button
            onClick={() => {
              // When opening your notifications dropdown, mark them all as read:
              markAllAsRead();
            }}
            className="relative flex items-center justify-center h-8 w-8 rounded-full bg-steel-dark text-white hover:bg-steel-gray"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
            )}
          </button>
          {/* Render your dropdown content here */}
        </div>
      )}
    </nav>
  );
}