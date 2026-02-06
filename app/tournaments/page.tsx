"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Filter, Search, Copy, Loader2, Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Tournament {
  id: number;
  name: string;
  description: string | null;
  type: string;
  prize: number;
  startTime: string;
  endTime: string | null;
  maxTeams: number;
  status: string;
  imageUrl: string | null;
  _count?: { registrations: number; teams: number };
}

interface Registration {
  id: number;
  tournament: Tournament;
  role: string;
  status: string;
}

export default function TournamentsPage() {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [roomCode, setRoomCode] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [registeredTournaments, setRegisteredTournaments] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push(`/login?redirect=/tournaments`);
    }
  }, [authStatus, router]);

  // Fetch tournaments from database
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await fetch("/api/tournaments");
        if (res.ok) {
          const data = await res.json();
          setTournaments(data.tournaments || []);
        }
      } catch (error) {
        console.error("Failed to fetch tournaments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleJoinNow = (code: string) => {
    setRoomCode(code);
    setIsDialogOpen(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomCode);
    alert("Room code copied to clipboard!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-green-500/20 text-green-500";
      case "Registering": return "bg-yellow-500/20 text-yellow-500";
      case "Last Call": return "bg-red-500/20 text-red-500";
      case "In Progress": return "bg-purple-500/20 text-purple-500";
      case "Completed": return "bg-gray-500/20 text-gray-500";
      default: return "bg-gray-500/20 text-gray-500";
    }
  };

  const getTimeUntilStart = (startTime: string) => {
    const start = new Date(startTime);
    const diff = start.getTime() - currentTime.getTime();

    if (diff < 0) return "Started";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `Starts in ${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Starts in ${hours} hour${hours > 1 ? 's' : ''}`;
    return "Starting soon";
  };

  // Filter tournaments based on search
  const filteredTournaments = tournaments.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show loading state while checking auth
  if (authStatus === "loading") {
    return (
      <div className="flex min-h-screen flex-col bg-black">
        <Navbar isLoggedIn={false} />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-neon-green" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar isLoggedIn={!!session} />

      <main className="flex-1 pt-20">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-2">Welcome to Tournaments</h1>
            <p className="text-muted-foreground">Browse and register for upcoming CODM tournaments</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search-tournaments"
                name="search-tournaments"
                placeholder="Search tournaments..."
                className="pl-10 bg-steel-dark border-steel-gray"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-neon-green" />
            </div>
          ) : filteredTournaments.length === 0 ? (
            <div className="text-center py-20">
              <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-bold mb-2">No Tournaments Available</h2>
              <p className="text-muted-foreground">
                {searchQuery ? "No tournaments match your search." : "Check back later for new tournaments!"}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTournaments.map((tournament) => (
                <div key={tournament.id} className="group relative overflow-hidden rounded-lg border border-steel-gray bg-steel-dark">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={tournament.imageUrl || `/placeholder.svg?height=300&width=500`}
                      alt={tournament.name}
                      width={500}
                      height={300}
                      priority
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 rounded bg-neon-green px-2 py-1 text-xs font-medium text-black">
                      {tournament.type}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="mb-2 text-xl font-bold group-hover:text-neon-green">
                      {tournament.name}
                    </h3>
                    {tournament.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {tournament.description}
                      </p>
                    )}
                    <div className="mb-4 flex items-center text-sm text-muted-foreground">
                      <span className="mr-4">Prize: ₹{tournament.prize.toLocaleString()}</span>
                      <span>Teams: {tournament.maxTeams}</span>
                    </div>
                    <div className="mb-4 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {getTimeUntilStart(tournament.startTime)}
                      </span>
                      <span className={`rounded px-2 py-1 text-xs font-medium ${getStatusColor(tournament.status)}`}>
                        {tournament.status}
                      </span>
                    </div>
                    <Button asChild className="w-full bg-neon-green text-black hover:bg-neon-green/80">
                      <Link href={`/tournaments/${tournament.id}`}>Register Now</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Registered Tournaments Section */}
          <div className="p-6 mt-8">
            <h2 className="text-xl font-bold mb-4">Registered Tournaments</h2>
            <p className="text-gray-500 mb-6">Tournaments you've registered for</p>
            <div className="divide-y divide-gray-700 max-h-96 overflow-y-auto">
              {registeredTournaments.length === 0 ? (
                <p className="text-muted-foreground py-4">You haven't registered for any tournaments yet.</p>
              ) : (
                registeredTournaments.map((reg) => {
                  const isJoinAvailable =
                    new Date(reg.tournament.startTime).getTime() - currentTime.getTime() <= 3600000 &&
                    new Date(reg.tournament.startTime).getTime() > currentTime.getTime();

                  return (
                    <div key={reg.id} className="py-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">{reg.tournament.name}</h3>
                        <p className="text-sm text-gray-400">
                          {getTimeUntilStart(reg.tournament.startTime)}
                        </p>
                        <p className="text-sm text-neon-green">{reg.role}</p>
                      </div>
                      {isJoinAvailable ? (
                        <button
                          onClick={() => handleJoinNow("ABC123")}
                          className="bg-neon-green text-black px-4 py-2 rounded-lg hover:bg-neon-green/80"
                        >
                          Join Now
                        </button>
                      ) : (
                        <span className="text-gray-500">
                          {getTimeUntilStart(reg.tournament.startTime)}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="text-center">
                <DialogHeader>
                  <DialogTitle>ROOM CODE</DialogTitle>
                </DialogHeader>
                <div className="flex items-center justify-center mt-4">
                  <span className="text-2xl font-bold mr-4">{roomCode}</span>
                  <button onClick={copyToClipboard} className="text-neon-green hover:text-neon-green/80">
                    <Copy className="w-6 h-6" />
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
