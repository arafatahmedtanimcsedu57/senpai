import { ShowGrid } from './ShowGrid'

const PLACEHOLDERS = Array.from({ length: 10 }, (_, index) => index)

/** Grey stand-ins shaped like show cards while the season loads. */
export function ShowGridSkeleton() {
  return (
    <div role="status" aria-label="Loading shows">
      <span className="sr-only">Loading shows</span>
      <ShowGrid>
        {PLACEHOLDERS.map((index) => (
          <div key={index} aria-hidden="true" className="flex animate-pulse flex-col gap-2.5">
            <div className="aspect-[2/3] w-full rounded-sm bg-muted" />
            <div className="h-3.5 w-4/5 rounded-full bg-muted" />
            <div className="h-3 w-[55%] rounded-full bg-muted" />
            <div className="h-9 w-full rounded-md bg-muted" />
          </div>
        ))}
      </ShowGrid>
    </div>
  )
}
