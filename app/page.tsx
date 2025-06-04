"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Music, Trophy, ChevronRight, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { GENRES, DeezerGenre } from "@/lib/constants"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const [deezerGenres, setDeezerGenres] = useState<DeezerGenre[]>([])
  const [loadingGenres, setLoadingGenres] = useState(false)

  useEffect(() => {
    fetchDeezerGenres()
  }, [])

  const fetchDeezerGenres = async () => {
    setLoadingGenres(true)
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
    } finally {
      setLoadingGenres(false)
    }
  }

  const selectDeezerGenre = (genreId: string) => {
    router.push(`/genre/deezer-${genreId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 pt-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
            <Music className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Music Trivia Challenge</h1>
          <p className="text-xl text-white/80">Test your music knowledge across different genres!</p>
          <p className="text-sm text-white/60 mt-2">Powered by Deezer API</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {GENRES.map((genre) => (
            <Link key={genre.id} href={`/genre/${genre.id}`}>
              <Card className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div
                    className={cn(
                      "w-full h-32 rounded-lg bg-gradient-to-br flex items-center justify-center text-6xl",
                      genre.color,
                    )}
                  >
                    {genre.emoji}
                  </div>
                  <CardTitle className="text-white text-2xl">{genre.name}</CardTitle>
                  <CardDescription className="text-white/70">5 songs per level • 3 levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="secondary">
                    Play Now <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Additional Genres Dropdown */}
        <div className="mb-8">
          <Card className="max-w-md mx-auto bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-full mb-2">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white text-xl">More Genres</CardTitle>
                <CardDescription className="text-white/70">
                  Choose from hundreds of genres from Deezer
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Select
                onValueChange={selectDeezerGenre}
                disabled={loadingGenres}
              >
                <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder={loadingGenres ? "Loading genres..." : "Select a genre"} />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  {deezerGenres.map((genre) => (
                    <SelectItem
                      key={genre.id}
                      value={genre.id.toString()}
                      className="text-white hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white data-[highlighted]:bg-gray-800 data-[highlighted]:text-white"
                    >
                      {genre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link href="/leaderboard">
            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Trophy className="mr-2 h-5 w-5" />
              View Leaderboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}