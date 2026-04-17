export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user'
}

export interface LoginResponse {
  token: string
  user: User
}