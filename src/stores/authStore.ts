import { defineStore } from 'pinia'
import axios from '@/utils/axios'
import type { User, LoginResponse } from '@/types/auth'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token'),
    loading: false
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.token,
    isAdmin: (state): boolean => state.user?.role === 'admin'
  },

  actions: {
    persist() {
      if (this.token) {
        localStorage.setItem('token', this.token)
      }
      if (this.user) {
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    },

    async login(email: string, password: string) {
      this.loading = true
      try {
        const res = await axios.post<LoginResponse>('/login', {
          email,
          password
        })

        this.token = res.data.token
        this.user = res.data.user

        this.persist()
      } finally {
        this.loading = false
      }
    },

    // OAuth µn¤J¥Î
    setAuth(data: LoginResponse) {
      this.token = data.token
      this.user = data.user
      this.persist()
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})