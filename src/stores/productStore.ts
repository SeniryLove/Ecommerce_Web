import { defineStore } from 'pinia'
import type { Product } from '@/types/product'
import axios from '@/utils/axios'

interface State {
  products: Product[]
  currentPage: number
  lastPage: number
  loading: boolean
}

export const useProductStore = defineStore('product', {
  state: (): State => ({
    products: [],
    currentPage: 1,
    lastPage: 1,
    loading: false
  }),

  actions: {
    async fetchProducts(page = 1) {
      this.loading = true
      try {
        const res = await axios.get('/products', {
          params: { page }
        })
        this.products = res.data.data
        this.currentPage = res.data.current_page
        this.lastPage = res.data.last_page
        
      } finally {
        this.loading = false
      }
    }
  }
})
