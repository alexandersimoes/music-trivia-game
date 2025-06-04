import { NextResponse } from "next/server"

const DEEZER_API_BASE = "https://api.deezer.com"

export async function GET() {
  try {
    const response = await fetch(`${DEEZER_API_BASE}/genre`, {
      headers: {
        "User-Agent": "MusicTriviaGame/1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch genres: ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error.message || "Failed to fetch genres from Deezer")
    }

    // Transform the data to match our expected format
    const genres = data.data?.map((genre: any) => ({
      id: genre.id,
      name: genre.name,
      picture: genre.picture || genre.picture_medium || genre.picture_small,
    })) || []

    return NextResponse.json({
      genres: genres,
      count: genres.length,
    })
  } catch (error) {
    console.error("Error fetching genres from Deezer:", error)

    // Return fallback genres if API fails
    const fallbackGenres = [
      { id: 152, name: "Rock", picture: null },
      { id: 132, name: "Pop", picture: null },
      { id: 129, name: "Jazz", picture: null },
      { id: 106, name: "Electronic", picture: null },
      { id: 116, name: "Hip Hop", picture: null },
      { id: 98, name: "Classical", picture: null },
      { id: 113, name: "Blues", picture: null },
      { id: 85, name: "Alternative", picture: null },
      { id: 153, name: "Indie", picture: null },
      { id: 144, name: "Reggae", picture: null },
    ]

    return NextResponse.json({
      genres: fallbackGenres,
      fallback: true,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}