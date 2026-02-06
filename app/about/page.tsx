"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useSession } from "next-auth/react";
import {
  Target,
  Users,
  Trophy,
  Gamepad2,
  Shield,
  Zap,
  ArrowLeft,
  Crosshair,
  Swords,
  Map
} from "lucide-react";

const About = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar isLoggedIn={!!session} />

      <main className="flex-1 pt-20">
        <div className="container py-12">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm text-neon-green hover:underline cursor-pointer mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go back
          </button>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              About <span className="text-neon-green glow-text">ClutchVault</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The ultimate platform for competitive Call of Duty: Mobile tournaments.
              Form squads, compete in tournaments, and dominate the battlefield.
            </p>
          </div>

          {/* CODM Section */}
          <section className="mb-16">
            <div className="rounded-lg border border-steel-gray bg-steel-dark p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-lg bg-neon-green/20">
                  <Gamepad2 className="h-6 w-6 text-neon-green" />
                </div>
                <h2 className="text-2xl font-bold">About Call of Duty: Mobile</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-white">Call of Duty: Mobile (CODM)</strong> is a free-to-play
                    first-person shooter game developed by TiMi Studios and published by Activision.
                    Released in October 2019, it quickly became one of the most popular mobile games
                    worldwide, bringing the iconic Call of Duty experience to smartphones.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    The game features classic maps, weapons, and characters from the Call of Duty
                    franchise, including fan favorites from Modern Warfare, Black Ops, and other titles.
                    With its intuitive controls and stunning graphics, CODM delivers console-quality
                    gameplay on mobile devices.
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    CODM offers multiple game modes including Team Deathmatch, Search & Destroy,
                    Domination, and the popular Battle Royale mode where 100 players compete to be
                    the last one standing. The game supports various competitive formats, making it
                    perfect for esports tournaments.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    With millions of active players and a thriving esports scene, Call of Duty: Mobile
                    has established itself as a premier competitive mobile gaming title with official
                    world championships and regional tournaments.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Game Modes Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Popular Game Modes</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-lg border border-steel-gray bg-steel-dark p-6 hover:border-neon-green/50 transition-colors">
                <div className="p-3 rounded-lg bg-red-500/20 w-fit mb-4">
                  <Swords className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Multiplayer</h3>
                <p className="text-muted-foreground text-sm">
                  Classic 5v5 battles including Team Deathmatch, Domination, Search & Destroy,
                  Hardpoint, and more. Fast-paced action on iconic maps.
                </p>
              </div>

              <div className="rounded-lg border border-steel-gray bg-steel-dark p-6 hover:border-neon-green/50 transition-colors">
                <div className="p-3 rounded-lg bg-purple-500/20 w-fit mb-4">
                  <Map className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Battle Royale</h3>
                <p className="text-muted-foreground text-sm">
                  100-player survival mode on a massive map. Solo, Duo, or Squad modes available.
                  Loot, survive, and be the last one standing.
                </p>
              </div>

              <div className="rounded-lg border border-steel-gray bg-steel-dark p-6 hover:border-neon-green/50 transition-colors">
                <div className="p-3 rounded-lg bg-blue-500/20 w-fit mb-4">
                  <Crosshair className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">Ranked Mode</h3>
                <p className="text-muted-foreground text-sm">
                  Competitive ranked matches where players climb from Rookie to Legendary rank.
                  Test your skills against the best players worldwide.
                </p>
              </div>
            </div>
          </section>

          {/* Why ClutchVault Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Why Choose ClutchVault?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6">
                <div className="p-4 rounded-full bg-neon-green/20 w-fit mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-neon-green" />
                </div>
                <h3 className="font-bold mb-2">Competitive Tournaments</h3>
                <p className="text-muted-foreground text-sm">
                  Regular tournaments with real prize pools for all skill levels.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="p-4 rounded-full bg-blue-500/20 w-fit mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="font-bold mb-2">Squad Formation</h3>
                <p className="text-muted-foreground text-sm">
                  Find teammates, build your squad, and compete together.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="p-4 rounded-full bg-purple-500/20 w-fit mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="font-bold mb-2">Fair Play</h3>
                <p className="text-muted-foreground text-sm">
                  Anti-cheat measures and strict rules ensure fair competition.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="p-4 rounded-full bg-yellow-500/20 w-fit mx-auto mb-4">
                  <Zap className="h-8 w-8 text-yellow-400" />
                </div>
                <h3 className="font-bold mb-2">Easy to Join</h3>
                <p className="text-muted-foreground text-sm">
                  Simple registration process. Get into tournaments quickly.
                </p>
              </div>
            </div>
          </section>

          {/* Mission Section */}
          <section className="rounded-lg border border-neon-green/30 bg-neon-green/5 p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              ClutchVault is dedicated to building a thriving community of CODM players who are
              passionate about competition and teamwork. Whether you're a seasoned veteran or
              just starting your competitive journey, ClutchVault is the place for you to
              showcase your skills, make new friends, and win big.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;