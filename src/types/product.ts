export interface Product {
  id: number
  name: string
  price: number
  stock: number
  image_url?: string
  description?: string    // ✅ 修正 TS2339：新增 description 欄位
}

export interface ProductPagination {
  data: Product[]
  current_page: number
  last_page: number
}