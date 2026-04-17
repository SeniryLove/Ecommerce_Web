<template>
  <div class="order-detail-page" v-if="order">
    <button class="back-btn" @click="prevPage">← 返回訂單列表</button>

    <div class="order-header">
      <div>
        <h2>訂單編號 #{{ order.id }}</h2>
        <span class="order-date">下單日期：{{ formatToLocal(order.created_at) }}</span>
      </div>
      <div class="action-buttons">
        <span class="order-status" :class="statusClass(order.status)">
          {{ statusText(order.status) }}
        </span>
        <!-- 待付款顯示前往付款 -->
        <button
          v-if="order.status === 'pending'"
          class="pay-btn"
          @click="goToPayment"
        >
          前往付款
        </button>
        <!-- 待付款顯示取消訂單 -->
        <button
          v-if="order.status === 'pending'"
          class="cancel-btn"
          @click="cancelOrder"
        >
          取消訂單
        </button>
      </div>
    </div>

    <div class="order-items">
      <h3>商品清單</h3>
      <div
        v-for="item in order.items"
        :key="item.id"
        class="order-item-card"
      >
        <img :src="item.product.image_url" alt="" class="product-img" />
        <div class="item-info">
          <p class="product-name">{{ item.product.name }}</p>
          <p>單價：NT$ {{ Number(item.price).toLocaleString() }}</p>
          <p>數量：{{ item.quantity }}</p>
          <p>小計：NT$ {{ Number(item.subtotal).toLocaleString() }}</p>
        </div>
      </div>
    </div>

    <div class="order-summary">
      <h3>訂單總金額：NT$ {{ Number(order.total_amount).toLocaleString() }}</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from '@/utils/axios'
import { useRoute, useRouter } from 'vue-router'
import type { Order } from '@/types/order'  // ✅ 修正 TS1484：加上 type

const route = useRoute()
const router = useRouter()

const order = ref<Order | null>(null)

onMounted(async () => {
  await fetchOrder()
})

async function fetchOrder() {
  const res = await axios.get(`/orders/${route.params.id}`)
  order.value = res.data
}

const statusText = (status: string) => {
  switch(status) {
    case 'pending': return '待付款'
    case 'processing': return '處理中'
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
    case 'processing': return 'status-processing'
    case 'paid': return 'status-paid'
    case 'shipped': return 'status-shipped'
    case 'completed': return 'status-completed'
    case 'cancelled': return 'status-cancelled'
    default: return ''
  }
}

function prevPage() {
  router.push('/orders')
}

function goToPayment() {
  if(order.value)
    router.push(`/payment/${order.value.id}`)
}

// 取消訂單
async function cancelOrder() {
  if(!order.value) return
  if(!confirm('確定要取消此訂單嗎？')) return

  try {
    const res = await axios.post(`/orders/${order.value.id}/cancel`)
    alert(res.data.message)
    if(res.data.success) {
      await fetchOrder() // 重新抓取訂單更新狀態
    }
  } catch (err: any) {
    alert(err.response?.data?.message || '取消失敗')
  }
}

function formatToLocal(datetimeUtc: string) {
  const date = new Date(datetimeUtc)
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
.order-detail-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Noto Sans TC', sans-serif;
}

.back-btn {
  background: #f2f2f2;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: #d9d9d9;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 12px;
}

.order-date {
  color: #666;
  display: block;
  margin-top: 4px;
}

.order-status { font-weight: 600; }

.status-pending { color: orange; }
.status-processing { color: #f59e0b; }
.status-paid { color: #10b981; }
.status-shipped { color: #3b82f6; }
.status-completed { color: #047857; }
.status-cancelled { color: #ef4444; }

/* 按鈕樣式 */
.action-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pay-btn {
  background: #f97316; 
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.pay-btn:hover {
  background: #ea580c;
}

.cancel-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: #dc2626;
}

.order-items h3 {
  margin-bottom: 15px;
}

.order-item-card {
  display: flex;
  gap: 15px;
  background: #fff;
  padding: 15px;
  margin-bottom: 12px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.product-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.product-name {
  font-weight: 600;
  margin-bottom: 5px;
}

.order-summary {
  text-align: right;
  margin-top: 20px;
  font-size: 1.2rem;
  font-weight: 600;
}
</style>