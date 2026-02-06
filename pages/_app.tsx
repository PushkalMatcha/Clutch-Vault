import { NotificationProvider } from "@/context/NotificationContext";
import { useNotification } from "@/context/NotificationContext";
import { Bell } from "lucide-react";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NotificationProvider>
      <Component {...pageProps} />
    </NotificationProvider>
  );
}

export function Navbar() {
  const { notifications, markAllAsRead } = useNotification();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={markAllAsRead}
        className="relative flex items-center justify-center h-8 w-8 rounded-full bg-steel-dark text-white hover:bg-steel-gray"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
        )}
      </button>
      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-80 bg-steel-dark rounded-lg shadow-lg">
        <div className="p-4 font-semibold text-white">Notifications</div>
        <div>
          {notifications.length === 0 ? (
            <div className="p-4 text-muted-foreground">No notifications</div>
          ) : (
            notifications.map((notification, idx) => (
              <div
                key={idx}
                className={`p-4 border-b border-steel-gray ${
                  !notification.read ? "bg-black/30" : ""
                }`}
              >
                <div className="font-semibold">{notification.title}</div>
                <div className="text-xs text-muted-foreground">{notification.content}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MyApp;