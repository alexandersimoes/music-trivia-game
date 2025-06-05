"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import { GENRES, DeezerGenre } from "@/lib/constants"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

export default function GenreSelectionPage() {
  const params = useParams()
  const router = useRouter()
  const genreId = params.id as string
  const [deezerGenres, setDeezerGenres] = useState<DeezerGenre[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (genreId?.startsWith('deezer-')) {
      fetchDeezerGenres()
    }
  }, [genreId])

  const fetchDeezerGenres = async () => {
    setLoading(true)
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
      setLoading(false)
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

  if (loading || (genreId?.startsWith('deezer-') && deezerGenres.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    )
  }

  if (!genreInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 flex items-center justify-center">
        <Card className="max-w-md w-full bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-3xl">Genre Not Found</CardTitle>
            <CardDescription className="text-white/70">The requested genre could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button
                variant="outline"
                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Back to Menu
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 flex items-center justify-center">
      <Card className="max-w-md w-full bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-4 mx-auto backdrop-blur-sm">
            <span className="text-4xl">{genreInfo.emoji}</span>
          </div>
          <CardTitle className="text-white text-3xl">Choose Difficulty</CardTitle>
          <CardDescription className="text-white/70 text-lg">{genreInfo.name} Challenge</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href={`/play/${genreId}/easy`} className="block">
            <Button className="w-full h-auto py-6 px-6 text-left justify-start bg-green-500/20 border-green-500/40 text-white hover:bg-green-500/30 hover:border-green-500/60 transition-all duration-300">
              <div className="flex items-center gap-4">
                <Eye className="w-8 h-8" />
                <div>
                  <div className="text-xl font-bold">Easy Mode</div>
                  <div className="text-sm opacity-80">Song titles are visible</div>
                  <div className="text-xs opacity-60">Standard scoring</div>
                </div>
              </div>
            </Button>
          </Link>

          <Link href={`/play/${genreId}/hard`} className="block">
            <Button className="w-full h-auto py-6 px-6 text-left justify-start bg-red-500/20 border-red-500/40 text-white hover:bg-red-500/30 hover:border-red-500/60 transition-all duration-300">
              <div className="flex items-center gap-4">
                <EyeOff className="w-8 h-8" />
                <div>
                  <div className="text-xl font-bold">Hard Mode</div>
                  <div className="text-sm opacity-80">Song titles are hidden</div>
                  <div className="text-xs opacity-60">1.5x score multiplier</div>
                </div>
              </div>
            </Button>
          </Link>

          <Link href="/" className="block">
            <Button
              variant="outline"
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Back to Menu
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}