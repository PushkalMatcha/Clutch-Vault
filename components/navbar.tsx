"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut, Settings, Users, Twitter, Instagram, Mail } from "lucide-react";
import { isUserLoggedIn } from "@/utils/auth";
import { useNotification } from "@/context/NotificationContext";
import { Bell } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Discord } from "@/components/footer";

interface Notification {
  title: string;
  content: string;
  read?: boolean;
}

export function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const { notifications, markAllAsRead } = useNotification();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsUserAuthenticated(isUserLoggedIn());
      setIsAuthInitialized(true);
    }
  }, []);

  // Ensure hooks are called unconditionally
  const isProfileOpenState = isAuthInitialized ? isProfileOpen : false;
  const isNotifOpenState = isAuthInitialized ? isNotifOpen : false;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current && !profileRef.current.contains(event.target as Node) &&
        notifRef.current && !notifRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-steel-gray bg-black/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="relative h-10 w-10 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center rounded bg-neon-green/20 text-neon-green animate-glow-pulse">
              <img
                src="/trophy.jpg"
                alt="Trophy"
                className="h-12 w-12"
              />
            </div>
          </div>
          <span className="text-xl font-bold tracking-wider text-white">
            CLUTCH<span className="text-neon-green glow-text">VAULT</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href={isLoggedIn ? "/tournaments" : "/login?redirect=/tournaments"}
            className={`text-sm font-medium transition-colors hover:text-neon-green ${pathname === "/tournaments" ? "text-neon-green" : "text-muted-foreground"
              }`}
          >
            Tournaments
          </Link>

          <Link
            href="/about"
            className={`text-sm font-medium transition-colors hover:text-neon-green ${pathname === "/about" ? "text-neon-green" : "text-muted-foreground"
              }`}
          >
            About
          </Link>

          {session?.user?.isAdmin && (
            <Link
              href="/admin"
              className={`text-sm font-medium transition-colors hover:text-neon-green ${pathname === "/admin" ? "text-neon-green" : "text-neon-pink"
                }`}
            >
              Dashboard
            </Link>
          )}

          {isLoggedIn && (
            <div ref={notifRef} className="relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="relative flex items-center justify-center h-8 w-8 rounded-full bg-steel-dark text-white hover:bg-steel-gray cursor-pointer"
                    onClick={() => {
                      setIsNotifOpen((prev) => !prev);
                      if (!isNotifOpen) markAllAsRead();
                      setIsProfileOpen(false);
                    }}
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {notifications.length > 0
                    ? notifications[0].content // Show the latest notification message
                    : "No new notifications"}
                </TooltipContent>
              </Tooltip>
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-steel-dark rounded-lg shadow-lg">
                  <div className="p-4 font-semibold text-white">Notifications</div>
                  <div className="divide-y divide-gray-700 max-h-96 overflow-y-auto">
                    {notifications.slice(0, 5).map((notification, idx) => (
                      <div
                        key={idx}
                        className={`p-4 border-b border-steel-gray ${!notification.read ? "bg-black/30" : ""
                          }`}
                      >
                        <div className="font-semibold">{notification.title}</div>
                        <div className="text-xs text-muted-foreground">{notification.content}</div>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <div className="p-4 text-muted-foreground">No notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {isLoggedIn ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setIsProfileOpen((prev) => !prev);
                  setIsNotifOpen(false);
                }}
                className="flex items-center gap-2 text-white"
              >
                <div className="relative h-8 w-8 overflow-hidden rounded-full bg-steel-dark flex items-center justify-center">
                  <User className="h-5 w-5 text-neon-green" />
                </div>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-steel-dark rounded-lg shadow-lg">
                  <ul className="py-2">
                    <li>
                      <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-steel-gray">
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    </li>


                    <li>
                      <Link href="/inbox" className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-steel-gray">
                        <Mail className="h-4 w-4" />
                        Inbox
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          signOut({ callbackUrl: "/" });
                          localStorage.removeItem("isLoggedIn");
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-white hover:bg-steel-gray"
                      >
                        <LogOut className="h-4 w-4" />
                        Log out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" className="text-white hover:text-neon-green hover:bg-transparent">
                <Link
                  href="/login?redirect=/tournaments"
                  className="text-sm font-medium text-muted-foreground hover:text-neon-green"
                >
                  Login
                </Link>
              </Button>
              <Button asChild className="bg-neon-green text-black hover:bg-neon-green/80">
                <Link href="/signup?redirect=/">Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>
      </div >
    </header >
  );
}

export function Footer({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLoginState = localStorage.getItem("isLoggedIn") === "true";
      setLoggedIn(storedLoginState || isLoggedIn);
    }
  }, [isLoggedIn]);

  return (
    <footer className="border-t border-steel-gray bg-black/80 py-8">
      <div className="container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-wider text-white">
                CLUTCH<span className="text-neon-green">VAULT</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Join competitive CODM tournaments with your squad. Climb the leaderboard. Win big.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-8">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-white">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href={loggedIn ? "/tournaments" : "/login?redirect=/tournaments"}
                    className="text-muted-foreground hover:text-neon-green"
                  >
                    Tournaments
                  </Link>
                </li>
                <li>
                  <Link href="/rules" className="text-muted-foreground hover:text-neon-green">
                    Rules
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-white">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-neon-green">
                    About
                  </Link>
                </li>

                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-neon-green">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-neon-green">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4 flex flex-col items-start">
            <h3 className="text-sm font-medium text-white">Connect with us</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-neon-green">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-neon-green">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-neon-green">
                <Discord className="h-5 w-5" />
                <span className="sr-only">Discord</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-steel-gray pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Clutch Vault. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
