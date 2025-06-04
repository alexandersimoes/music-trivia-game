"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { LeaderboardEntry } from "@/lib/constants"
import Link from "next/link"

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("musicTriviaLeaderboard")
    if (saved) {
      setLeaderboard(JSON.parse(saved))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto pt-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500/20 rounded-full mb-4">
            <Trophy className="w-10 h-10 text-yellow-300" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-white/70">Top 10 Players</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-0">
            {leaderboard.length === 0 ? (
              <div className="text-center py-12 text-white/60">No scores yet. Be the first to play!</div>
            ) : (
              <div className="divide-y divide-white/10">
                {leaderboard.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                          index === 0
                            ? "bg-yellow-500 text-yellow-900"
                            : index === 1
                              ? "bg-gray-300 text-gray-900"
                              : index === 2
                                ? "bg-orange-600 text-orange-100"
                                : "bg-white/10 text-white",
                        )}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{entry.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-white/60 text-sm">{entry.genre}</p>
                          <span className="text-white/40">•</span>
                          <div className="flex items-center gap-1">
                            {entry.difficulty === "easy" ? (
                              <Eye className="w-3 h-3 text-white/60" />
                            ) : (
                              <EyeOff className="w-3 h-3 text-white/60" />
                            )}
                            <p className="text-white/60 text-sm capitalize">{entry.difficulty}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{entry.score}</p>
                      <p className="text-white/60 text-sm">points</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/">
            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Back to Menu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}