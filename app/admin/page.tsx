"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Plus,
    Edit,
    Trash2,
    Users,
    Trophy,
    Calendar,
    DollarSign,
    Loader2,
    X,
    Save,
    Eye,
    Search
} from "lucide-react"

interface Tournament {
    id: number
    name: string
    description: string | null
    type: string
    prize: number
    startTime: string
    endTime: string | null
    maxTeams: number
    status: string
    imageUrl: string | null
    _count: { registrations: number; teams: number }
}

export default function AdminPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [tournaments, setTournaments] = useState<Tournament[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [editingTournament, setEditingTournament] = useState<Tournament | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        type: "Squad",
        prize: 0,
        startTime: "",
        endTime: "",
        maxTeams: 32,
        status: "Open",
        imageUrl: ""
    })
    const [isSaving, setIsSaving] = useState(false)
    const [showRegistrationsModal, setShowRegistrationsModal] = useState(false)
    const [registrations, setRegistrations] = useState<any[]>([])
    const [currentTournamentName, setCurrentTournamentName] = useState("")
    const [editingResult, setEditingResult] = useState<any>(null)
    const [resultFormData, setResultFormData] = useState({ placement: "", earnings: "" })
    const [searchQuery, setSearchQuery] = useState("")

    // Fetch tournaments
    const fetchTournaments = async () => {
        try {
            const res = await fetch("/api/admin/tournaments")
            if (res.status === 403) {
                setError("Access denied. Admin privileges required.")
                return
            }
            if (!res.ok) throw new Error("Failed to fetch tournaments")
            const data = await res.json()
            setTournaments(data.tournaments)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?redirect=/admin")
        } else if (status === "authenticated") {
            fetchTournaments()
        }
    }, [status, router])

    const openCreateModal = () => {
        setEditingTournament(null)
        setFormData({
            name: "",
            description: "",
            type: "Squad",
            prize: 0,
            startTime: "",
            endTime: "",
            maxTeams: 32,
            status: "Open",
            imageUrl: ""
        })
        setShowModal(true)
    }

    const openEditModal = (tournament: Tournament) => {
        setEditingTournament(tournament)
        setFormData({
            name: tournament.name,
            description: tournament.description || "",
            type: tournament.type,
            prize: tournament.prize,
            startTime: new Date(tournament.startTime).toISOString().slice(0, 16),
            endTime: tournament.endTime ? new Date(tournament.endTime).toISOString().slice(0, 16) : "",
            maxTeams: tournament.maxTeams,
            status: tournament.status,
            imageUrl: tournament.imageUrl || ""
        })
        setShowModal(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            const url = editingTournament
                ? `/api/admin/tournaments/${editingTournament.id}`
                : "/api/admin/tournaments"

            const method = editingTournament ? "PATCH" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    prize: Number(formData.prize),
                    maxTeams: Number(formData.maxTeams),
                    endTime: formData.endTime || null
                })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Failed to save tournament")
            }

            setShowModal(false)
            fetchTournaments()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this tournament?")) return

        try {
            const res = await fetch(`/api/admin/tournaments/${id}`, {
                method: "DELETE"
            })

            if (!res.ok) throw new Error("Failed to delete tournament")

            fetchTournaments()
        } catch (err: any) {
            setError(err.message)
        }
    }

    const handleViewRegistrations = async (tournament: Tournament) => {
        setCurrentTournamentName(tournament.name)
        setRegistrations([])
        setSearchQuery("")
        setShowRegistrationsModal(true)
        try {
            const res = await fetch(`/api/admin/tournaments/${tournament.id}/registrations`)
            if (res.ok) {
                const data = await res.json()
                setRegistrations(data.registrations)
            }
        } catch (error) {
            console.error("Failed to fetch registrations", error)
        }
    }

    const openResultModal = (reg: any) => {
        setEditingResult(reg)
        setResultFormData({
            placement: reg.placement ? reg.placement.toString() : "",
            earnings: reg.earnings ? reg.earnings.toString() : "0"
        })
    }

    const handleSaveResult = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingResult) return

        try {
            const res = await fetch(`/api/admin/tournaments/${editingResult.tournamentId}/results`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    results: [{
                        registrationId: editingResult.id,
                        placement: resultFormData.placement ? parseInt(resultFormData.placement) : null,
                        earnings: parseInt(resultFormData.earnings) || 0
                    }]
                })
            })

            if (res.ok) {
                // Refresh registrations
                const updatedRegistrations = registrations.map(r =>
                    r.id === editingResult.id
                        ? { ...r, placement: resultFormData.placement ? parseInt(resultFormData.placement) : null, earnings: parseInt(resultFormData.earnings) || 0 }
                        : r
                )
                setRegistrations(updatedRegistrations)
                setEditingResult(null)
            }
        } catch (error) {
            console.error("Failed to save result", error)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Open": return "bg-green-500/20 text-green-400 border-green-500/50"
            case "Registering": return "bg-blue-500/20 text-blue-400 border-blue-500/50"
            case "Last Call": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
            case "In Progress": return "bg-purple-500/20 text-purple-400 border-purple-500/50"
            case "Completed": return "bg-gray-500/20 text-gray-400 border-gray-500/50"
            default: return "bg-gray-500/20 text-gray-400 border-gray-500/50"
        }
    }

    if (status === "loading" || isLoading) {
        return (
            <div className="flex min-h-screen flex-col bg-black">
                <Navbar isLoggedIn={true} />
                <main className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-neon-green" />
                </main>
                <Footer />
            </div>
        )
    }

    if (error === "Access denied. Admin privileges required.") {
        return (
            <div className="flex min-h-screen flex-col bg-black">
                <Navbar isLoggedIn={true} />
                <main className="flex-1 flex items-center justify-center py-20">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
                        <p className="text-muted-foreground mb-6">You don't have admin privileges.</p>
                        <Button onClick={() => router.push("/")} className="bg-neon-green text-black">
                            Go Home
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col bg-black">
            <Navbar isLoggedIn={true} />

            <main className="flex-1 py-20">
                <div className="container">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tighter">
                                Admin <span className="text-neon-green">Dashboard</span>
                            </h1>
                            <p className="text-muted-foreground mt-1">Manage tournaments and settings</p>
                        </div>
                        <Button onClick={openCreateModal} className="bg-neon-green text-black hover:bg-neon-green/80">
                            <Plus className="h-4 w-4 mr-2" />
                            New Tournament
                        </Button>
                    </div>

                    {error && error !== "Access denied. Admin privileges required." && (
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 mb-6">
                            {error}
                        </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="p-4 rounded-lg border border-steel-gray bg-steel-dark">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-neon-green/20">
                                    <Trophy className="h-5 w-5 text-neon-green" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{tournaments.length}</p>
                                    <p className="text-sm text-muted-foreground">Total Tournaments</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg border border-steel-gray bg-steel-dark">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-green-500/20">
                                    <Calendar className="h-5 w-5 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">
                                        {tournaments.filter(t => t.status === "Open" || t.status === "Registering").length}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Active Tournaments</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg border border-steel-gray bg-steel-dark">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/20">
                                    <Users className="h-5 w-5 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">
                                        {tournaments.reduce((sum, t) => sum + t._count.registrations, 0)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Total Registrations</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg border border-steel-gray bg-steel-dark">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-yellow-500/20">
                                    <DollarSign className="h-5 w-5 text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">
                                        ₹{tournaments.reduce((sum, t) => sum + t.prize, 0).toLocaleString()}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Total Prize Pool</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tournaments Table */}
                    <div className="rounded-lg border border-steel-gray bg-steel-dark overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-black/50">
                                    <tr>
                                        <th className="text-left p-4 font-medium text-muted-foreground">Tournament</th>
                                        <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                                        <th className="text-left p-4 font-medium text-muted-foreground">Prize</th>
                                        <th className="text-left p-4 font-medium text-muted-foreground">Start Date</th>
                                        <th className="text-left p-4 font-medium text-muted-foreground">Registrations</th>
                                        <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                                        <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tournaments.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                                No tournaments yet. Create your first tournament!
                                            </td>
                                        </tr>
                                    ) : (
                                        tournaments.map((tournament) => (
                                            <tr key={tournament.id} className="border-t border-steel-gray hover:bg-black/30">
                                                <td className="p-4">
                                                    <div className="font-medium">{tournament.name}</div>
                                                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                                                        {tournament.description || "No description"}
                                                    </div>
                                                </td>
                                                <td className="p-4">{tournament.type}</td>
                                                <td className="p-4 text-neon-green font-medium">₹{tournament.prize.toLocaleString()}</td>
                                                <td className="p-4 text-sm">
                                                    {new Date(tournament.startTime).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    })}
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-neon-green">{tournament._count.registrations}</span>
                                                    <span className="text-muted-foreground">/{tournament.maxTeams}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(tournament.status)}`}>
                                                        {tournament.status}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleViewRegistrations(tournament)}
                                                            className="text-gray-400 hover:text-white hover:bg-white/10"
                                                            title="View Registrations"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => openEditModal(tournament)}
                                                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleDelete(tournament.id)}
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                    <div className="relative w-full max-w-lg mx-4 p-6 rounded-lg border border-steel-gray bg-steel-dark max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h2 className="text-xl font-bold mb-6">
                            {editingTournament ? "Edit Tournament" : "Create Tournament"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Tournament Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-black border-steel-gray"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="bg-black border-steel-gray"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type *</Label>
                                    <select
                                        id="type"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full p-2 rounded-md bg-black border border-steel-gray text-white"
                                    >
                                        <option value="Solo">Solo</option>
                                        <option value="Duo">Duo</option>
                                        <option value="Squad">Squad</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status *</Label>
                                    <select
                                        id="status"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full p-2 rounded-md bg-black border border-steel-gray text-white"
                                    >
                                        <option value="Open">Open</option>
                                        <option value="Registering">Registering</option>
                                        <option value="Last Call">Last Call</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="prize">Prize (₹) *</Label>
                                    <Input
                                        id="prize"
                                        type="number"
                                        min="0"
                                        value={formData.prize}
                                        onChange={(e) => setFormData({ ...formData, prize: parseInt(e.target.value) || 0 })}
                                        className="bg-black border-steel-gray"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="maxTeams">Max Teams *</Label>
                                    <Input
                                        id="maxTeams"
                                        type="number"
                                        min="2"
                                        value={formData.maxTeams}
                                        onChange={(e) => setFormData({ ...formData, maxTeams: parseInt(e.target.value) || 2 })}
                                        className="bg-black border-steel-gray"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startTime">Start Time *</Label>
                                    <Input
                                        id="startTime"
                                        type="datetime-local"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                        className="bg-black border-steel-gray"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="endTime">End Time</Label>
                                    <Input
                                        id="endTime"
                                        type="datetime-local"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                        className="bg-black border-steel-gray"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="imageUrl">Image URL</Label>
                                <Input
                                    id="imageUrl"
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="bg-black border-steel-gray"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 border-steel-gray"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 bg-neon-green text-black hover:bg-neon-green/80"
                                >
                                    {isSaving ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <Save className="h-4 w-4 mr-2" />
                                    )}
                                    {editingTournament ? "Update" : "Create"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Registrations Modal */}
            {showRegistrationsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                    <div className="relative w-full max-w-3xl mx-4 p-6 rounded-lg border border-steel-gray bg-steel-dark max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setShowRegistrationsModal(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h2 className="text-xl font-bold mb-6">
                            Registrations for <span className="text-neon-green">{currentTournamentName}</span>
                        </h2>

                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by UID or Username..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-black border-steel-gray"
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-black/50">
                                    <tr>
                                        <th className="text-left p-3 font-medium text-muted-foreground">UID</th>
                                        <th className="text-left p-3 font-medium text-muted-foreground">User</th>
                                        <th className="text-left p-3 font-medium text-muted-foreground">Role</th>
                                        <th className="text-left p-3 font-medium text-muted-foreground">Team</th>
                                        <th className="text-left p-3 font-medium text-muted-foreground">Result</th>
                                        <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                                        <th className="text-left p-3 font-medium text-muted-foreground">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registrations.filter(reg =>
                                        searchQuery === "" ||
                                        reg.user?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        reg.user?.id.toString().includes(searchQuery)
                                    ).length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                                No registrations found matching "{searchQuery}".
                                            </td>
                                        </tr>
                                    ) : (
                                        registrations.filter(reg =>
                                            searchQuery === "" ||
                                            reg.user?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            reg.user?.id.toString().includes(searchQuery)
                                        ).map((reg) => (
                                            <tr key={reg.id} className="border-t border-steel-gray hover:bg-black/30">
                                                <td className="p-3 text-sm font-mono text-neon-green">
                                                    #{reg.user?.id}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-8 rounded-full bg-steel-gray overflow-hidden">
                                                            {reg.user?.avatar ? (
                                                                <img src={reg.user.avatar} alt={reg.user.username} className="h-full w-full object-cover" />
                                                            ) : (
                                                                <Users className="h-4 w-4 m-2 text-gray-400" />
                                                            )}
                                                        </div>
                                                        <Link
                                                            href={`/profile/${reg.user?.id}`}
                                                            className="font-medium hover:text-neon-green hover:underline"
                                                            target="_blank"
                                                        >
                                                            {reg.user?.username || "Unknown"}
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-sm">{reg.role}</td>
                                                <td className="p-3 text-sm">
                                                    {reg.team?.name || (reg.role === 'Solo' ? '-' : 'Pending')}
                                                </td>
                                                <td className="p-3 text-sm">
                                                    {reg.placement ? (
                                                        <span className="text-yellow-400 font-bold">#{reg.placement} <span className="text-neon-green font-normal">(₹{reg.earnings})</span></span>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    <span className="px-2 py-1 rounded-full text-xs border border-green-500/50 bg-green-500/20 text-green-400">
                                                        {reg.status}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <Button variant="ghost" size="sm" onClick={() => openResultModal(reg)}>
                                                        <Trophy className="h-4 w-4 text-yellow-500" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Result Modal */}
            {editingResult && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80">
                    <div className="relative w-full max-w-md mx-4 p-6 rounded-lg border border-steel-gray bg-steel-dark">
                        <button
                            onClick={() => setEditingResult(null)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-6">Update Results</h2>
                        <form onSubmit={handleSaveResult} className="space-y-4">
                            <div>
                                <Label>Participant</Label>
                                <p className="text-neon-green font-bold">{editingResult.user?.username}</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="placement">Placement (Rank)</Label>
                                <Input
                                    id="placement"
                                    type="number"
                                    placeholder="e.g. 1"
                                    value={resultFormData.placement}
                                    onChange={(e) => setResultFormData({ ...resultFormData, placement: e.target.value })}
                                    className="bg-black border-steel-gray"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="earnings">Earnings (₹)</Label>
                                <Input
                                    id="earnings"
                                    type="number"
                                    placeholder="0"
                                    value={resultFormData.earnings}
                                    onChange={(e) => setResultFormData({ ...resultFormData, earnings: e.target.value })}
                                    className="bg-black border-steel-gray"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-neon-green text-black">
                                Save Result
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}
