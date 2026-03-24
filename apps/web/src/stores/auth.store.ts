import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  username: string
  email: string
  role: string
  mfaEnabled: boolean
  channelId: string | null
  channel?: { id: string; name: string; code: string }
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  isAuthenticated: boolean
  setAuth: (tokens: { accessToken: string; refreshToken: string }, user: User) => void
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      setAuth: (tokens, user) =>
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user,
          isAuthenticated: true,
        }),
      setTokens: (tokens) =>
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        }),
      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'brayn-auth-storage',
    }
  )
)
