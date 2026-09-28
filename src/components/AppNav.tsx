import { LayoutGrid, List, type LucideIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { cn } from '@/lib/utils'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Whether this section owns the current path. */
  match: (pathname: string) => boolean
}

// One item per section that exists. Tier list adds its own when it ships, so no
// tab ever leads to "Page not found".
const NAV_ITEMS: NavItem[] = [
  {
    to: '/',
    label: 'Season',
    icon: LayoutGrid,
    match: (path) => path === '/' || path.startsWith('/season/') || path.startsWith('/anime/'),
  },
  {
    to: '/watchlist',
    label: 'Watchlist',
    icon: List,
    match: (path) => path === '/watchlist',
  },
]

/** Main navigation: a bottom tab bar on phones, links in the header from the desktop breakpoint. */
export function AppNav() {
  const { pathname } = useLocation()
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-10 flex h-[calc(4rem+env(safe-area-inset-bottom))] border-t border-border bg-card px-2 pb-[env(safe-area-inset-bottom)] desktop:static desktop:h-auto desktop:gap-1 desktop:border-0 desktop:bg-transparent desktop:p-0"
    >
      {NAV_ITEMS.map(({ to, label, icon: Icon, match }) => {
        const current = match(pathname)
        return (
          <Link
            key={to}
            to={to}
            aria-current={current ? 'page' : undefined}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1 text-xs font-semibold',
              'desktop:h-10 desktop:flex-none desktop:flex-row desktop:gap-2 desktop:rounded-md desktop:px-3.5 desktop:text-sm',
              current ? 'text-primary desktop:bg-secondary' : 'text-muted-foreground',
            )}
          >
            <Icon aria-hidden="true" className="size-[22px] desktop:size-[18px]" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
