/** Grey stand-ins in the detail layout while the show loads. */
export function ShowDetailSkeleton() {
  return (
    <div role="status" aria-label="Loading show">
      <h1 className="sr-only">Loading show</h1>
      <div
        aria-hidden="true"
        className="flex animate-pulse flex-col gap-5 desktop:flex-row desktop:gap-12"
      >
        <div className="aspect-[2/3] w-[120px] rounded-sm bg-muted desktop:w-[300px] desktop:rounded-lg" />
        <div className="flex flex-1 flex-col gap-4">
          <div className="h-8 w-2/3 rounded-full bg-muted" />
          <div className="h-7 w-1/2 rounded-full bg-muted" />
          <div className="h-24 w-full max-w-[620px] rounded-md bg-muted" />
          <div className="h-11 w-44 rounded-md bg-muted" />
        </div>
      </div>
    </div>
  )
}
