"use client"

import { Input } from "@/components/ui/input"
import { use } from "react"
import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Trophy, Users, Calendar, Clock, DollarSign, Shield, ChevronRight, Loader2 } from "lucide-react"

// Mock tournament data
const tournaments = [
  {
    id: 1,
    title: "CODM Pro League",
    mode: "Squad",
    teamSize: 4,
    entryFee: 50,
    prizePool: 5000,
    date: "May 15, 2023",
    time: "8:00 PM EST",
    status: "Registering",
    description:
      "The premier CODM tournament featuring the best teams from around the world. Compete in a series of matches to determine the ultimate champion.",
    rules: [
      "Teams must have exactly 4 players",
      "All players must be at least level 50 in CODM",
      "No emulators allowed, mobile devices only",
      "Matches will be played in Battle Royale mode",
      "Points awarded for placement and eliminations",
    ],
  },
  {
    id: 2,
    title: "Weekend Warfare",
    mode: "Solo",
    teamSize: 1,
    entryFee: 25,
    prizePool: 2500,
    date: "May 20, 2023",
    time: "6:00 PM EST",
    status: "Open",
    description:
      "A solo tournament for players to showcase their individual skills. Compete against other solo players in intense 1v1 matches.",
    rules: [
      "Solo players only",
      "All players must be at least level 30 in CODM",
      "No emulators allowed, mobile devices only",
      "Matches will be played in Multiplayer mode",
      "Best of 3 format for all matches",
    ],
  },
]

