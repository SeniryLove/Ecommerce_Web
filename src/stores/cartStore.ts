import { defineStore } from 'pinia'
import axios from '@/utils/axios'
import type { CartItem, CheckoutItemPayload, CheckoutResponse } from '@/types/cart'
import type { Product } from '@/types/product'

interface CartState {
  items: CartItem[]
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: JSON.parse(localStorage.getItem('cart') || '[]')
  }),

  getters: {
    totalAmount: (state): number => {
      return state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
    },

    totalQuantity: (state): number => {
      return state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      )
    }
  },

  actions: {
    persist() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },

    addToCart(product: Product, quantity: number) {
      const existing = this.items.find(i => i.id === product.id)
      
      if (existing) {
        if (existing.quantity < product.stock) {
          existing.quantity += quantity
        }
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url ?? '',
          quantity: quantity
        })
      }

      this.persist()
    },

    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find(i => i.id === productId)
      if (!item) return

      if (quantity <= 0) {
        this.removeItem(productId)
      } else {
        item.quantity = quantity
      }

      this.persist()
    },

    removeItem(productId: number) {
      this.items = this.items.filter(i => i.id !== productId)
      this.persist()
    },

    clearCart() {
      this.items = []
      this.persist()
    },

    async checkout(): Promise<CheckoutResponse> {
      const payload: { items: CheckoutItemPayload[] } = {
        items: this.items.map(i => ({
          id: i.id,
          quantity: i.quantity
        }))
      }

      const response = await axios.post<CheckoutResponse>('/checkout', payload)

      this.clearCart()

      return response.data
    }
  }
})