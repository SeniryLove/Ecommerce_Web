export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image_url: string
}

export interface CheckoutItemPayload {
  id: number
  quantity: number
}

export interface CheckoutResponse {
  message: string
  order: {
    id: number
    total_amount: number
  }
}