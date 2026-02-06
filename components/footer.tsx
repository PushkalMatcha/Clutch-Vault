"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { isUserLoggedIn, handleTournamentsClick } from "@/utils/auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNotification } from "@/context/NotificationContext";

// --- ICON COMPONENTS ---
// Updated Twitter logo to X
export function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 0 0-8.384 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.938-.856 2.021-.857 3.17 0 2.188 1.115 4.117 2.823 5.254a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.058 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 24 4.557z" />
    </svg>
  );
}
export function Instagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.13 4.602.388 3.635 1.355 2.668 2.322 2.41 3.495 2.352 4.772.013 8.332 0 8.741 0 12c0 3.259.013 3.668.072 4.948.058 1.277.316 2.45 1.283 3.417.967.967 2.14 1.225 3.417 1.283C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.277-.058 2.45-.316 3.417-1.283.967-.967 1.225-2.14 1.283-3.417.059-1.28.072-1.689.072-4.948s-.013-3.668-.072-4.948c-.058-1.277-.316-2.45-1.283-3.417-.967-.967-2.14-1.225-3.417-1.283C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  );
}
// Updated Discord icon to use the correct SVG path
export function Discord(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.249a19.736 19.736 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.249.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C2.533 9.042 1.845 13.583 2.13 18.057a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 4.967 2.515.077.077 0 0 0 .084-.027c.384-.523.725-1.08 1.02-1.658a.076.076 0 0 0-.041-.105 13.097 13.097 0 0 1-1.872-.9.077.077 0 0 1-.008-.128c.126-.094.252-.192.373-.291a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.062 0a.073.073 0 0 1 .079.009c.121.099.247.197.373.291a.077.077 0 0 1-.006.128 12.744 12.744 0 0 1-1.873.899.076.076 0 0 0-.04.106c.3.577.641 1.135 1.02 1.658a.076.076 0 0 0 .084.028 19.868 19.868 0 0 0 4.967-2.515.077.077 0 0 0 .031-.056c.334-5.019-.56-9.5-2.366-13.661a.061.061 0 0 0-.03-.028zM8.02 15.275c-1.182 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.175 1.095 2.156 2.418 0 1.334-.955 2.419-2.156 2.419zm7.975 0c-1.182 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.175 1.095 2.156 2.418 0 1.334-.946 2.419-2.156 2.419z" />
    </svg>
  );
}

// --- FOOTER COMPONENT ---
export function Footer() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(isUserLoggedIn());

  useEffect(() => {
    const checkLoginStatus = () => setLoggedIn(isUserLoggedIn());
    checkLoginStatus(); // Initial check

    const interval = setInterval(checkLoginStatus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="border-t border-steel-gray bg-black/80 py-8">
      <div className="container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand/Description */}
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

          {/* Links */}
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-white">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/tournaments"
                    onClick={(e) => handleTournamentsClick(e, router, "/tournaments")}
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
                  <Link href="/contact" className="text-muted-foreground hover:text-neon-green">
                    Contact
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

          {/* Social Media Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">Connect with us</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-neon-green">
                <X className="h-5 w-5" />
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

// --- REGISTER TOURNAMENT PAGE ---
export function RegisterTournamentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification(); // Use the hook at the top level

  const [loggedIn, setLoggedIn] = useState(isUserLoggedIn());

  useEffect(() => {
    const interval = setInterval(() => {
      setLoggedIn(isUserLoggedIn());
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  async function handleRegistration() {
    setLoading(true);
    try {
      // Simulate registration API call
      const response = await fetch("/api/registerTournament", {
        method: "POST",
        body: JSON.stringify({
          tournamentId: "123",
          // other registration data…
        }),
      });
      if (!response.ok) throw new Error("Registration failed");

      // Registration successful; update notifications via context
      const notification = {
        title: "Tournament Registration Complete",
        content: "You have successfully registered for the tournament.",
      };
      addNotification(notification);

      // Optionally, show some UI feedback or redirect
      router.push("/tournaments");
    } catch (error) {
      console.error(error);
      // Handle the error accordingly
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container max-w-md py-8">
      <h1 className="text-2xl font-bold mb-4">Register for Tournament</h1>
      {/* Your registration form goes here */}
      <Button onClick={handleRegistration} disabled={loading}>
        {loading ? "Registering..." : "Complete Registration"}
      </Button>
    </div>
  );
}

// --- LOGIN COMPONENT ---
export function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleLogin() {
    // ...your login logic...
    // After successful login:
    const redirect = searchParams ? searchParams.get("redirect") : null;
    if (redirect) {
      router.push(redirect);
    } else {
      router.push("/"); // or your default page
    }
  }

  return (
    <div className="container max-w-md py-8">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
}

export default function ProfilePage() {
  const userUID = "6876543210123456789"; // Replace with actual UID from user data

  const [loggedIn, setLoggedIn] = useState(isUserLoggedIn());

  useEffect(() => {
    const interval = setInterval(() => {
      setLoggedIn(isUserLoggedIn());
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container max-w-md py-8">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <form className="space-y-6">
        {/* Other profile fields */}
        <div className="space-y-2">
          <Label htmlFor="uid">COD Mobile UID</Label>
          <Input
            id="uid"
            value={userUID}
            className="bg-steel-dark border-steel-gray"
            disabled // Makes the input non-editable
          />
        </div>
        <Button type="submit" className="w-full bg-neon-green text-black hover:bg-neon-green/80">
          Save Changes
        </Button>
      </form>
      <Footer />
    </div>
  );
}
