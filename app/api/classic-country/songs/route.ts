import { NextResponse } from "next/server"

const DEEZER_API_BASE = "https://api.deezer.com"

// Classic Country Artists with their Deezer IDs
const CLASSIC_COUNTRY_ARTISTS = [
  { id: 62346, name: "George Jones" },
  { id: 8462, name: "Tammy Wynette" },
  { id: 5098, name: "Loretta Lynn" },
  { id: 80729, name: "Tom T. Hall" },
  { id: 14783, name: "Conway Twitty" },
  { id: 70207, name: "Marty Robbins" },
  { id: 2947, name: "Willie Nelson" },
  { id: 8741, name: "Dolly Parton" },
  { id: 2737, name: "Townes Van Zandt" },
  { id: 147892, name: "Charlie Pride" },
  { id: 8510, name: "Merle Haggard" },
  { id: 8955, name: "Waylon Jennings" },
  { id: 69521, name: "Kris Kristofferson" },
  { id: 405, name: "Johnny Cash" },
  { id: 8493, name: "Hank Williams" },
  { id: 4602, name: "Patsy Cline" },
  { id: 97227, name: "Roy Acuff" },
  { id: 15602, name: "Buck Owens" },
  { id: 90482, name: "Ernest Tubb" },
  { id: 77507, name: "Lefty Frizzell" },
  { id: 71872, name: "Don Williams" },
  { id: 77014, name: "Gary Stewart" },
  { id: 178796, name: "Louvin Brothers" },
]

export async function GET() {
  try {
    // Get tracks from all classic country artists
    const songPromises = CLASSIC_COUNTRY_ARTISTS.map(async (artist) => {
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
      throw new Error("No valid songs found with preview URLs from classic country artists")
    }

    return NextResponse.json({
      songs,
      genre: "classic-country",
      artists: CLASSIC_COUNTRY_ARTISTS.map(a => a.name),
      count: songs.length,
    })
  } catch (error) {
    console.error("Error fetching classic country songs:", error)

    // Return fallback data if API fails
    const fallbackSongs = [
      {
        id: 1,
        title: "He Stopped Loving Her Today",
        artist: "George Jones",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 2,
        title: "Stand by Your Man",
        artist: "Tammy Wynette",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 3,
        title: "Coal Miner's Daughter",
        artist: "Loretta Lynn",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 4,
        title: "Old Dogs, Children and Watermelon Wine",
        artist: "Tom T. Hall",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 5,
        title: "Hello Darlin'",
        artist: "Conway Twitty",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 6,
        title: "El Paso",
        artist: "Marty Robbins",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 7,
        title: "On the Road Again",
        artist: "Willie Nelson",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 8,
        title: "Jolene",
        artist: "Dolly Parton",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 9,
        title: "Pancho and Lefty",
        artist: "Townes Van Zandt",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 10,
        title: "Kiss an Angel Good Mornin'",
        artist: "Charlie Pride",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 11,
        title: "White Lightning",
        artist: "George Jones",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 12,
        title: "D-I-V-O-R-C-E",
        artist: "Tammy Wynette",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 13,
        title: "You Ain't Woman Enough",
        artist: "Loretta Lynn",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 14,
        title: "9 to 5",
        artist: "Dolly Parton",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 15,
        title: "Mammas Don't Let Your Babies Grow Up to Be Cowboys",
        artist: "Willie Nelson",
        preview: "",
        cover: "/placeholder.svg?height=100&width=100",
      },
    ]

    return NextResponse.json({
      songs: fallbackSongs,
      genre: "classic-country",
      artists: CLASSIC_COUNTRY_ARTISTS.map(a => a.name),
      fallback: true,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}