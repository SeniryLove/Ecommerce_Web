<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { ShoppingCart, LogIn, LogOut, ClipboardList } from 'lucide-vue-next'

const auth = useAuthStore()
const router = useRouter()

function goLogin() {
  router.push('/login')
}

function goCart() {
  router.push('/cart')
}

function goOrders() {
  router.push('/orders')
}

function goMainPage() {
  router.push('/')
}

function logout() {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <nav class="navbar">

    <!-- 品牌 -->
    <div class="brand" @click="goMainPage">
      <span class="logo-text">家家水果農場</span>
    </div>

    <!-- 功能區 -->
    <div class="nav-actions">

      <!-- 未登入 -->
      <button 
        v-if="!auth.isAuthenticated"
        class="btn primary"
        @click="goLogin"
      >
        <LogIn class="icon" />
        登入 / 註冊
      </button>

      <!-- 已登入 -->
      <template v-else>

        <!-- 使用者名稱與角色 -->
        <div class="user-info">
          {{ auth.user?.name }}
          <span class="user-role">({{ auth.user?.role }})</span>
        </div>

        <button class="btn ghost" @click="goOrders">
          <ClipboardList class="icon" />
          我的訂單
        </button>

        <button class="btn ghost" @click="goCart">
          <ShoppingCart class="icon" />
          購物車
        </button>

        <button class="btn danger" @click="logout">
          <LogOut class="icon" />
          登出
        </button>

      </template>

    </div>

  </nav>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 18px 40px;
  background: white;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
}

/* 品牌 */
.brand {
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
}

.brand:hover {
  transform: scale(1.05);
}

.logo-text {
  background: linear-gradient(90deg, #2a9d8f, #38b000);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 功能區 */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

/* 使用者名稱與角色 */
.user-info {
  font-weight: 500;
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  padding: 0 10px;
  white-space: nowrap;
}
.user-role {
  font-size: 13px;
  color: #666;
  margin-left: 4px;
}

/* 按鈕 */
.btn {
  display: flex;
  align-items: center;
  gap: 6px;

  padding: 8px 16px;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: 0.25s;
}

.icon {
  width: 18px;
  height: 18px;
}

/* 主按鈕 */
.primary {
  background: #2a9d8f;
  color: white;
}

.primary:hover {
  background: #21867a;
}

/* 次按鈕 */
.ghost {
  background: #f3f4f6;
}

.ghost:hover {
  background: #e5e7eb;
}

/* 危險 */
.danger {
  background: #e63946;
  color: white;
}

.danger:hover {
  background: #c82333;
}

/* 響應式：手機版自動隱藏角色文字 */
@media (max-width: 640px) {
  .user-role {
    display: none;
  }

  .nav-actions {
    gap: 8px;
  }

  .btn {
    padding: 6px 12px;
    font-size: 13px;
  }

  .icon {
    width: 16px;
    height: 16px;
  }
}
</style>
