import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: number
  username: string
  role: 'admin' | 'operator'
  storeIds: number[]
  asinIds: number[]
  permissions: {
    upload: boolean
    analyze: boolean
    dashboard: boolean
    knowledge: boolean
    export: boolean
    tasks: boolean
    newProduct: boolean
    manageModels: boolean
  }
  apiQuotaLimit: number
  apiCostLimit: number
}

interface AuthState {
  token: string | null
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      updateUser: (partial) => set((s) => s.user ? { user: { ...s.user, ...partial } } : {}),
    }),
    { name: 'ai-workbench-auth' }
  )
)
