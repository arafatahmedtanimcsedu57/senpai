export interface GenreChipsProps {
  genres: string[]
}

export function GenreChips({ genres }: GenreChipsProps) {
  if (genres.length === 0) return null
  return (
    <ul aria-label="Genres" className="flex flex-wrap gap-2">
      {genres.map((genre) => (
        <li
          key={genre}
          className="flex h-7 items-center rounded-full bg-secondary px-3 text-xs font-semibold tracking-[0.04em] uppercase"
        >
          {genre}
        </li>
      ))}
    </ul>
  )
}
