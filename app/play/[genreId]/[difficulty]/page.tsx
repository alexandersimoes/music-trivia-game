"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Play, Pause, Volume2, Loader2, Eye, EyeOff, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { GENRES, Song, DeezerGenre, Difficulty } from "@/lib/constants"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const genreId = params.genreId as string
  const difficulty = params.difficulty as Difficulty

  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(false)
  const [answerOptions, setAnswerOptions] = useState<string[]>([])
  const [usedSongIds, setUsedSongIds] = useState<Set<number>>(new Set())
  const [usedArtists, setUsedArtists] = useState<Set<string>>(new Set())
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [showEasyModeConfirm, setShowEasyModeConfirm] = useState(false)
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>(difficulty)
  const [deezerGenres, setDeezerGenres] = useState<DeezerGenre[]>([])

  const audioRef = useRef<HTMLAudioElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (genreId?.startsWith('deezer-')) {
      fetchDeezerGenres()
    }
    
    // Check for level and score from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const levelParam = urlParams.get('level')
    const scoreParam = urlParams.get('score')
    
    if (levelParam) {
      setCurrentLevel(parseInt(levelParam))
    }
    if (scoreParam) {
      setScore(parseInt(scoreParam))
    }
    
    startGame()
  }, [genreId, difficulty])

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current)
      }
    } else if (timeLeft === 0 && !showResult) {
      handleAnswer(null)
    }
  }, [timeLeft, showResult])

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

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

  const fetchSongs = async (apiEndpoint: string) => {
    setLoading(true)
    try {
      const response = await fetch(apiEndpoint)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (data.songs && data.songs.length > 0) {
        setSongs(data.songs)
      } else {
        // Fallback to mock data if no songs returned
        setSongs([
          {
            id: 1,
            title: "Sample Song 1",
            artist: "Sample Artist 1",
            preview: "",
            cover: "/placeholder.svg?height=100&width=100",
          },
          {
            id: 2,
            title: "Sample Song 2",
            artist: "Sample Artist 2",
            preview: "",
            cover: "/placeholder.svg?height=100&width=100",
          },
          {
            id: 3,
            title: "Sample Song 3",
            artist: "Sample Artist 3",
            preview: "",
            cover: "/placeholder.svg?height=100&width=100",
          },
          {
            id: 4,
            title: "Sample Song 4",
            artist: "Sample Artist 4",
            preview: "",
            cover: "/placeholder.svg?height=100&width=100",
          },
          {
            id: 5,
            title: "Sample Song 5",
            artist: "Sample Artist 5",
            preview: "",
            cover: "/placeholder.svg?height=100&width=100",
          },
        ])
      }
    } catch (error) {
      console.error("Error fetching songs:", error)
      // Fallback to mock data if API fails
      setSongs([
        {
          id: 1,
          title: "Sample Song 1",
          artist: "Sample Artist 1",
          preview: "",
          cover: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 2,
          title: "Sample Song 2",
          artist: "Sample Artist 2",
          preview: "",
          cover: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 3,
          title: "Sample Song 3",
          artist: "Sample Artist 3",
          preview: "",
          cover: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 4,
          title: "Sample Song 4",
          artist: "Sample Artist 4",
          preview: "",
          cover: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 5,
          title: "Sample Song 5",
          artist: "Sample Artist 5",
          preview: "",
          cover: "/placeholder.svg?height=100&width=100",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const startGame = async () => {
    let apiEndpoint: string
    
    if (genreId?.startsWith('deezer-')) {
      const deezerGenreId = parseInt(genreId.replace('deezer-', ''))
      apiEndpoint = `/api/deezer/songs?genreId=${deezerGenreId}`
    } else {
      const genreInfo = GENRES.find((g) => g.id === genreId)
      if (!genreInfo) {
        router.push('/')
        return
      }
      
      // Check if it's a custom API genre (like MBP) or regular Deezer genre
      if (genreInfo.customApi) {
        apiEndpoint = genreInfo.customApi
      } else if (genreInfo.deezerGenreId) {
        apiEndpoint = `/api/deezer/songs?genreId=${genreInfo.deezerGenreId}`
      } else {
        router.push('/')
        return
      }
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
    }

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // Reset question state but preserve level and score from URL params
    setCurrentQuestion(0)
    setTimeLeft(30)
    setUsedSongIds(new Set())
    setUsedArtists(new Set())
    setSelectedAnswer(null)
    setShowResult(false)
    setIsPlaying(false)
    setAnswerOptions([])
    setSongs([])
    setCurrentSong(null)
    setShowEasyModeConfirm(false)

    await fetchSongs(apiEndpoint)
  }

  const selectNextSong = (currentUsedSongs: Set<number>, currentUsedArtists: Set<string>) => {
    if (songs.length === 0) return null

    const availableSongs = songs.filter(
      (song) => !currentUsedSongs.has(song.id) && !currentUsedArtists.has(song.artist),
    )

    if (availableSongs.length === 0) {
      const fallbackSongs = songs.filter((song) => !currentUsedSongs.has(song.id))
      if (fallbackSongs.length === 0) {
        setUsedSongIds(new Set())
        setUsedArtists(new Set())
        return songs[0]
      }
      return fallbackSongs[0]
    }

    return availableSongs[0]
  }

  const generateAnswerOptions = (correctArtist: string) => {
    const allArtists = Array.from(new Set(songs.map((s) => s.artist)))

    const wrongAnswers = allArtists
      .filter((artist) => artist !== correctArtist)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    const genericArtists = ["The Beatles", "Queen", "Michael Jackson", "Madonna", "Elvis Presley", "Bob Dylan"]
    while (wrongAnswers.length < 3) {
      const randomArtist = genericArtists[Math.floor(Math.random() * genericArtists.length)]
      if (!wrongAnswers.includes(randomArtist) && randomArtist !== correctArtist) {
        wrongAnswers.push(randomArtist)
      }
    }

    return [correctArtist, ...wrongAnswers.slice(0, 3)].sort(() => Math.random() - 0.5)
  }

  useEffect(() => {
    if (!showResult && songs.length > 0) {
      const nextSong = selectNextSong(usedSongIds, usedArtists)
      if (nextSong) {
        setCurrentSong(nextSong)
        const options = generateAnswerOptions(nextSong.artist)
        setAnswerOptions(options)

        if (audioRef.current && nextSong.preview) {
          audioRef.current.src = nextSong.preview
          audioRef.current.play().catch((e) => console.error("Error playing audio:", e))
          setIsPlaying(true)
        }
      }
    }
  }, [currentQuestion, songs, showResult, usedArtists, usedSongIds])

  const handleAnswer = (answer: string | null) => {
    if (!currentSong || showResult) return

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    setSelectedAnswer(answer)
    setShowResult(true)
    setIsPlaying(false)

    if (audioRef.current) {
      audioRef.current.pause()
    }

    if (answer === currentSong.artist) {
      const basePoints = Math.max(10, timeLeft * 2)
      const difficultyMultiplier = currentDifficulty === "hard" ? 1.5 : 1
      const points = Math.round(basePoints * difficultyMultiplier)
      setScore(score + points)
    }

    setTimeout(() => {
      if (currentSong) {
        const newUsedSongIds = new Set([...usedSongIds, currentSong.id])
        const newUsedArtists = new Set([...usedArtists, currentSong.artist])

        setUsedSongIds(newUsedSongIds)
        setUsedArtists(newUsedArtists)
      }

      if (currentQuestion < 4) {
        setCurrentQuestion(currentQuestion + 1)
        setTimeLeft(30)
        setShowResult(false)
        setSelectedAnswer(null)
      } else if (currentLevel < 3) {
        router.push(`/level-complete?level=${currentLevel}&score=${score}&genreId=${genreId}&difficulty=${currentDifficulty}`)
      } else {
        router.push(`/results?score=${score}&genreId=${genreId}&difficulty=${currentDifficulty}`)
      }
    }, 2000)
  }

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((e) => console.error("Error playing audio:", e))
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTitleClick = () => {
    if (currentDifficulty === "hard") {
      setShowEasyModeConfirm(true)
    }
  }

  const confirmEasyMode = () => {
    setCurrentDifficulty("easy")
    setShowEasyModeConfirm(false)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading songs...</p>
        </div>
      </div>
    )
  }

  if (!genreInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">Genre not found</p>
          <Link href="/">
            <Button className="mt-4">Back to Menu</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center text-white mb-4">
            <div className="flex items-center gap-4">
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
              <div>
                <span className="text-sm opacity-80">Level</span>
                <p className="text-2xl font-bold">{currentLevel}/3</p>
              </div>
            </div>
            <div className="text-center">
              <span className="text-sm opacity-80">Genre</span>
              <p className="text-2xl font-bold flex items-center gap-2">
                <span>{genreInfo.emoji}</span>
                {genreInfo.name}
              </p>
              <div className="flex items-center gap-2 justify-center mt-1">
                {currentDifficulty === "easy" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span className="text-sm opacity-80 capitalize">{currentDifficulty} Mode</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm opacity-80">Score</span>
              <p className="text-2xl font-bold">{score}</p>
            </div>
          </div>

          <div className="bg-white/10 rounded-full h-2 backdrop-blur-sm">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / 5) * 100}%` }}
            />
          </div>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white text-xl">Question {currentQuestion + 1} of 5</CardTitle>
              <div
                className={cn(
                  "text-2xl font-bold px-4 py-2 rounded-lg",
                  timeLeft > 20
                    ? "bg-green-500/20 text-green-300"
                    : timeLeft > 10
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-red-500/20 text-red-300",
                )}
              >
                {timeLeft}s
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white/5 rounded-lg p-8 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 rounded-full mb-4">
                {isPlaying ? (
                  <Volume2 className="w-12 h-12 text-white animate-pulse" />
                ) : (
                  <Music className="w-12 h-12 text-white" />
                )}
              </div>
              <p className="text-white text-lg mb-2">Now Playing</p>

              {currentDifficulty === "easy" ? (
                <p className="text-white/80 mb-2 text-lg font-medium">{currentSong?.title || "Loading..."}</p>
              ) : (
                <div className="mb-2">
                  <p
                    className="text-white/40 mb-1 text-lg font-medium cursor-pointer hover:text-white/60 transition-colors select-none"
                    style={{
                      filter: "blur(8px)",
                      textShadow: "0 0 8px rgba(255,255,255,0.3)",
                    }}
                    onClick={handleTitleClick}
                  >
                    {currentSong?.title || "Loading..."}
                  </p>
                  <p className="text-white/50 text-xs">Click title to switch to Easy Mode</p>
                </div>
              )}

              <p className="text-white/60">Listen carefully and name the artist!</p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={toggleAudio}
                disabled={!currentSong?.preview}
              >
                {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isPlaying ? "Pause" : "Play"} Audio
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {answerOptions.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  size="lg"
                  disabled={showResult}
                  onClick={() => handleAnswer(option)}
                  className={cn(
                    "h-auto py-4 px-6 text-left justify-start bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300",
                    showResult &&
                      option === currentSong?.artist &&
                      "bg-green-500/20 border-green-500 hover:bg-green-500/20",
                    showResult &&
                      option === selectedAnswer &&
                      option !== currentSong?.artist &&
                      "bg-red-500/20 border-red-500 hover:bg-red-500/20",
                  )}
                >
                  {option}
                </Button>
              ))}
            </div>

            {showResult && (
              <div
                className={cn(
                  "text-center p-4 rounded-lg",
                  selectedAnswer === currentSong?.artist ? "bg-green-500/20" : "bg-red-500/20",
                )}
              >
                <p
                  className={cn(
                    "text-lg font-semibold",
                    selectedAnswer === currentSong?.artist ? "text-green-300" : "text-red-300",
                  )}
                >
                  {selectedAnswer === currentSong?.artist ? "Correct! 🎉" : "Wrong! 😔"}
                </p>
                <p className="text-white/80 mt-1">
                  The answer was: <span className="font-semibold">{currentSong?.artist}</span>
                </p>
                {selectedAnswer === currentSong?.artist && currentDifficulty === "hard" && (
                  <p className="text-yellow-300 text-sm mt-1">Hard mode bonus applied! (+50%)</p>
                )}
              </div>
            )}

            {/* Easy Mode Confirmation Modal */}
            {showEasyModeConfirm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="max-w-sm w-full mx-4 bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-center">Switch to Easy Mode?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white/80 text-center text-sm">
                      This will show the song title and remove the hard mode score bonus for the rest of the game.
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={confirmEasyMode}>
                        Yes, Switch
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                        onClick={() => setShowEasyModeConfirm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hidden audio element */}
        <audio ref={audioRef} />
      </div>
    </div>
  )
}