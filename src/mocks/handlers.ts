import type { RequestHandler } from 'msw'

// Fixtures are parsed through the Zod schema so the mock can't drift from the contract,
// e.g. `const seed = () => [animeSchema.parse({ id: '1', title: 'Sample' })]`.

/** Restore the fixtures; called between tests so one test's writes don't leak into the next. */
export function resetMockData() {}

export const handlers: RequestHandler[] = []
