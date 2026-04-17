// stores/userStore.ts
import { defineStore } from 'pinia'

export interface User {
  id: number
  name: string
  email: string
  role?: string
}

interface UserState {
  user: User | null
  token: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') as string)
      : null,
    token: localStorage.getItem('token')
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    setUser(user: User, token: string) {
      this.user = user
      this.token = token

      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)
    },
    getUser() {
      return this.user
    },
    
    logout() {
      this.user = null
      this.token = null

      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
  }
})
