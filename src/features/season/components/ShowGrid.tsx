import type { ReactNode } from 'react'

export interface ShowGridProps {
  children: ReactNode
}

/** 2 columns on phones, 5 from the desktop breakpoint. */
export function ShowGrid({ children }: ShowGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 desktop:grid-cols-5 desktop:gap-x-6 desktop:gap-y-8">
      {children}
    </div>
  )
}
