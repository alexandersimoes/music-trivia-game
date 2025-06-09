export const GENRES = [
  { id: "rock", name: "Rock", emoji: "🎸", color: "from-red-500 to-orange-500", deezerGenreId: 152 },
  { id: "pop", name: "Pop", emoji: "🎤", color: "from-pink-500 to-purple-500", deezerGenreId: 132 },
  { id: "jazz", name: "Jazz", emoji: "🎷", color: "from-blue-500 to-indigo-500", deezerGenreId: 129 },
  { id: "electronic", name: "Electronic", emoji: "🎹", color: "from-green-500 to-teal-500", deezerGenreId: 106 },
  { id: "hiphop", name: "Hip Hop", emoji: "🎧", color: "from-yellow-500 to-red-500", deezerGenreId: 116 },
  // { id: "classical", name: "Classical", emoji: "🎻", color: "from-purple-500 to-pink-500", deezerGenreId: 98 },
  { id: "mbp", name: "MPB", emoji: "🇧🇷", color: "from-green-600 to-yellow-500", customApi: "/api/mbp/songs" },
  { id: "indie-rock", name: "Indie Rock", emoji: "🎨", color: "from-orange-500 to-red-600", customApi: "/api/indie-rock/songs" },
  { id: "classic-country", name: "Classic Country", emoji: "🤠", color: "from-amber-600 to-orange-600", customApi: "/api/classic-country/songs" },
]

export interface Genre {
  id: string
  name: string
  emoji: string
  color: string
  deezerGenreId?: number
  customApi?: string
}

export interface Song {
  id: number
  title: string
  artist: string
  preview: string
  cover: string
}

export interface DeezerGenre {
  id: number
  name: string
  picture?: string
}

export interface LeaderboardEntry {
  name: string
  score: number
  genre: string
  difficulty: string
}

export type Difficulty = "easy" | "hard"