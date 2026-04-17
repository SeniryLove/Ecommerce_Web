import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

// ✅ 修正 TS2339：擴充 Window 介面以宣告 Pusher 屬性
declare global {
  interface Window {
    Pusher: typeof Pusher
  }
}

window.Pusher = Pusher

export const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: 'ap3',
  forceTLS: true
})
