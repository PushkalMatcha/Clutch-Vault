"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Edit, Trophy, Users, Clock, ClipboardCopy, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    uid: "",
    image: "",
  });
  const [registrations, setRegistrations] = useState<any[]>([]);

  // Fetch Profile and Registrations
  useEffect(() => {
    async function fetchProfileData() {
      if (session?.user) {
        try {
          const res = await fetch('/api/users/me');
          if (res.ok) {
            const data = await res.json();
            setProfile({
              name: data.username || session.user.name || "User",
              uid: data.id.toString(),
              image: data.avatar || session.user.image || ""
            });
            setRegistrations(data.registrations || []);
          }
        } catch (e) {
          console.error("Failed to fetch profile", e);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }

    if (session) {
      fetchProfileData();
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsEditing(false);
    // Update API
    try {
      await fetch('/api/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ username: profile.name }),
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      console.error("Failed to update profile", e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-black">
        <Navbar isLoggedIn={!!session} />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-neon-green" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar isLoggedIn={!!session} />

      <main className="flex-1 pt-20">
        <div className="container py-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-neon-green">
                <Image
                  src={profile.image || "/placeholder.svg?height=80&width=80"} // Use the uploaded image or a placeholder
                  alt="Profile"
                  width={80}
                  height={80}
                  className="object-cover"
                />
                <input
                  type="file"
                  id="profilePhoto"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setProfile((prev) => ({ ...prev, image: event.target?.result as string }));
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="profilePhoto"
                  className="absolute bottom-0 right-0 h-6 w-6 flex items-center justify-center rounded-full bg-neon-green text-black hover:bg-neon-green/80 cursor-pointer"
                  aria-label="Edit Profile Photo"
                >
                  <Edit className="h-4 w-4" />
                </label>
              </div>
              <div>
                <div>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          value={profile.name}
                          onChange={handleInputChange}
                          className="w-full text-3xl font-bold tracking-tighter bg-transparent border-b border-gray-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label htmlFor="uid" className="block text-sm font-medium text-muted-foreground">
                          UID
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{profile.uid}</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(profile.uid);
                              setCopied(true); // Show "Copied" text
                              setTimeout(() => setCopied(false), 500); // Hide "Copied" text after 2 seconds
                            }}
                            className="text-muted-foreground hover:text-neon-green"
                            aria-label="Copy UID"
                          >
                            <ClipboardCopy className="h-4 w-4" />
                          </button>
                          {copied && <span className="text-xs text-neon-green">Copied</span>}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h1 className="text-3xl font-bold tracking-tighter">{profile.name}</h1>
                      <div className="flex items-center gap-2">
                        <p className="text-muted-foreground">UID: {profile.uid}</p>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(profile.uid);
                            setCopied(true); // Show "Copied" text
                            setTimeout(() => setCopied(false), 2000); // Hide "Copied" text after 2 seconds
                          }}
                          className="text-muted-foreground hover:text-neon-green"
                          aria-label="Copy UID"
                        >
                          <ClipboardCopy className="h-4 w-4" />
                        </button>
                        {copied && <span className="text-xs text-neon-green">Copied</span>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {isEditing ? (
                <Button onClick={handleSave} variant="outline" className="md:self-start">
                  Save
                </Button>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline" className="md:self-start">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              )}

            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <div className="rounded-lg border border-steel-gray bg-steel-dark p-6">
                <h2 className="text-xl font-bold mb-4">Player Stats</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tournaments Played</span>
                    <span className="font-medium text-white">{registrations.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tournaments Won</span>
                    <span className="font-medium text-white">{registrations.filter(r => r.placement === 1).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Win Rate</span>
                    <span className="font-medium text-white">
                      {registrations.length > 0
                        ? Math.round((registrations.filter(r => r.placement === 1).length / registrations.length) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Earnings</span>
                    <span className="font-medium text-neon-green">
                      ₹{registrations.reduce((sum, r) => sum + (r.earnings || 0), 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-steel-gray">
                  <h3 className="text-lg font-medium mb-4">Achievements</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500">
                        <Trophy className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Tournament Champion</p>
                        <p className="text-xs text-muted-foreground">Won CODM Pro League</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-500">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Squad Leader</p>
                        <p className="text-xs text-muted-foreground">Created a team of 5+ players</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <Tabs defaultValue="history" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-steel-dark">
                  <TabsTrigger value="history">Match History</TabsTrigger>
                  <TabsTrigger value="registered">Registered</TabsTrigger>
                </TabsList>

                <TabsContent value="history" className="mt-4">
                  <div className="rounded-lg border border-steel-gray bg-steel-dark">
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-2 text-white">Recent Matches</h3>
                    </div>
                    <div className="divide-y divide-gray-700">
                      {registrations.filter(r => r.tournament.status === 'Completed' || r.placement).length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                          No recent matches found.
                        </div>
                      ) : (
                        registrations.filter(r => r.tournament.status === 'Completed' || r.placement).map((reg) => (
                          <div key={reg.id} className="p-4 flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-white">{reg.tournament.name}</h4>
                              <p className="text-sm text-gray-400">
                                {new Date(reg.tournament.startTime).toLocaleDateString()}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-neon-green border border-neon-green/30 px-1 rounded">
                                  {reg.role}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-white">
                                {reg.placement ? <span className={reg.placement === 1 ? "text-yellow-400" : "text-white"}>#{reg.placement}</span> : <span className="text-muted-foreground">-</span>}
                              </div>
                              <div className="text-sm text-neon-green">
                                {reg.earnings ? `₹${reg.earnings.toLocaleString()}` : '₹0'}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="registered" className="mt-4">
                  <div className="rounded-lg border border-steel-gray bg-steel-dark">
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-2 text-white">Registered Tournaments</h3>
                      <p className="text-sm text-muted-foreground">Tournaments you've registered for</p>
                    </div>

                    <div className="divide-y divide-steel-gray">
                      {registrations.length > 0 ? (
                        registrations.map((reg) => (
                          <div key={reg.id} className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-steel-gray shrink-0">
                              <Trophy className="h-5 w-5 text-neon-green" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-white">{reg.tournament?.name || "Tournament"}</h4>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="mr-1 h-3 w-3" />
                                {reg.tournament?.startTime ? new Date(reg.tournament.startTime).toLocaleDateString() : "Date TBD"}
                              </div>
                              <div className="text-xs text-neon-green mt-1">
                                {reg.role} • {reg.status}
                              </div>
                              {reg.team?.teammates && (
                                <div className="mt-1 text-xs text-gray-400">
                                  Teammates: {(reg.team.teammates as any[]).map(t => t.name).join(", ")}
                                </div>
                              )}
                            </div>
                            <Button
                              size="sm"
                              className="bg-neon-green text-black hover:bg-neon-green/80"
                              asChild
                            >
                              <Link href={`/tournaments/${reg.tournamentId}`}>View Details</Link>
                            </Button>
                          </div>
                        ))) : (
                        <div className="p-8 text-center text-muted-foreground">
                          No active tournament registrations.
                        </div>
                      )}
                    </div>

                    <div className="p-4 text-center">
                      <Button asChild variant="outline" size="sm">
                        <Link href="/tournaments">Browse More Tournaments</Link>
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="friends" className="mt-4">
                  <div className="rounded-lg border border-steel-gray bg-steel-dark">
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Friends</h3>
                        <p className="text-sm text-muted-foreground">Your CODM squad members</p>
                      </div>
                      <Button asChild size="sm">
                        <Link href="/friends/add">Add Friend</Link>
                      </Button>
                    </div>

                    <div className="divide-y divide-steel-gray">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="p-4 flex items-center gap-4">
                          <div className="relative h-10 w-10 overflow-hidden rounded-full">
                            <Image
                              src={`/placeholder.svg?height=40&width=40`}
                              alt={`Friend ${i + 1}`}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                            <div
                              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-steel-dark ${i < 2 ? "bg-green-500" : "bg-gray-500"
                                }`}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{["SnipeKing", "FragMaster", "StealthOps", "RushQueen"][i]}</h4>
                            <div className="text-xs text-muted-foreground">
                              {i < 2 ? "Online" : "Last seen 2 hours ago"}
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Invite
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 text-center">
                      <Button asChild variant="outline" size="sm">
                        <Link href="/friends">Manage Friends</Link>
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
