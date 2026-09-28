import { data, type RouteObject } from 'react-router'
import { parseSeasonParams } from '../lib/season'
import { RootLayout } from './RootLayout'
import { RouteError } from './RouteError'
import { RouteLoading } from './RouteLoading'

// Every page in the app. Add a page: create src/routes/<Name>Page.tsx and add a child here.
// Pages are lazy-loaded so each one becomes its own chunk and the first load stays small.
// `handle.heroHeader`: on desktop the header sits transparently over the page's featured hero.
// The root errorElement catches render errors in any page and unknown URLs (404).
export const routes: RouteObject[] = [
  {
    path: '/',
    Component: RootLayout,
    errorElement: <RouteError />,
    HydrateFallback: RouteLoading,
    children: [
      {
        index: true,
        handle: { heroHeader: true },
        lazy: async () => ({ Component: (await import('./SeasonPage')).SeasonPage }),
      },
      {
        path: 'season/:year/:season',
        handle: { heroHeader: true },
        // A malformed season (e.g. /season/2025/autumn) is a 404, shown by RouteError.
        loader: ({ params }) => {
          if (!parseSeasonParams(params)) throw data(null, { status: 404 })
          return null
        },
        lazy: async () => ({ Component: (await import('./SeasonPage')).SeasonPage }),
      },
      {
        path: 'anime/:id',
        // A non-numeric id (e.g. /anime/abc) is a 404, shown by RouteError.
        loader: ({ params }) => {
          if (!/^\d+$/.test(params.id ?? '')) throw data(null, { status: 404 })
          return null
        },
        lazy: async () => ({ Component: (await import('./ShowDetailPage')).ShowDetailPage }),
      },
      {
        path: 'watchlist',
        lazy: async () => ({ Component: (await import('./WatchlistPage')).WatchlistPage }),
      },
    ],
  },
]
