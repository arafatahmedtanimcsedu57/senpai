import type { ReactNode, Ref } from 'react'
import { Tabs } from 'radix-ui'
import { cn } from '@/lib/utils'
import type { WatchStatus } from '@/types/anime'
import { isWatchStatus, STATUS_LABEL, STATUS_ORDER } from '../status'

export interface StatusTabsProps {
  value: WatchStatus
  onValueChange: (status: WatchStatus) => void
  counts: Record<WatchStatus, number>
  /** The selected tab's panel. */
  children: ReactNode
  /** The panel element (focusable), e.g. to keep focus when a row leaves the tab. */
  panelRef?: Ref<HTMLDivElement>
}

/** Watching / Plan to watch / Completed / Dropped as pills with counts; arrow keys move between them. */
export function StatusTabs({ value, onValueChange, counts, children, panelRef }: StatusTabsProps) {
  return (
    <Tabs.Root
      value={value}
      onValueChange={(next) => {
        if (isWatchStatus(next)) onValueChange(next)
      }}
      className="flex flex-col gap-5 desktop:gap-8"
    >
      <Tabs.List
        aria-label="Filter by status"
        // Four pills don't fit a phone: scroll sideways instead of clipping the last one.
        className="-mx-4 flex gap-2 overflow-x-auto px-4 desktop:mx-0 desktop:px-0"
      >
        {STATUS_ORDER.map((status) => (
          <Tabs.Trigger
            key={status}
            value={status}
            className={cn(
              'inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[0.8125rem] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              'border-border text-muted-foreground hover:text-foreground',
              'data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
            )}
          >
            {/* The space keeps the name "Watching 3" rather than "Watching3". */}
            {STATUS_LABEL[status]} <span className="tabular-nums opacity-80">{counts[status]}</span>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      <Tabs.Content ref={panelRef} value={value} className="outline-none">
        {children}
      </Tabs.Content>
    </Tabs.Root>
  )
}
