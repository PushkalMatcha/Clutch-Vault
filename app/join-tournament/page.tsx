"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Trophy, Copy, Check } from "lucide-react"

export default function JoinTournamentPage() {
  const [roomPassword, setRoomPassword] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [roomId, setRoomId] = useState("CODM-PRO-123456")
  const [copiedPassword, setCopiedPassword] = useState(false)
  const [copiedRoomId, setCopiedRoomId] = useState(false)

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would verify the password with the server
    // For now, we'll just simulate a successful verification
    if (roomPassword.trim()) {
      setIsVerified(true)
    }
  }

  const copyToClipboard = (text: string, type: "password" | "roomId") => {
    navigator.clipboard.writeText(text)
    if (type === "password") {
      setCopiedPassword(true)
      setTimeout(() => setCopiedPassword(false), 2000)
    } else {
      setCopiedRoomId(true)
      setTimeout(() => setCopiedRoomId(false), 2000)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar isLoggedIn={true} />

      <main className="flex-1 pt-20">
        <div className="container py-8">
          <div className="max-w-md mx-auto">
            <div className="rounded-lg border border-steel-gray bg-steel-dark p-8">
              <div className="text-center mb-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neon-green/20 text-neon-green mx-auto mb-4">
                  <Trophy className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold tracking-tighter mb-2">Join Tournament</h1>
                <p className="text-muted-foreground">Enter your room password to access the tournament</p>
              </div>

              {!isVerified ? (
                <form onSubmit={handleVerifyPassword} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="room-password">Room Password</Label>
                    <Input
                      id="room-password"
                      placeholder="Enter room password"
                      className="bg-steel-dark border-steel-gray"
                      value={roomPassword}
                      onChange={(e) => setRoomPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-neon-green text-black hover:bg-neon-green/80">
                    Verify Password
                  </Button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-lg border border-neon-green/30 bg-neon-green/10 p-4">
                    <h2 className="text-lg font-bold text-neon-green mb-2">Tournament Access Granted</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      Make sure to copy both values accurately to join the tournament lobby.
                    </p>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="room-id">Room ID</Label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 rounded bg-black p-2 font-mono text-neon-green">{roomId}</div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="relative"
                            onClick={() => copyToClipboard(roomId, "roomId")}
                          >
                            {copiedRoomId ? (
                              <Check className="h-4 w-4 text-neon-green" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                            {copiedRoomId && (
                              <span className="absolute -top-8 right-0 rounded bg-neon-green px-2 py-1 text-xs text-black">
                                Copied!
                              </span>
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="room-password">Room Password</Label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 rounded bg-black p-2 font-mono text-neon-green">{roomPassword}</div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="relative"
                            onClick={() => copyToClipboard(roomPassword, "password")}
                          >
                            {copiedPassword ? (
                              <Check className="h-4 w-4 text-neon-green" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                            {copiedPassword && (
                              <span className="absolute -top-8 right-0 rounded bg-neon-green px-2 py-1 text-xs text-black">
                                Copied!
                              </span>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Button asChild className="bg-neon-green text-black hover:bg-neon-green/80">
                      <Link href="https://codm.activision.com" target="_blank" rel="noopener noreferrer">
                        Launch CODM
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/profile">Return to Profile</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
