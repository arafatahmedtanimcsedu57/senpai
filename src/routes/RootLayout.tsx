import { Link, Outlet, useMatches } from 'react-router'
import { AppNav } from '@/components/AppNav'
import { cn } from '@/lib/utils'

// Shared shell around every page: wordmark + main nav (a bottom tab bar on phones). Routes with
// `handle.heroHeader` get a transparent header over the top of the page on desktop.
export function RootLayout() {
  const heroHeader = useMatches().some(
    (match) => (match.handle as { heroHeader?: boolean } | undefined)?.heroHeader,
  )
  return (
    <div className="min-h-dvh pb-[calc(4rem+env(safe-area-inset-bottom))] desktop:pb-0">
      <header
        data-hero={heroHeader || undefined}
        className={cn(
          'border-b border-border',
          heroHeader &&
            'desktop:absolute desktop:inset-x-0 desktop:top-0 desktop:z-20 desktop:border-0 desktop:bg-[linear-gradient(180deg,color-mix(in_oklab,var(--background)_90%,transparent)_0%,transparent_100%)]',
        )}
      >
        <div
          className={cn(
            'mx-auto flex h-14 max-w-[1280px] items-center gap-10 px-4 desktop:h-16 desktop:px-10',
            heroHeader && 'desktop:h-18',
          )}
        >
          <Link
            to="/"
            className="font-heading text-lg font-bold tracking-[-0.02em] text-foreground desktop:text-[1.375rem]"
          >
            senpai<span className="text-primary">.</span>
          </Link>
          <AppNav />
        </div>
      </header>
      <Outlet />
    </div>
  )
}
