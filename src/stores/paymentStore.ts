import { defineStore } from 'pinia'
import api from '@/utils/axios'
import type { Order } from '@/types/order'

interface PaymentState {
  order: (Order & { payment_status?: string }) | null
  loading: boolean
  error: string | null
  pollingInterval: ReturnType<typeof setInterval> | null
}

export const usePaymentStore = defineStore('payment', {
  state: (): PaymentState => ({
    order: null,
    loading: false,
    error: null,
    pollingInterval: null,
  }),

  actions: {
    async fetchOrder(orderId: number) {
      this.loading = true
      try {
        const res = await api.get(`/orders/${orderId}`)
        this.order = res.data
      } catch (e: unknown) {
        const err = e as { response?: { data?: string } }
        this.error = err.response?.data ?? 'Order fetch failed'
      } finally {
        this.loading = false
      }
    },

    startPolling(orderId: number) {
      this.stopPolling()

      this.pollingInterval = setInterval(async () => {
        await this.fetchOrder(orderId)

        if (this.order?.payment_status === 'paid') {
          this.stopPolling()
        }
      }, 3000)
    },

    stopPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval)
        this.pollingInterval = null
      }
    }
  }
})
