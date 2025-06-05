"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Eye, EyeOff, Home } from "lucide-react"
import { GENRES, DeezerGenre, Difficulty } from "@/lib/constants"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

function LevelCompleteContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const level = parseInt(searchParams.get('level') || '1')
  const score = parseInt(searchParams.get('score') || '0')
  const genreId = searchParams.get('genreId') || ''
  const difficulty = (searchParams.get('difficulty') || 'hard') as Difficulty
  
  const [playerName, setPlayerName] = useState("")
  const [deezerGenres, setDeezerGenres] = useState<DeezerGenre[]>([])

  useEffect(() => {
    if (genreId?.startsWith('deezer-')) {
      fetchDeezerGenres()
    }
  }, [genreId])

  const fetchDeezerGenres = async () => {
    try {
      const response = await fetch('/api/genre')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      setDeezerGenres(data.genres || [])
    } catch (error) {
      console.error("Error fetching genres:", error)
    }
  }

  const getGenreInfo = () => {
    if (genreId?.startsWith('deezer-')) {
      const deezerGenreId = parseInt(genreId.replace('deezer-', ''))
      const deezerGenre = deezerGenres.find((g) => g.id === deezerGenreId)
      return deezerGenre ? { name: deezerGenre.name, emoji: "🎵" } : null
    } else {
      return GENRES.find((g) => g.id === genreId)
    }
  }

  const genreInfo = getGenreInfo()

  const continueToNextLevel = () => {
    router.push(`/play/${genreId}/${difficulty}?level=${level + 1}&score=${score}`)
  }

  const saveAndExit = () => {
    if (playerName.trim()) {
      let genreName = ""
      if (genreId?.startsWith('deezer-')) {
        const deezerGenreId = parseInt(genreId.replace('deezer-', ''))
        genreName = deezerGenres.find((g) => g.id === deezerGenreId)?.name || "Unknown Genre"
      } else {
        genreName = GENRES.find((g) => g.id === genreId)?.name || ""
      }
      
      const newEntry = {
        name: playerName,
        score: score,
        genre: genreName,
        difficulty: difficulty,
      }

      const saved = localStorage.getItem("musicTriviaLeaderboard")
      const currentLeaderboard = saved ? JSON.parse(saved) : []
      const updatedLeaderboard = [...currentLeaderboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 10)

      localStorage.setItem("musicTriviaLeaderboard", JSON.stringify(updatedLeaderboard))
    }
    router.push('/')
  }

  if (!genreInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="absolute top-4 left-4">
        <Link href="/">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </Link>
      </div>
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 rounded-full mb-4 mx-auto">
            <Music className="w-10 h-10 text-blue-300" />
          </div>
          <CardTitle className="text-white text-3xl">Level {level} Complete!</CardTitle>
          <CardDescription className="text-white/70 text-lg">{genreInfo.name} Challenge</CardDescription>
          <div className="flex items-center gap-2 justify-center mt-2">
            {difficulty === "easy" ? (
              <Eye className="w-4 h-4 text-white/60" />
            ) : (
              <EyeOff className="w-4 h-4 text-white/60" />
            )}
            <span className="text-sm text-white/60 capitalize">{difficulty} Mode</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-white/60 text-sm mb-2">Current Score</p>
            <p className="text-4xl font-bold text-white">{score}</p>
            <p className="text-white/60 text-sm mt-2">Level {level} of 3</p>
          </div>

          <div className="space-y-2">
            <label className="text-white text-sm">Enter your name (up to 10 characters):</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) =>
                setPlayerName(
                  e.target.value
                    .replace(/[^A-Za-z]/g, "")
                    .toUpperCase()
                    .slice(0, 10),
                )
              }
              placeholder="ABC"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
              maxLength={10}
            />
            {playerName && <p className="text-white/60 text-sm">Playing as: {playerName}</p>}
          </div>

          <div className="space-y-2">
            {level < 3 ? (
              <Button className="w-full" size="lg" onClick={continueToNextLevel}>
                Continue to Level {level + 1}
              </Button>
            ) : (
              <Link href={`/results?score=${score}&genreId=${genreId}&difficulty=${difficulty}`}>
                <Button className="w-full" size="lg">
                  View Final Results
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
              size="lg"
              onClick={saveAndExit}
            >
              {playerName.trim() ? "Save Score & Exit" : "Back to Menu"}
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

export default function LevelCompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    }>
      <LevelCompleteContent />
    </Suspense>
  )
}