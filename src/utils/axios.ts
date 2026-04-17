import axios from 'axios'

const BACKEND_BASE = import.meta.env.VITE_BACKEND_HOST;

const instance = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL,
  baseURL: `${BACKEND_BASE}/api`,
  withCredentials: true
})

// ­Y§A¨Ï¥Î token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default instance