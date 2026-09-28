import { create } from 'zustand'

// Shared client/UI state. Add fields as features need them; select narrowly:
// const open = useUiStore((s) => s.sidebarOpen)
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface UiState {}

export const useUiStore = create<UiState>(() => ({}))
