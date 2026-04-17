<template>
  <div class="orders-page">
    <h1 class="page-title">我的訂單</h1>

    <div v-if="store.orders.length > 0" class="orders-list">
      <div
        v-for="order in store.orders"
        :key="order.id"
        class="order-card"
        @click="goDetail(order.id)"
      >
        <div class="order-header">
          <span class="order-id">訂單編號 #{{ order.id }}</span>
          <span class="order-date">{{ formatToLocal(order.created_at) }}</span>
        </div>
        <div class="order-body">
          <p>總金額: NT$ {{ Number(order.total_amount).toLocaleString() }}</p>
          <p>狀態: <span :class="statusClass(order.status)">{{ statusText(order.status) }}</span></p>
        </div>
      </div>
    </div>

    <div v-else class="no-orders">
      <p>查無任何訂單</p>
    </div>

    <!-- 分頁 -->
    <div class="pagination" v-if="store.totalPages > 1">
      <button
        v-for="page in store.totalPages"
        :key="page"
        :class="{ active: page === currentPage }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orderStore'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const store = useOrderStore()
const authStore = useAuthStore()

const currentPage = ref(1)

onMounted(async () => {
  store.fetchOrders(currentPage.value)
})

function goDetail(id: number) {
  router.push(`/orders/${id}`)
}

function changePage(page: number) {
  currentPage.value = page
  store.fetchOrders(page)
}

const statusText = (status: string) => {
  switch(status) {
    case 'pending': return '待付款'
    case 'paid': return '已付款'
    case 'shipped': return '已出貨'
    case 'completed': return '完成'
    case 'cancelled': return '已取消'
    default: return '未知狀態'
  }
}

const statusClass = (status: string) => {
  switch(status) {
    case 'pending': return 'status-pending'
    case 'paid': return 'status-paid'
    case 'shipped': return 'status-shipped'
    case 'completed': return 'status-completed'
    case 'cancelled': return 'status-cancelled'
    default: return ''
  }
}

function formatToLocal(datetimeUtc: string) {
  const date = new Date(datetimeUtc) // 會自動解析 UTC
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
</script>

<style scoped>
.orders-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Noto Sans TC', sans-serif;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
}

.orders-list {
  display: grid;
  gap: 15px;
}

.order-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.order-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.15);
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: 600;
}

.order-body p {
  margin: 5px 0;
}

.status-pending { color: orange; font-weight: 600; }
.status-paid { color: #10b981; font-weight: 600; } /* 綠色 */
.status-shipped { color: #3b82f6; font-weight: 600; } /* 藍色 */
.status-completed { color: #047857; font-weight: 600; } /* 深綠 */
.status-cancelled { color: #ef4444; font-weight: 600; } /* 紅色 */

.no-orders {
  text-align: center;
  font-size: 1.2rem;
  color: #777;
  margin-top: 50px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 25px;
  gap: 10px;
}

.pagination button {
  background: #f2f2f2;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination button.active {
  background: #409eff;
  color: #fff;
}

.pagination button:hover {
  background: #d9d9d9;
}
</style>