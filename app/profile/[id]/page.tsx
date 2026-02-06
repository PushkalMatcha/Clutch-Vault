"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Trophy, Users, Clock, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const userId = unwrappedParams.id;
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<{
        name: string;
        uid: string;
        image: string;
        createdAt: string;
    } | null>(null);
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchProfileData() {
            try {
                const res = await fetch(`/api/users/${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    setProfile({
                        name: data.username || "User",
                        uid: data.id.toString(),
                        image: data.avatar || "",
                        createdAt: data.createdAt
                    });
                    setRegistrations(data.registrations || []);
                } else {
                    setError("User not found");
                }
            } catch (e) {
                console.error("Failed to fetch profile", e);
                setError("Failed to load profile");
            } finally {
                setIsLoading(false);
            }
        }

        if (userId) {
            fetchProfileData();
        }
    }, [userId]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen flex-col bg-black">
                <Navbar isLoggedIn={true} />
                <main className="flex-1 pt-20 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-neon-green" />
                </main>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex min-h-screen flex-col bg-black">
                <Navbar isLoggedIn={true} />
                <main className="flex-1 pt-20 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
                        <p className="text-muted-foreground">{error || "Profile not found"}</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-black">
            <Navbar isLoggedIn={true} />

            <main className="flex-1 pt-20">
                <div className="container py-8">
                    {/* Profile Header */}
                    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-neon-green">
                                <Image
                                    src={profile.image || "/placeholder.svg?height=80&width=80"}
                                    alt="Profile"
                                    width={80}
                                    height={80}
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
                                <p className="text-muted-foreground">UID: #{profile.uid}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Joined {new Date(profile.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Sidebar Stats */}
                        <div className="space-y-6">
                            <div className="rounded-lg border border-steel-gray bg-steel-dark p-6">
                                <h2 className="text-lg font-bold mb-4">Player Stats</h2>
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
                                    <div className="pt-4 border-t border-steel-gray">
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Total Earnings</span>
                                            <span className="font-medium text-neon-green">
                                                ₹{registrations.reduce((sum, r) => sum + (r.earnings || 0), 0).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
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
                                                                {reg.earnings ? `₹${reg.earnings.toLocaleString()}` : `₹0`}
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
                                            <p className="text-sm text-muted-foreground">Tournaments this player has registered for</p>
                                        </div>

                                        <div className="divide-y divide-gray-700">
                                            {registrations.length === 0 ? (
                                                <div className="p-8 text-center text-muted-foreground">
                                                    Not registered for any upcoming tournaments.
                                                </div>
                                            ) : (
                                                registrations.map((reg) => (
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
                                                            <span className={`text-xs px-2 py-1 rounded-full border ${reg.status === 'Confirmed' ? 'border-green-500/50 text-green-400 bg-green-500/10' :
                                                                'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'
                                                                }`}>
                                                                {reg.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
