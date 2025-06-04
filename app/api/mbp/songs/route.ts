import { NextResponse } from "next/server"

const DEEZER_API_BASE = "https://api.deezer.com"

// MBP Artists with their Deezer IDs
const MBP_ARTISTS = [
  { id: 232, name: "Caetano Veloso" },
  { id: 2077, name: "Gilberto Gil" },
  { id: 4917, name: "Jorge Ben Jor" },
  { id: 110459, name: "Os Mutantes" },
  { id: 9248294, name: "Secos & Molhados" },
  { id: 3543, name: "Chico Buarque" },
  { id: 15827, name: "Elis Regina" },
  { id: 12038, name: "Gal Costa" },
  { id: 15588, name: "Maria Bethânia" },
  { id: 4720, name: "Milton Nascimento" },
  { id: 14687, name: "Djavan" },
  { id: 183051, name: "Erasmo Carlos" },
  { id: 12727, name: "João Bosco" },
  { id: 55599, name: "Baden Powell" },
  { id: 215594, name: "Zé Ramalho" },
  { id: 241426, name: "Novos Baianos" },
  { id: 13704, name: "Tim Maia" },
  { id: 95768, name: "Belchior" },
  { id: 15552, name: "Ney Matogrosso" },
  { id: 12144, name: "Raul Seixas" },
  { id: 12614, name: "Zeca Baleiro" },
  { id: 13523, name: "Marisa Monte" }
];

export async function GET() {
  try {
    // Get tracks from all MBP artists
    const songPromises = MBP_ARTISTS.map(async (artist) => {
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
      .sort(() => Math.random() - 0.5) // Shuffle the songs
      .slice(0, 100) // Limit to 100 songs for the game

    if (songs.length === 0) {
      throw new Error("No valid songs found with preview URLs from MBP artists")
    }

    return NextResponse.json({
      songs,
      genre: "mbp",
      artists: MBP_ARTISTS.map(a => a.name),
      count: songs.length,
    })
  } catch (error) {
    console.error("Error fetching MBP songs:", error)

    // Return fallback data if API fails
    const fallbackSongs = [
      {
        id: 1,
        title: "Tropicália",
        artist: "Caetano Veloso",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 2,
        title: "Aquele Abraço",
        artist: "Gilberto Gil",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 3,
        title: "Mas, Que Nada!",
        artist: "Jorge Ben Jor",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 4,
        title: "Panis et Circencis",
        artist: "Os Mutantes",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 5,
        title: "O Vira",
        artist: "Secos E Molhados",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 6,
        title: "Alegria, Alegria",
        artist: "Caetano Veloso",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 7,
        title: "Expresso 2222",
        artist: "Gilberto Gil",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 8,
        title: "País Tropical",
        artist: "Jorge Ben Jor",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 9,
        title: "A Minha Menina",
        artist: "Os Mutantes",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 10,
        title: "Sangue Latino",
        artist: "Secos E Molhados",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
    ]

    return NextResponse.json({
      songs: fallbackSongs,
      genre: "mbp",
      artists: MBP_ARTISTS.map(a => a.name),
      fallback: true,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}