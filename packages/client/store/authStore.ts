import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStoreType {
    userProfile: any
    token: any
    addUser: (user: any) => void
    removeUser: () => void
    addToken: (token: string) => void
    removeToken: () => void
}

const authStore = (set: any) => ({
  userProfile: null,
  token: null,

  addUser: (user: any) => set({ userProfile: user }),
  removeUser: () => set({ userProfile: null }),
  addToken: (token: string) => set({ token }),
  removeToken: () => set({ token: null })
})

const useAuthStore = create<AuthStoreType>()(
  persist(authStore, {
    name: 'auth'
  })
)

export default useAuthStore
