import { defineStore } from 'pinia'
import type { Order } from '@/types/order'
import axios from '@/utils/axios'

interface State {
  orders: Order[]
  currentPage: number
  lastPage: number
  totalPages: number  
  loading: boolean
}

export const useOrderStore = defineStore('order', {
  state: (): State => ({
    orders: [],
    currentPage: 1,
    lastPage: 1,
    totalPages: 1,
    loading: false
  }),

  actions: {
    async fetchOrders(page = 1) {
      this.loading = true
      try {
        const res = await axios.get('/orders', {
          params: { page }
        })

        this.orders = res.data.data
        this.currentPage = res.data.current_page
        this.lastPage = res.data.last_page
        this.totalPages = res.data.last_page
      } finally {
        this.loading = false
      }
    }
  }
})