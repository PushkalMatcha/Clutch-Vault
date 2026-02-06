"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/context/NotificationContext";

export default function RegisterTournamentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();
  const tournamentName = "Weekend Warfare"; // or get dynamically
  const unreadCount = 5; // Example unread count

  async function handleRegistration() {
    setLoading(true);
    try {
      // Simulate API call
      const response = await fetch("/api/registerTournament", {
        method: "POST",
        body: JSON.stringify({ tournamentId: "123" }),
      });
      if (!response.ok) throw new Error("Registration failed");

      // Add notification via context
      addNotification({
        title: "Tournament Registration Complete",
        content: `You have successfully registered for ${tournamentName}.`,
      });
      router.push("/registration-complete");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Add logic to trigger notifications for friend requests and tournament reminders
  useEffect(() => {
    // Simulate a new friend request notification
    addNotification({
      title: "New Friend Request",
      content: "You have received a new friend request.",
    });

    // Simulate a friend accepting your request
    addNotification({
      title: "Friend Request Accepted",
      content: "Your friend request has been accepted.",
    });

    // Simulate a notification for a registered tournament starting soon
    const tournamentStartTime = new Date();
    tournamentStartTime.setHours(tournamentStartTime.getHours() + 1); // 1 hour from now
    addNotification({
      title: "Tournament Reminder",
      content: `Your registered tournament starts at ${tournamentStartTime.toLocaleTimeString()}. Be ready!`,
    });
  }, [addNotification]);

  return (
    <div className="container max-w-md py-8 relative">
      <h1 className="text-2xl font-bold mb-4">Register for Tournament</h1>
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
      )}
      <Button onClick={handleRegistration} disabled={loading}>
        {loading ? "Registering..." : "Complete Registration"}
      </Button>
    </div>
  );
}

const PaymentPage = () => {
  const { addNotification } = useNotification();

  const handlePaymentSuccess = () => {
    // Add success notification
    addNotification({
      title: "Success",
      content: "You have successfully registered for the tournament.",
    });
    window.location.href = "/tournaments"; // Redirect to tournaments page
  };

  return (
    <div>
      {/* ...existing payment page code... */}
      <button
        onClick={handlePaymentSuccess}
        className="bg-neon-green text-black hover:bg-neon-green/80"
      >
        Pay $25 and Register
      </button>
    </div>
  );
};

export function RegistrationCompletePage() {
  const { addNotification } = useNotification();

  useEffect(() => {
    // Add a notification when the page loads
    addNotification({
      title: "Registration Complete",
      content: "You have successfully registered for Weekend Warfare. Your team is now confirmed.",
    });
  }, [addNotification]);

  return (
    <div>
      {/* ...existing Registration Complete page content... */}
    </div>
  );
}