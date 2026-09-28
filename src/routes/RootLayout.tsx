import { Link, Outlet } from 'react-router'
import { AppNav } from '@/components/AppNav'

// Shared shell around every page: wordmark + main nav (a bottom tab bar on phones).
export function RootLayout() {
  return (
    <div className="min-h-dvh pb-[calc(4rem+env(safe-area-inset-bottom))] desktop:pb-0">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-10 px-4 desktop:h-16 desktop:px-10">
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
