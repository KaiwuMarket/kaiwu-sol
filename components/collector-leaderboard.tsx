"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Trophy } from "lucide-react"

const leaderboardData = [
  {
    rank: 1,
    username: "kaoyan",
    avatar: "/diverse-group-avatars.png",
    volume: "US$494,094.19",
    clawPulls: 5446,
    points: "49,411,9",
  },
  {
    rank: 2,
    username: "GhostTrainer6898",
    avatar: "/diverse-group-avatars.png",
    volume: "US$265,361.78",
    clawPulls: 180,
    points: "26,536,2",
  },
  {
    rank: 3,
    username: "BlazeCatcher9402",
    avatar: "/diverse-group-avatars.png",
    volume: "US$230,521.72",
    clawPulls: 166,
    points: "23,052,2",
  },
  {
    rank: 4,
    username: "DarkPioneer2139",
    avatar: "/diverse-group-avatars.png",
    volume: "US$60,333.98",
    clawPulls: 104,
    points: "5,929,2",
  },
  {
    rank: 5,
    username: "koikaze",
    avatar: "/diverse-group-avatars.png",
    volume: "US$51,323.96",
    clawPulls: 31,
    points: "5,132,4",
  },
  {
    rank: 6,
    username: "ElectricSeeker1588",
    avatar: "/diverse-group-avatars.png",
    volume: "US$48,640.12",
    clawPulls: 113,
    points: "4,889,0",
  },
  {
    rank: 7,
    username: "Snorlaxxx",
    avatar: "/diverse-group-avatars.png",
    volume: "US$44,410.59",
    clawPulls: 429,
    points: "4,433,5",
  },
]

export function CollectorLeaderboard() {
  const [activeTab, setActiveTab] = useState("weekly")

  return (
    <section className="px-12 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Collector Leaderboard</h2>
        <Link
          href="/leaderboard"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View Leaderboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab("weekly")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
            activeTab === "weekly" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Trophy className="w-4 h-4" />
          Weekly
        </button>
        <button
          onClick={() => setActiveTab("prizes")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
            activeTab === "prizes" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          View This Week's Prizes
        </button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-accent/50">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">#</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">NAME</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">VOLUME</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">CLAW PULLS</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">POINTS</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((user) => (
              <tr key={user.rank} className="border-b border-border hover:bg-accent/30 transition-colors">
                <td className="py-4 px-4 text-sm">{user.rank}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar || "/placeholder.svg"} alt={user.username} className="w-8 h-8 rounded-full" />
                    <span className="text-sm font-medium">{user.username}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-right">{user.volume}</td>
                <td className="py-4 px-4 text-sm text-right">{user.clawPulls}</td>
                <td className="py-4 px-4 text-sm text-right font-medium">{user.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
