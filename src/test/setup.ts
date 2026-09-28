import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { resetMockData } from '../mocks/handlers'
import { server } from '../mocks/server'
import { useSessionStore } from '../stores/useSessionStore'
import { useUiStore } from '../stores/useUiStore'
import { useWatchlistStore } from '../stores/useWatchlistStore'

const initialUiState = useUiStore.getState()
const initialSessionState = useSessionStore.getState()
const initialWatchlistState = useWatchlistStore.getState()

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  resetMockData()
  useUiStore.setState(initialUiState, true)
  useSessionStore.setState(initialSessionState, true)
  useWatchlistStore.setState(initialWatchlistState, true)
  localStorage.clear()
  cleanup()
})
afterAll(() => server.close())
