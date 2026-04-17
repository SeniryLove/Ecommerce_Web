import type { Product } from '@/types/product'

// ✅ 新增 OrderItem 介面，供 OrderDetail.vue 使用
export interface OrderItem {
  id: number
  price: number
  quantity: number
  subtotal: number
  product: Product
}

export interface Order {
  id: number
  name: string
  total_amount: number
  status: string
  created_at: string
  payment_status?: string        // ✅ 供 paymentStore 使用
  items: OrderItem[]             // ✅ 修正 TS2339：新增 items 欄位
  product: Product[]
}

export interface OrderPagination {
  data: Order[]
  current_page: number
  last_page: number
}
