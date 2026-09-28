# Architecture

Tech decisions and design tokens. **Owned by a human.** The agent reads this before writing
UI or data code and must not change a decision here without asking. Each decision records
who made it and when, so a later reader knows it was deliberate.

## Decisions

| Area                         | Decision                                                           | Decided by / date |
| ---------------------------- | ------------------------------------------------------------------ | ----------------- |
| Framework                    | Vite 8 + React 19 + TypeScript 6 (strict)                          | starter default   |
| Styling                      | Tailwind CSS 4                                                     | owner, 2026-09-28 |
| UI component library         | shadcn/ui (Radix base, `src/components/ui/`)                       | owner, 2026-09-28 |
| Server state / data fetching | RTK Query (fixed rule, see CLAUDE.md)                              | starter default   |
| Client / UI state            | Zustand (fixed rule)                                               | starter default   |
| Forms + validation           | React Hook Form + Zod (fixed rule)                                 | starter default   |
| Routing                      | React Router 8, lazy route per page                                | starter default   |
| Config / env                 | `VITE_*` validated by Zod in `src/lib/env.ts`                      | starter default   |
| Auth transport               | Bearer token, held in memory (Zustand)                             | starter default   |
| Quality floors               | Coverage ≥80% lines; ≤180 kB gzip per JS chunk                     | starter default   |
| Error tracking               | Sentry, lazy-loaded, on only when DSN is set                       | starter default   |
| User data (watchlist, tiers) | Browser only — Zustand `persist` → localStorage, no accounts in v1 | owner, 2026-09-28 |

Replace "starter default" with a name and date when your team confirms or changes a row.

## API contract

| Domain                       | Source                                                                                                                                                                                               | Case (CLAUDE.md)                                                                                             | Mocked?                  |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------ |
| anime (seasons, show detail) | [Jikan v4](https://docs.api.jikan.moe/) — public MyAnimeList API; [OpenAPI spec](https://raw.githubusercontent.com/jikan-me/jikan-rest/master/storage/api-docs/api-docs.json) used as reference only | 1 (partial) — hand-written RTK Query endpoints + Zod schemas of the fields we use, `transformResponse` guard | Yes — MSW in dev + tests |

Jikan is read-only, needs no auth and allows CORS. Rate limit: 3 requests/s, 60/min —
keep RTK Query caching on and don't fire a request per card. Endpoints in v1:
`GET /seasons/now`, `GET /seasons/{year}/{season}`, `GET /anime/{id}`. Decided by owner,
2026-09-28.

When a real backend ships, record its base URL and who owns the contract on that side.

| Environment | `VITE_API_URL`             | Owner                        |
| ----------- | -------------------------- | ---------------------------- |
| local       | `/api` (mocks or proxy)    |                              |
| staging     | `https://api.jikan.moe/v4` | Jikan (community, jikan.moe) |
| production  | `https://api.jikan.moe/v4` | Jikan (community, jikan.moe) |

## Design (Claude Design)

| Artifact       | Link                                                                                                                   |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Design System  | [Senpai Design System](https://claude.ai/artifact/9mqJBv2FRVSgAN2TAxqzRS)                                              |
| Project canvas | [senpai canvas](https://claude.ai/artifact/BBAn1TPTZbbKJqqXAgCxbY) — pages: `season-browser`, `watchlist`, `tier-list` |

Breakpoints designed for: mobile 390, desktop 1280. Theme: "Sakura night" — dark-first
(`<html class="dark">`), full light theme too. Artboards: `<page>/<State>-<mobile|desktop>.dc.html`.
The repo copy of what's built lives in `design/` — see CLAUDE.md → UI design.

## Design tokens

Tokens come from the Design System above and flow into the `@theme` block in `src/styles/index.css` (Tailwind 4). Never hand-copy values into
components.

| Token                  | Dark / Light                                      | Notes                                          |
| ---------------------- | ------------------------------------------------- | ---------------------------------------------- |
| color.background       | `#0f1020` / `#fafafc`                             | `bg-background`                                |
| color.foreground       | `#f1f0fa` / `#16172b`                             | `text-foreground`                              |
| color.card             | `#181a30` / `#ffffff`                             | cards, rows, tier rows                         |
| color.primary          | `#ff4d8d` / `#d61f63`                             | sakura pink — main action; `bg-primary`        |
| color.primary-fg       | `#0f1020` / `#ffffff`                             | text on primary                                |
| color.spark            | `#8b70ff` / `#6a45f0`                             | violet — progress, focus ring; `bg-spark`      |
| color.secondary        | `#25274a` / `#eeedf7`                             | secondary buttons, chips (also `accent`)       |
| color.muted-foreground | `#a3a4c2` / `#5e607a`                             | metadata text                                  |
| color.border           | `#2c2e52` / `#e1e0ee`                             | also `input`                                   |
| color.destructive      | `#ff6b6b` / `#d62d3a`                             | errors, remove                                 |
| color.night            | `#25274a`                                         | poster panels (both themes); `bg-night`        |
| color.tier-s … tier-d  | `#ff5a5f` `#ff9f43` `#ffd84d` `#4cd9a0` `#4da3ff` | `bg-tier-s`…; text `text-tier-ink` (`#0f1020`) |
| font.display           | Unbounded 600–800                                 | `font-heading` — titles, tier letters only     |
| font.body              | Inter 400/600                                     | `font-sans`                                    |
| radius.base            | 12px                                              | `--radius`; sm 8, lg 16, full 9999             |
| spacing                | 4px grid                                          | gutters 16 mobile / 32 desktop                 |

## Open decisions

Things the team hasn't settled yet. The agent asks about these instead of picking one.

- Hosting / preview deploys (docs assume Vercel; nothing is wired yet). Whatever host is
  chosen must serve `index.html` for unknown paths (SPA fallback) or deep links will 404.
- Token refresh: `src/services/baseQuery.ts` signs out on 401; refresh-and-retry needs the
  backend's refresh endpoint.
- Error monitoring (e.g. Sentry) — `RouteError` logs to the console only.
