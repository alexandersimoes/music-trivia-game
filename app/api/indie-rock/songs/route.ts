import { NextResponse } from "next/server"

const DEEZER_API_BASE = "https://api.deezer.com"

// Indie Rock Artists with their Deezer IDs
const INDIE_ROCK_ARTISTS = [
  { id: 1023, name: "Elliott Smith" },
  { id: 569, name: "The Strokes" },
  { id: 1676, name: "Pavement" },
  { id: 134790, name: "Tame Impala" },
  { id: 2020, name: "Broken Social Scene" },
  { id: 11003, name: "Built to Spill" },
  { id: 1280, name: "Spoon" },
  { id: 6786, name: "Animal Collective" },
  { id: 642, name: "LCD Soundsystem" },
  { id: 1700, name: "Wilco" },
  { id: 636, name: "The White Stripes" },
  { id: 2344, name: "CAN" },
  { id: 15, name: "Phoenix" },
  { id: 8016, name: "The Lemonheads" },
  { id: 6630050, name: "Mitski" },
  { id: 13681561, name: "Wishy" },
  { id: 137555232, name: "Geese" },
  { id: 134334152, name: "Wet Leg" },
  { id: 5298885, name: "Alvvays" },
  { id: 5488, name: "The Weakerthans" },
]

export async function GET() {
  try {
    // Get tracks from all indie rock artists
    const songPromises = INDIE_ROCK_ARTISTS.map(async (artist) => {
      try {
        const tracksResponse = await fetch(`${DEEZER_API_BASE}/artist/${artist.id}/top?limit=15`, {
          headers: {
            "User-Agent": "MusicTriviaGame/1.0",
          },
        })

        if (!tracksResponse.ok) {
          console.warn(`Failed to fetch tracks for ${artist.name} (${artist.id})`)
          return []
        }

        const tracksData = await tracksResponse.json()
        return tracksData.data || []
      } catch (error) {
        console.error(`Error fetching tracks for artist ${artist.id}:`, error)
        return []
      }
    })

    const allTracks = await Promise.all(songPromises)
    const flatTracks = allTracks.flat()

    // Filter tracks with preview URLs and format for our game
    const songs = flatTracks
      .filter((track: any) => track && track.preview && track.artist && track.title) // Only include tracks with preview URLs
      .map((track: any) => ({
        id: track.id,
        title: track.title,
        artist: track.artist.name,
        preview: track.preview,
        cover: track.album?.cover_medium || track.album?.cover || "/placeholder.svg?height=100&width=100",
      }))
      .sort(() => Math.random() - 0.5)
      .slice(0, 100) // Limit to 100 songs for the game


    if (songs.length === 0) {
      throw new Error("No valid songs found with preview URLs from indie rock artists")
    }

    return NextResponse.json({
      songs,
      genre: "indie-rock",
      artists: INDIE_ROCK_ARTISTS.map(a => a.name),
      count: songs.length,
    })
  } catch (error) {
    console.error("Error fetching indie rock songs:", error)

    // Return fallback data if API fails
    const fallbackSongs = [
      {
        id: 1,
        title: "Miss Misery",
        artist: "Elliott Smith",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 2,
        title: "Last Nite",
        artist: "The Strokes",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 3,
        title: "Cut Your Hair",
        artist: "Pavement",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 4,
        title: "Elephant",
        artist: "Tame Impala",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 5,
        title: "Dance Yrself Clean",
        artist: "LCD Soundsystem",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 6,
        title: "Seven Nation Army",
        artist: "The White Stripes",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 7,
        title: "1901",
        artist: "Phoenix",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 8,
        title: "First Time",
        artist: "Mitski",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 9,
        title: "Chaise Longue",
        artist: "Wet Leg",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 10,
        title: "Archie, Marry Me",
        artist: "Alvvays",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 11,
        title: "Jesus, Etc.",
        artist: "Wilco",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 12,
        title: "Into Your Arms",
        artist: "The Lemonheads",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 13,
        title: "The Way We Get By",
        artist: "Spoon",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 14,
        title: "My Girls",
        artist: "Animal Collective",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 15,
        title: "Left and Leaving",
        artist: "The Weakerthans",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
    ]

    return NextResponse.json({
      songs: fallbackSongs,
      genre: "indie-rock",
      artists: INDIE_ROCK_ARTISTS.map(a => a.name),
      fallback: true,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}