export default function TournamentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params) // Unwrap the params Promise
  const tournamentId = Number.parseInt(unwrappedParams.id)
  const tournament = tournaments.find((t) => t.id === tournamentId) || tournaments[0]
  const router = useRouter()
  const { data: session } = useSession()

  const [currentStep, setCurrentStep] = useState<"details" | "team" | "payment" | "confirmation">("details")
  const [teammates, setTeammates] = useState<{ name: string; uid: string }[]>([])
  const [roomPassword, setRoomPassword] = useState<string>("")
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize teammates array when tournament changes
  useEffect(() => {
    setTeammates(Array.from({ length: tournament.teamSize - 1 }, () => ({ name: "", uid: "" })))
  }, [tournament.teamSize])

  const handleProceedToPayment = () => {
    setCurrentStep("payment")
  }

  const handleCompletePayment = () => {
    setCurrentStep("confirmation")
  }

  const handleRegister = async () => {
    if (!session) {
      // Redirect to login if not logged in
      router.push(`/login?redirect=/tournaments/${tournamentId}`)
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/tournaments/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournamentId: tournament.id,
          teammates: teammates,
          teamName: `${session?.user?.name || "Player"}'s Team`
        })
      })

      const data = await response.json()

      if (response.ok) {
        setRoomPassword(data.roomCode)
        setCurrentStep("confirmation")
      } else {
        alert(data.error || "Registration failed")
      }
    } catch (err) {
      console.error("Registration error:", err)
      alert("Something went wrong during registration.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    if (typeof window !== "undefined" && navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setShowCopiedTooltip(true)
          setTimeout(() => setShowCopiedTooltip(false), 2000)
        })
        .catch((err) => {
          console.error("Failed to copy text using Clipboard API: ", err)
          fallbackCopyToClipboard(text)
        })
    } else {
      fallbackCopyToClipboard(text)
    }
  }

  const fallbackCopyToClipboard = (text: string) => {
    try {
      const textarea = document.createElement("textarea")
      textarea.value = text
      textarea.style.position = "fixed" // Prevent scrolling to the bottom of the page
      textarea.style.opacity = "0" // Make it invisible
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      const successful = document.execCommand("copy")
      document.body.removeChild(textarea)
      if (successful) {
        setShowCopiedTooltip(true)
        setTimeout(() => setShowCopiedTooltip(false), 2000)
      } else {
        alert("Failed to copy text. Please copy manually.")
      }
    } catch (err) {
      console.error("Fallback copy failed: ", err)
      alert("Failed to copy text. Please copy manually.")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar isLoggedIn={!!session} />

      <main className="flex-1 pt-20">
        <div className="container py-8">
          {currentStep === "details" && (
            <>
              <div className="mb-8">
                <Link href="/tournaments" className="text-neon-green hover:underline flex items-center gap-1 mb-4">
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  Back to Tournaments
                </Link>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-2">{tournament.title}</h1>
                <p className="text-muted-foreground">{tournament.description}</p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-steel-gray mb-8">
                    <Image
                      src={`/placeholder.svg?height=400&width=800`}
                      alt={tournament.title}
                      width={800}
                      height={400}
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4 rounded bg-neon-green px-3 py-1 text-sm font-medium text-black">
                      {tournament.mode}
                    </div>
                  </div>

                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-steel-dark">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="rules">Rules</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-4">
                      <div className="rounded-lg border border-steel-gray bg-steel-dark p-6">
                        <h2 className="text-xl font-bold mb-4">Tournament Overview</h2>
                        <p className="text-muted-foreground mb-6">{tournament.description}</p>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon-green/10 text-neon-green">
                              <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Date</p>
                              <p className="font-medium">{tournament.date}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon-green/10 text-neon-green">
                              <Clock className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Time</p>
                              <p className="font-medium">{tournament.time}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon-green/10 text-neon-green">
                              <Users className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Team Size</p>
                              <p className="font-medium">{tournament.teamSize} Players</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon-green/10 text-neon-green">
                              <DollarSign className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Entry Fee</p>
                              <p className="font-medium">₹{tournament.entryFee} per team</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon-green/10 text-neon-green">
                              <Trophy className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Prize Pool</p>
                              <p className="font-medium">₹{tournament.prizePool}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon-green/10 text-neon-green">
                              <Shield className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Status</p>
                              <p className="font-medium">{tournament.status}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="rules" className="mt-4">
                      <div className="rounded-lg border border-steel-gray bg-steel-dark p-6">
                        <h2 className="text-xl font-bold mb-4">Tournament Rules</h2>
                        <ul className="space-y-2">
                          {tournament.rules.map((rule, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-neon-green/10 text-neon-green text-xs mt-0.5">
                                {index + 1}
                              </div>
                              <span className="text-muted-foreground">{rule}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div>
                  <div className="rounded-lg border border-steel-gray bg-steel-dark p-6 sticky top-24">
                    <h2 className="text-xl font-bold mb-4">Registration</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Entry Fee</span>
                        <span className="font-medium">₹{tournament.entryFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Team Size</span>
                        <span className="font-medium">{tournament.teamSize} Players</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mode</span>
                        <span className="font-medium">{tournament.mode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">{tournament.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time</span>
                        <span className="font-medium">{tournament.time}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-steel-gray">
                      <Button
                        className="w-full bg-neon-green text-black hover:bg-neon-green/80"
                        onClick={() => setCurrentStep("team")}
                      >
                        Register Now
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        By registering, you agree to the tournament rules and terms.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="mb-8">
            <button
              onClick={() => setCurrentStep("details")}
              className="text-neon-green hover:underline flex items-center gap-1 mb-4"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to Tournament Details
            </button>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-2">Team Registration</h1>
            <p className="text-muted-foreground">
              Enter details for your {tournament.teamSize - 1} teammates for {tournament.title}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="rounded-lg border border-steel-gray bg-steel-dark p-6">
                <h2 className="text-xl font-bold mb-4">Teammate Details</h2>
                <p className="text-muted-foreground mb-6">
                  Please provide accurate In-Game Name (IGN) and UID for each teammate.
                </p>

                <div className="space-y-6">
                  {/* Self / Leader - Read Only or Pre-filled */}
                  {/* Team Leader section removed as requested */}

                  {Array.from({ length: tournament.teamSize - 1 }).map((_, index) => (
                    <div key={index} className="rounded-lg border border-steel-gray bg-black/20 p-4">
                      <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Teammate {index + 1} Details</h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`teammate-${index}-name`}>In-Game Name (IGN)</Label>
                          <Input
                            id={`teammate-${index}-name`}
                            placeholder="e.g. SnipeKing"
                            className="bg-steel-dark border-steel-gray focus:border-neon-green"
                            value={teammates[index]?.name || ""}
                            onChange={(e) => {
                              const newTeammates = [...teammates];
                              if (!newTeammates[index]) newTeammates[index] = { name: "", uid: "" };
                              newTeammates[index].name = e.target.value;
                              setTeammates(newTeammates);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`teammate-${index}-uid`}>UID</Label>
                          <Input
                            id={`teammate-${index}-uid`}
                            placeholder="e.g. 67428..."
                            className="bg-steel-dark border-steel-gray focus:border-neon-green"
                            value={teammates[index]?.uid || ""}
                            onChange={(e) => {
                              const newTeammates = [...teammates];
                              if (!newTeammates[index]) newTeammates[index] = { name: "", uid: "" };
                              newTeammates[index].uid = e.target.value;
                              setTeammates(newTeammates);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="rounded-lg border border-steel-gray bg-steel-dark p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Registration Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tournament</span>
                    <span className="font-medium">{tournament.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Team Size</span>
                    <span className="font-medium">{tournament.teamSize} Players</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Teammates Added</span>
                    <span className="font-medium">
                      {teammates.filter(t => t?.name && t?.uid).length} / {tournament.teamSize - 1}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entry Fee</span>
                    <span className="font-medium">${tournament.entryFee}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-steel-gray">
                  <Button
                    className="w-full bg-neon-green text-black hover:bg-neon-green/80"
                    onClick={handleRegister}
                    disabled={isSubmitting || teammates.filter(t => t?.name && t?.uid).length !== tournament.teamSize - 1}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      "Register Team"
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    {teammates.filter(t => t?.name && t?.uid).length !== tournament.teamSize - 1
                      ? `Please enter details for all ${tournament.teamSize - 1} teammates to continue.`
                      : "Click to complete registration."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {currentStep === "payment" && (
            <>
              <div className="mb-8">
                <button
                  onClick={() => setCurrentStep("team")}
                  className="text-neon-green hover:underline flex items-center gap-1 mb-4"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  Back to Team Selection
                </button>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-2">Payment</h1>
                <p className="text-muted-foreground">Complete payment to register for {tournament.title}</p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                  <div className="rounded-lg border border-steel-gray bg-steel-dark p-6">
                    <h2 className="text-xl font-bold mb-4">Payment Details</h2>
                    <p className="text-muted-foreground mb-6">
                      Complete your payment using our secure payment gateway.
                    </p>

                    <div className="rounded-lg border border-steel-gray bg-black/50 p-6 mb-6">
                      <h3 className="text-lg font-medium mb-4">Cashfree Payment Gateway</h3>

                      {/* This would be replaced with actual Cashfree integration */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="card-name">Name on Card</Label>
                            <Input id="card-name" placeholder="John Doe" className="bg-steel-dark border-steel-gray" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="card-number">Card Number</Label>
                            <Input
                              id="card-number"
                              placeholder="4111 1111 1111 1111"
                              className="bg-steel-dark border-steel-gray"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2 col-span-1">
                            <Label htmlFor="expiry-month">Expiry Month</Label>
                            <Input id="expiry-month" placeholder="MM" className="bg-steel-dark border-steel-gray" />
                          </div>
                          <div className="space-y-2 col-span-1">
                            <Label htmlFor="expiry-year">Expiry Year</Label>
                            <Input id="expiry-year" placeholder="YY" className="bg-steel-dark border-steel-gray" />
                          </div>
                          <div className="space-y-2 col-span-1">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" className="bg-steel-dark border-steel-gray" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-neon-green text-black hover:bg-neon-green/80"
                      onClick={handleCompletePayment}
                    >
                      Pay ${tournament.entryFee} and Register
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="rounded-lg border border-steel-gray bg-steel-dark p-6 sticky top-24">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tournament</span>
                        <span className="font-medium">{tournament.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Team Size</span>
                        <span className="font-medium">{tournament.teamSize} Players</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">{tournament.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time</span>
                        <span className="font-medium">{tournament.time}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-neon-green">${tournament.entryFee}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-steel-gray">
                      <p className="text-xs text-muted-foreground">
                        By completing payment, you agree to the tournament rules and terms. No refunds will be issued
                        after registration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {currentStep === "confirmation" && (
            <div className="max-w-2xl mx-auto">
              <div className="rounded-lg border border-steel-gray bg-steel-dark p-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neon-green/20 text-neon-green mx-auto mb-6">
                  <Trophy className="h-10 w-10" />
                </div>
                <h1 className="text-3xl font-bold tracking-tighter mb-4">Registration Complete!</h1>
                <p className="text-muted-foreground mb-8">
                  You have successfully registered for {tournament.title}. Your team is now confirmed.
                </p>

                <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-6 mb-8">
                  <h2 className="text-xl font-bold text-yellow-500 mb-2">Important: Room Password</h2>
                  <p className="text-muted-foreground mb-4">
                    This Room Password is essential. Copy and store it securely — it won't be shown again.
                  </p>
                  <div className="relative">
                    <div className="flex items-center justify-between rounded-lg border border-steel-gray bg-black p-4 mb-2">
                      <span className="font-mono text-neon-green">{roomPassword}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(roomPassword)}
                        className="relative"
                      >
                        {showCopiedTooltip && (
                          <span className="absolute -top-8 right-0 rounded bg-neon-green px-2 py-1 text-xs text-black">
                            Copied!
                          </span>
                        )}
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-medium">Tournament Details</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-steel-gray bg-black p-4">
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{tournament.date}</p>
                    </div>
                    <div className="rounded-lg border border-steel-gray bg-black p-4">
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">{tournament.time}</p>
                    </div>
                    <div className="rounded-lg border border-steel-gray bg-black p-4">
                      <p className="text-sm text-muted-foreground">Team Size</p>
                      <p className="font-medium">{tournament.teamSize} Players</p>
                    </div>
                    <div className="rounded-lg border border-steel-gray bg-black p-4">
                      <p className="text-sm text-muted-foreground">Mode</p>
                      <p className="font-medium">{tournament.mode}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-neon-green text-black hover:bg-neon-green/80">
                    <Link href="/profile">View in My Profile</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/tournaments">Browse More Tournaments</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
