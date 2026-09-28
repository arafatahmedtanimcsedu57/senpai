import { jikanAnimeSchema, type JikanAnime } from '../../features/season/schema'

// Raw Jikan v4 objects, shaped like the real API. Parsed through the schema below so the mock
// can't drift from the contract. Order is deliberately NOT by popularity.
function anime(
  id: number,
  title: string,
  titleEnglish: string | null,
  extra: { studio: string; day: string | null; episodes: number | null; members: number },
  genres: string[],
  synopsis: string | null = null,
): JikanAnime {
  return {
    mal_id: id,
    url: `https://myanimelist.net/anime/${id}`,
    title,
    title_english: titleEnglish,
    images: {
      jpg: {
        image_url: null,
        large_image_url: `https://cdn.myanimelist.net/images/anime/${id}l.jpg`,
      },
      webp: {
        image_url: null,
        large_image_url: `https://cdn.myanimelist.net/images/anime/${id}l.webp`,
      },
    },
    episodes: extra.episodes,
    synopsis,
    members: extra.members,
    studios: [{ name: extra.studio }],
    genres: genres.map((name) => ({ name })),
    broadcast: { day: extra.day },
    // Sakamoto Days has no season, so the "no season" path stays covered.
    season: id === 58939 ? null : 'fall',
    year: id === 58939 ? null : 2026,
  }
}

export const rawAnime: JikanAnime[] = [
  anime(
    52991,
    'Sousou no Frieren',
    "Frieren: Beyond Journey's End",
    { studio: 'Madhouse', day: 'Fridays', episodes: 28, members: 1_200_000 },
    ['Adventure', 'Drama', 'Fantasy'],
    'After the party defeats the Demon King, the elf mage Frieren sets out to understand the people she outlives.',
  ),
  anime(
    44511,
    'Chainsaw Man',
    'Chainsaw Man',
    { studio: 'MAPPA', day: 'Saturdays', episodes: 12, members: 2_800_000 },
    ['Action', 'Fantasy'],
  ),
  anime(
    57334,
    'Dandadan',
    'Dan Da Dan',
    { studio: 'Science SARU', day: 'Thursdays', episodes: 12, members: 900_000 },
    ['Action', 'Comedy', 'Supernatural'],
    'Momo believes in ghosts but not aliens; Okarun believes in aliens but not ghosts. A dare proves both are real.',
  ),
  anime(
    50265,
    'Spy x Family',
    'Spy x Family',
    { studio: 'CloverWorks', day: 'Saturdays', episodes: 13, members: 2_100_000 },
    ['Action', 'Comedy'],
  ),
  anime(
    54492,
    'Kusuriya no Hitorigoto',
    'The Apothecary Diaries',
    { studio: 'OLM', day: 'Fridays', episodes: 24, members: 700_000 },
    ['Drama', 'Mystery'],
  ),
  anime(
    52588,
    'Kaijuu 8-gou',
    'Kaiju No. 8',
    { studio: 'Production I.G', day: 'Saturdays', episodes: null, members: 800_000 },
    ['Action', 'Sci-Fi'],
  ),
  anime(
    49596,
    'Blue Lock',
    'Blue Lock',
    { studio: 'Eight Bit', day: 'Saturdays', episodes: 14, members: 1_000_000 },
    ['Sports'],
  ),
  anime(
    52034,
    'Oshi no Ko',
    '[Oshi no Ko]',
    { studio: 'Doga Kobo', day: 'Wednesdays', episodes: 11, members: 1_300_000 },
    ['Drama', 'Supernatural'],
  ),
  anime(
    58939,
    'Sakamoto Days',
    null,
    { studio: 'TMS Entertainment', day: 'Mondays', episodes: 11, members: 600_000 },
    ['Action', 'Comedy'],
  ),
  anime(
    39535,
    'Mushoku Tensei: Isekai Ittara Honki Dasu',
    'Mushoku Tensei: Jobless Reincarnation',
    { studio: 'Studio Bind', day: 'Sundays', episodes: 12, members: 1_500_000 },
    ['Drama', 'Fantasy'],
  ),
  anime(
    52299,
    'Ore dake Level Up na Ken',
    'Solo Leveling',
    { studio: 'A-1 Pictures', day: 'Saturdays', episodes: 12, members: 1_700_000 },
    ['Action', 'Adventure', 'Fantasy'],
  ),
  anime(
    40748,
    'Jujutsu Kaisen',
    'Jujutsu Kaisen',
    { studio: 'MAPPA', day: null, episodes: 24, members: 3_000_000 },
    ['Action', 'Supernatural'],
  ),
]

// Every fixture must satisfy the contract; this throws at import if one drifts.
rawAnime.forEach((raw) => jikanAnimeSchema.parse(raw))
