<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'

const route = useRoute()
const router = useRouter()

const status = route.query.status
const code = route.query.code
const message = route.query.message
const orderNo = route.query.order

onMounted(() => {
  setTimeout(() => {
    if (orderNo) {
      router.push(`/orders/${orderNo}`)
    } else {
      router.push('/')
    }
  }, 5000)
})
</script>

<template>
  <div class="payment-result">
    <h1 v-if="status === 'success'" class="success">
      ✅ 付款成功
    </h1>

    <h1 v-else class="failed">
      ❌ 付款失敗
    </h1>

    <p>狀態碼：{{ code }}</p>
    <p>訊息：{{ message }}</p>
    <p v-if="orderNo">訂單編號：{{ orderNo }}</p>

    <p class="redirect-tip">
      5 秒後自動跳轉至訂單頁面...
    </p>
  </div>
</template>

<style scoped>
.success { color: #2ecc71; }
.failed { color: #e74c3c; }
.redirect-tip { margin-top: 20px; color: #888; }
</style>