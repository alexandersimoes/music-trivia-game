import { NextResponse } from "next/server"

// Deezer API doesn't require authentication for basic endpoints
const DEEZER_API_BASE = "https://api.deezer.com"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const genreId = searchParams.get("genreId")

  if (!genreId) {
    return NextResponse.json({ error: "Genre ID is required" }, { status: 400 })
  }

  try {
    // First, try to get artists from the genre
    const artistsResponse = await fetch(`${DEEZER_API_BASE}/genre/${genreId}/artists?limit=50`, {
      headers: {
        "User-Agent": "MusicTriviaGame/1.0",
      },
    })

    if (!artistsResponse.ok) {
      throw new Error(`Failed to fetch artists: ${artistsResponse.status}`)
    }

    const artistsData = await artistsResponse.json()

    if (artistsData.error) {
      throw new Error(artistsData.error.message || "Failed to fetch artists from Deezer")
    }

    const artists = artistsData.data || []

    if (artists.length === 0) {
      throw new Error("No artists found for this genre")
    }

    let filteredArtists = artists
    if (genreId === "152") {
      filteredArtists = artists.filter((artist: any) => !["Bring Me The Horizon", "Scorpions", "3 Doors Down", "Five Finger Death Punch", "Linkin Park", "Avenged Sevenfold", "Shinedown", "Breaking Benjamin", "Skillet", "Ghostemane", "Bring Me The Horizon", "Seether"].includes(artist.name))
    }

    const shuffledArtists = [...filteredArtists].sort(() => Math.random() - 0.5)

    // Get tracks from multiple artists to get variety
    const songPromises = shuffledArtists.slice(0, 15).map(async (artist: any) => {
      try {
        const tracksResponse = await fetch(`${DEEZER_API_BASE}/artist/${artist.id}/top?limit=8`, {
          headers: {
            "User-Agent": "MusicTriviaGame/1.0",
          },
        })

        if (!tracksResponse.ok) {
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
      .slice(0, 100) // Limit to 100 songs for the game

    // Shuffle the songs
    const shuffled = songs.sort(() => Math.random() - 0.5)

    if (shuffled.length === 0) {
      throw new Error("No valid songs found with preview URLs")
    }

    return NextResponse.json({
      songs: shuffled,
      genre: genreId,
      count: shuffled.length,
    })
  } catch (error) {
    console.error("Error fetching from Deezer:", error)

    // Return fallback data if API fails
    const fallbackSongs = [
      {
        id: 1,
        title: "Bohemian Rhapsody",
        artist: "Queen",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 2,
        title: "Stairway to Heaven",
        artist: "Led Zeppelin",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 3,
        title: "Hotel California",
        artist: "Eagles",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 4,
        title: "Sweet Child O' Mine",
        artist: "Guns N' Roses",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 5,
        title: "Smells Like Teen Spirit",
        artist: "Nirvana",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 6,
        title: "Billie Jean",
        artist: "Michael Jackson",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 7,
        title: "Like a Rolling Stone",
        artist: "Bob Dylan",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 8,
        title: "Purple Haze",
        artist: "Jimi Hendrix",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 9,
        title: "Imagine",
        artist: "John Lennon",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 10,
        title: "Good Vibrations",
        artist: "The Beach Boys",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
    ]

    return NextResponse.json({
      songs: fallbackSongs,
      genre: genreId,
      fallback: true,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
