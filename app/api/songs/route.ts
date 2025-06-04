import { NextResponse } from "next/server"

// This is a mock API endpoint
// In a real application, you would integrate with a music API like Spotify, Deezer, or Last.fm
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const genre = searchParams.get("genre")

  // Mock response - in production, fetch from actual music API
  const mockSongs = {
    rock: [
      {
        id: 1,
        artist: "Queen",
        title: "Bohemian Rhapsody",
        preview_url: "https://example.com/preview1.mp3",
        duration: 30,
      },
    ],
    pop: [
      {
        id: 2,
        artist: "Taylor Swift",
        title: "Shake It Off",
        preview_url: "https://example.com/preview2.mp3",
        duration: 30,
      },
    ],
  }

  return NextResponse.json({
    songs: mockSongs[genre as keyof typeof mockSongs] || [],
    genre: genre,
  })
}
